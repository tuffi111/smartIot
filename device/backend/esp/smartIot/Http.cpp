#pragma once
#ifndef ESP_HTTP
#define ESP_HTTP

#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include <map>
#include <WiFiClient.h>
#include <DNSServer.h>
#include <LittleFS.h>
#include "Log.cpp"
#include "Files.cpp"
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "Log.cpp"
#include "IPAddress.h"
#include "CaptiveWebServer.cpp"


#ifndef APSSID
#define APSSID "ESP_ap"
#define APPSK "12345678"
#endif

class Http {

private:
  CaptiveWebServer* _server;  
  ArRequestHandlerFunction _notFoundHandler;
  char* _auth_user;
  char* _auth_pass;
  String _public;
  std::vector<String> lookupFiles{ "", "/index.html", ".html", "/index.js", ".js", "/index.htm", ".htm" };
  String _htdocsFolder = "";
  Files* _files;

public:
  Http(CaptiveWebServer* server) {
    this->server(server);
    this->files(new Files());
  }

  Http(CaptiveWebServer* server, Files* files) {
    this->server(server);
    this->files(files);
  }

  void setup() {
    Log::println("Http: setup...");

    this->files()->setup();
    this->server()->setup();

    this->server()->on("/", [this](AsyncWebServerRequest* request) {
      if (this->_auth_user) {
        if (!request->authenticate(this->_auth_user, this->_auth_pass))
          return request->requestAuthentication();
      }

      for (auto fileLocation : this->lookupFiles) {
        if (this->sendFile(this->fileLocation(fileLocation), request)) {
          Log::println("Send file from fs: '" + String(fileLocation) + "'");
          return;
        }
      }

      Log::println("No index file found in /");
      this->notFound(request);
    });

    // onNotFound: try to read from fs before fail
    this->server()->onNotFound([this](AsyncWebServerRequest* request) {
      Log::println("Http: On NOT FOUND handling (" + String(request->host()) + "  " + String(request->url()) + ")");

      if (this->_auth_user) {
        if (!request->authenticate(this->_auth_user, this->_auth_pass))
          return request->requestAuthentication();
      }

      String fileLocation = this->fileLocation(request->url());
      if (this->sendFile(fileLocation, request)) {
        Log::println("Http: File sent from fs: '" + String(fileLocation) + "'");
        return;
      }

      Log::println("Http: File not found: " + String(fileLocation) + "");
      this->notFound(request);
    }); /**/
  }

  void loop() {
    this->server()->loop();
  }

  void notFound(AsyncWebServerRequest* request) {
    request->send(404, "text/plain", "File not found");
  }

  bool sendFile(String fileLocation, AsyncWebServerRequest* request) {
    if (this->files()->location(fileLocation)->isFile()) {
      Log::println("SEND file '" + String(fileLocation) + "'");
      request->send(LittleFS, fileLocation);
      return true;
    }    
    return false;
  }

  String processor(const String& var) {
    Serial.println("process variable " + var);
    if (var == "TITLE") {
      return "ESP - Template";
    }
    return String();
  }


  AsyncCallbackWebHandler& on(const char* uri, ArRequestHandlerFunction onRequest) {
    return this->server()->on(uri, this->requestHandler(onRequest));
  }
  AsyncCallbackWebHandler& on(const char* uri, WebRequestMethodComposite method, ArRequestHandlerFunction onRequest) {
    return this->server()->on(uri, method, this->requestHandler(onRequest));
  }
  AsyncCallbackWebHandler& on(const char* uri, WebRequestMethodComposite method, ArRequestHandlerFunction onRequest, ArUploadHandlerFunction onUpload) {
    return this->server()->on(uri, method, this->requestHandler(onRequest), onUpload);
  }
  AsyncCallbackWebHandler& on(const char* uri, WebRequestMethodComposite method, ArRequestHandlerFunction onRequest, ArUploadHandlerFunction onUpload, ArBodyHandlerFunction onBody) {
    return this->server()->on(uri, method, this->requestHandler(onRequest), onUpload, onBody);
  }

  ArRequestHandlerFunction requestHandler(ArRequestHandlerFunction onRequest) {
    return [onRequest, this](AsyncWebServerRequest* request) {
      if (this->_auth_user) {
        if (!request->authenticate(this->_auth_user, this->_auth_pass))
          return request->requestAuthentication();
      }
      onRequest(request);
    }; /**/
  }


  String fileLocation(String path) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    if (path.endsWith("/")) {
      path = path.substring(0, (path.length() - 1));
    }

    return this->_htdocsFolder + "/" + path;
  }


  Http* server(CaptiveWebServer* set) {
    this->_server = set;
    return this;
  }

  CaptiveWebServer* server() {
    return this->_server;
  }

  Http* files(Files* set) {
    this->_files = set;
    return this;
  }

  Files* files() {
    return this->_files;
  }

  Http* auth(char* user, char* pass) {
    this->_auth_user = user;
    this->_auth_pass = pass;
    return this;
  }
};
#endif