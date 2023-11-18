#pragma once 

#ifndef ESP_CAPTIVE_WEBSERVER
#define ESP_CAPTIVE_WEBSERVER

#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include "Log.cpp"
#include "IPAddress.h"
#include "EspServer.cpp"
#include <map>
#include <WiFiClient.h>
#include <DNSServer.h>

#ifndef APSSID
#define APSSID "ESP_ap"
#define APPSK "12345678"
#endif


class CaptiveWebServer : public EspServer {
  using EspServer::EspServer;

private:
  DNSServer* _dnsServer;
  char* _hostname = "esp";
  byte _dnsPort = 53;
  IPAddress _apIP;
  bool _enabled = false;
  bool _started = false;
  std::map<String, ArRequestHandlerFunction> _handler;

  ArRequestHandlerFunction _notFoundHandler;


public:
  CaptiveWebServer(IPAddress apIP)
    : EspServer(80) {
    this->dnsServer(new DNSServer());
    this->apIP(apIP);
    this->_apIP = apIP;
  }

  CaptiveWebServer(IPAddress apIP, uint16_t port)
    : EspServer(port) {
    this->dnsServer(new DNSServer());
    this->apIP(apIP);
  }

  CaptiveWebServer(IPAddress apIP, uint16_t port, DNSServer* dnsServer)
    : EspServer(port) {
    this->dnsServer(dnsServer);
    this->apIP(apIP);
  }

  CaptiveWebServer()
    : EspServer(80) {
    this->dnsServer(new DNSServer());
    IPAddress ip(172, 217, 28, 1);
    this->apIP(ip);
  }

  virtual ~CaptiveWebServer() {}


  void setup() {
    Log::println("CaptiveWebServer: Configuring access point...");

    this->dnsServer()->setErrorReplyCode(DNSReplyCode::NoError);

    //this->on("/generate_204", HTTP_ANY, std::bind(&CaptiveWebServer::handleRoot, this, std::placeholders::_1));  // Android captive portal. Maybe not needed. Might be handled by notFound handler.
    //this->on("/fwlink", HTTP_ANY, std::bind(&CaptiveWebServer::handleRoot, this, std::placeholders::_1));        // Microsoft captive portal. Maybe not needed. Might be handled by notFound handler.

    EspServer::onNotFound(std::bind(&CaptiveWebServer::handleNotFound, this, std::placeholders::_1));

    Log::println("CaptiveWebServer: HTTP server started");
  }


  void loop() {
    if (this->captiveRedirectEnabled()) {
      if (!this->started()) {
        this->started(true);

        /* Setup the DNS server redirecting all the domains to the apIP */
        Log::println("CaptiveWebServer: Start dns server");
        this->dnsServer()->start(this->dnsPort(), "*", this->apIP());

        Log::println("CaptiveWebServer: Start mdns responder...");
        if (!MDNS.begin(this->hostname())) {
          Log::println("CaptiveWebServer: Error setting up MDNS responder!");
        } else {
          Log::println("CaptiveWebServer: mDNS responder started");
          MDNS.addService("http", "tcp", 80);
        }
      }

      this->dnsServer()->processNextRequest();
    } else {
      if (this->started()) {
        this->started(false);
        MDNS.end();
        this->dnsServer()->stop();
      }
    }
  }


  AsyncCallbackWebHandler& on(const char* uri, ArRequestHandlerFunction onRequest) {
    return EspServer::on(uri, this->requestHandler(onRequest));
  }
  AsyncCallbackWebHandler& on(const char* uri, WebRequestMethodComposite method, ArRequestHandlerFunction onRequest) {
    return EspServer::on(uri, method, this->requestHandler(onRequest));
  }
  AsyncCallbackWebHandler& on(const char* uri, WebRequestMethodComposite method, ArRequestHandlerFunction onRequest, ArUploadHandlerFunction onUpload) {
    return EspServer::on(uri, method, this->requestHandler(onRequest), onUpload);
  }
  AsyncCallbackWebHandler& on(const char* uri, WebRequestMethodComposite method, ArRequestHandlerFunction onRequest, ArUploadHandlerFunction onUpload, ArBodyHandlerFunction onBody) {
    return EspServer::on(uri, method, this->requestHandler(onRequest), onUpload, onBody);
  }

  ArRequestHandlerFunction requestHandler(ArRequestHandlerFunction onRequest) {
    return [onRequest,this](AsyncWebServerRequest* request) {
      if (this->captivePortal(request)) {
        return;
      }
      onRequest(request);
    }; /**/
  }


  void onNotFound(ArRequestHandlerFunction handler) {
    this->_notFoundHandler = handler;
  }



  void handleNotFound(AsyncWebServerRequest* request) {
    Log::println("CaptiveWebServer: Handle not found (" + String(request->host()) + "  " + String(request->url()) + ")");

    if (this->captivePortal(request)) {  // If caprive portal redirect instead of displaying the error page.
      return;
    }

    if (this->_notFoundHandler) {
      Log::println("CaptiveWebServer: 404 - call custom not found handler");
      (this->_notFoundHandler)(request);

    } else {
      Log::println("CaptiveWebServer: 404 - Send file not found response");

      String message = F("File Not Found\n\n");
      message += F("URI: ");
      message += request->url();
      message += F("\nMethod: ");
      message += (request->method() == HTTP_GET) ? "GET" : "POST";
      message += F("\nArguments: ");
      message += request->args();
      message += F("\n");

      for (uint8_t i = 0; i < request->args(); i++) { message += String(F(" ")) + request->argName(i) + F(": ") + request->arg(i) + F("\n"); }

      AsyncWebServerResponse* response = request->beginResponse(404, "text/plain", message);
      response->addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      response->addHeader("Pragma", "no-cache");
      response->addHeader("Expires", "-1");
      request->send(response);
    }
  }

  void handleRoot(AsyncWebServerRequest* request) {
    Log::println("CaptiveWebServer: Handle root (" + String(request->host()) + "  " + String(request->url()) + ")");

    if (this->captivePortal(request)) {  // If caprive portal redirect instead of displaying the page.
      return;
    }

    String Page;
    Page += F("<!DOCTYPE html><html lang='en'><head>"
              "<meta name='viewport' content='width=device-width'>"
              "<title>CaptivePortal</title></head><body>"
              "<h1>HELLO WORLD!!</h1>");
    if (request->client()->localIP() == this->apIP()) {
      Page += String(F("<p>You are connected through the soft AP ")) + F("</p>");
    } else {
      Page += String(F("<p>You are connected through the wifi network")) + F("</p>");
    }
    Page += F("<p>You may want to <a href='/wifi'>config the wifi connection</a>.</p>"
              "</body></html>");

    AsyncWebServerResponse* response = request->beginResponse(200, "text/html", Page);
    response->addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response->addHeader("Pragma", "no-cache");
    response->addHeader("Expires", "-1");
    request->send(response);
  }

  /** Redirect to captive portal if we got a request for another domain. Return true in that case so the page handler do not try to handle the request again. */
  bool captivePortal(AsyncWebServerRequest* request) {
    /*
    Log::println("CHECK captivePortal");
    Log::println("===================");
    Log::println("-- Host: " + String(request->host()));
    Log::println("-- Host is IP: " + String(this->isIp(request->host())));
    Log::println("-- Hostname: " + String(this->hostname()) + ".local");
    Log::println("-- Url: " + String(request->url()));
    Log::println("-----------------------------------------------");

    /*
    Log::println("HEADERS:");
    for (int i = 0; i < request->headers(); i++) {
      Log::println("CHECK captivePortal HEADER: " + String(request->getHeader(i)->name()) + " = " + String(request->getHeader(i)->value()));
    }

    Log::println("PARAMS:");
    for (int i = 0; i < request->params(); i++) {
      Log::println("CHECK captivePortal PARAM: " + String(request->getParam(i)->value()) + " = " + String(request->getParam(i)->value()));
    }/**/

    if (!this->isIp(request->host()) && request->host() != (String(this->hostname()) + ".local")) {
      Log::println("Redirected request to captive portal " + String("http://") + this->toStringIp(request->client()->localIP()));
      request->redirect(String("http://") + this->toStringIp(request->client()->localIP()));
      request->send(302, "text/plain", "");  // Empty content inhibits Content-length header so we have to close the socket ourselves.
      request->client()->stop();             // Stop is needed because we sent no content length
      return true;
    }
    return false;
  }

  boolean isIp(String str) {
    for (size_t i = 0; i < str.length(); i++) {
      int c = str.charAt(i);
      if (c != '.' && (c < '0' || c > '9')) { return false; }
    }
    return true;
  }


  String toStringIp(IPAddress ip) {
    String res = "";
    for (int i = 0; i < 3; i++) { res += String((ip >> (8 * i)) & 0xFF) + "."; }
    res += String(((ip >> 8 * 3)) & 0xFF);
    return res;
  }


  CaptiveWebServer* enableCaptiveRedirect(bool set = true) {
    this->_enabled = set;
    return this;
  }

  CaptiveWebServer* disableCaptiveRedirect(bool set = true) {
    this->enableCaptiveRedirect(!set);
    return this;
  }

  bool captiveRedirectEnabled() {
    return this->_enabled;
  }

  CaptiveWebServer* started(bool set) {
    this->_started = set;
    return this;
  }

  bool started() {
    return this->_started;
  }

  CaptiveWebServer* dnsPort(byte set) {
    this->_dnsPort = set;
    return this;
  }

  byte dnsPort() {
    return this->_dnsPort;
  }

  CaptiveWebServer* apIP(IPAddress set) {
    this->_apIP = set;
    return this;
  }

  IPAddress apIP() {
    return this->_apIP;
  }

  CaptiveWebServer* hostname(char* set) {
    this->_hostname = set;
    return this;
  }

  char* hostname() {
    return this->_hostname;
  }

  CaptiveWebServer* dnsServer(DNSServer* set) {
    this->_dnsServer = set;
    return this;
  }

  DNSServer* dnsServer() {
    return this->_dnsServer;
  }
};
#endif