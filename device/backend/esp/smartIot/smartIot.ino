#ifndef ESP_FW
#define ESP_FW
/*
    "./data" folder upload:
    https://randomnerdtutorials.com/esp32-littlefs-arduino-ide/
*/

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <utility>
#include <DNSServer.h>
#include <Adafruit_NeoPixel.h>
#include <AsyncUDP.h>
//#include <NTPClient.h>

#include "Log.cpp"
#include "Console.cpp"
#include "Wlan.cpp"
#include "CaptiveWebServer.cpp"
#include "Http.cpp"
#include "Broadcast.cpp"
#include "Routes.cpp"
#include "Tools.cpp"
#include "EspNeoPixel.cpp"

//AsyncUDP udp;



//#define JSON_SIZE 8192
//#define JSON_SIZE 4096
//#define JSON_SIZE 2048
//#define JSON_SIZE 1024
#define JSON_SIZE 3072
#define PIN 33
#define LAMPS 6
#define PIXELPERLAMP 7
#define FADEINDELAY 77
#define DELAYVAL 333
#define MAXCOLOR 128
#define NUMPIXELS (PIXELPERLAMP * LAMPS)

uint8_t httpPort = 80;  // todo: share w/ js vue/main.js

// Wlan
String wlanSsid = "Inet2";
String wlanPass = "B1gBadM0nsters!7771";

// AP
Console console(115200);
IPAddress apIP(192, 168, 1, 1);
IPAddress apGateway(192, 168, 1, 1);
IPAddress apNetMask(255, 255, 255, 0);
String apHostname = "esp32";
String apSsid = "ESPAp";
String apPass = "12345678";
char *http_username = "admin";
char *http_password = "esp32";
uint16_t broadcastPort = 4200;

Files files;
DNSServer dnsServer;
Wlan wlan(wlanSsid, wlanPass);
Broadcast broadcast(broadcastPort);
CaptiveWebServer server(apIP, httpPort);
Http http(&server, &files);
Routes routes(&http);
EspNeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);



AsyncWebSocket ws("/ws");


//String _requestData;
/**
void onRequest(AsyncWebServerRequest *request, String data) {

  Log::println("POST request");
  // /set
  if (request->url() == "/set") {
    //requestInfo(request);
    // json_decode
    DynamicJsonDocument doc = Tools::json_decode(data, JSON_SIZE);
    if (doc.isNull()) {
      Log::println("POST /set: Request error for '/set': no or invalid json data");
      request->send(400, "text/plain", "Request error for '/set': no or invalid json data");
      return;
    }

    JsonObject data = doc.as<JsonObject>();

    for (JsonPair led : data) {
      const char *key = led.key().c_str();
      //Log::println("POST /set: JSON DATA: '" + String(key) + "' = '" + String(led.value().as<String>()) + "'");
    }


    // Update leds
    updateLeds(data);
    pixels.show();

    // Store data
    Log::println("Write data");
    files.location("/data.json")->write(doc.as<String>());

    // Response
    Log::println("Build response");
    String response;
    StaticJsonDocument<128> responseData;
    responseData["status"] = "ok";
    serializeJson(responseData, response);

    Log::println("Send response");
    request->send(200, "application/json", response);   
  }
}/**/

void setup() {
  Log::set(Log::VERBOSE);

  console.onReady([]() {
           Log::println("console ready");
           http.auth(http_username, http_password);

           broadcast.onSend([](AsyncUDP *udp) {
             //String response;
             //StaticJsonDocument<128> responseData;
             DynamicJsonDocument responseData(JSON_SIZE);
             responseData["name"] = "smartESP";
             responseData["ts"] = millis();
             //responseData["IPAddress"] = udp->listenIP().toString();
             //responseData["IP6Address"] = udp->listenIPv6().toString();
             //responseData["IPAddress"] = udp->IPAddress;
             //responseData["localIP"] = udp->localIP;
             //responseData["apIP"] = udp->apIP;
             
             String response = Tools::json_encode(responseData);
             Log::println("Send response", response);
             return response;
             //request->send(200, "application/json", response);
             //return "ESP32 UDP BRDCST TEST (" + String(millis()) + ")";
           });

           wlan.mode(WIFI_STA);
           wlan.maxReconnects(3);
           wlan.maxReconnectTimeout(10000);
           wlan.keepAlive(false);

           wlan.onDisconnection([]() {
             Log::println("MAIN", "Can't connect to Wifi '" + String(wlanSsid) + "'. Start Hotspot '" + String(apSsid) + "'");
             broadcast.stop();
             wlan.mode(WIFI_AP);
             wlan.wifi()->softAPConfig(apIP, apGateway, apNetMask);
             wlan.wifi()->softAP(apSsid, apPass);
             server.enableCaptiveRedirect();
           });

           wlan.onConnection([]() {
             broadcast.start();
           });

           broadcast.setup();
           wlan.setup();
           http.setup();
           server.begin();
           pixels.setup();

           Log::println("Data read...");
           String fileContent = files.location("/data.json")->read();
           //Log::println("Data read: " + String(data));

           Log::println("Decode data...");
           DynamicJsonDocument doc = Tools::json_decode(fileContent, JSON_SIZE);

           Log::println("Free filecontent");
           //delete &fileContent;

           // Update leds
           Log::println("Check doc");
           if (!doc.isNull()) {
             Log::println("Convert data ");
             JsonObject data = doc.as<JsonObject>();
             Log::println("Update Leds ");
             pixels.update(data);
             Log::println("Free data");
             data.clear();
             Log::println("Show pixels");
             pixels.show();
           } /**/

           Log::println("Ready!");
         })
    ->wait();


  /**
  http.on("/get", [](AsyncWebServerRequest *request) {
    String data = files.location("/data.json")->read();
    request->send(200, "application/json", String(data));
  });
  /**/
  /*
  routes()->get("/get", [](AsyncWebServerRequest *request) {
    Log::println("/GET");
    String data = files.location("/data.json")->read();
    request->send(200, "application/json", String(data));
  });

  routes()->post("/set", [](AsyncWebServerRequest *request, String data) {
    Log::println("/SET");
    // /set
    if (request->url() == "/set") {
      //requestInfo(request);
      // json_decode
      DynamicJsonDocument doc = Tools::json_decode(data, JSON_SIZE);
      if (doc.isNull()) {
        Log::println("POST /set: Request error for '/set': no or invalid json data");
        request->send(400, "text/plain", "Request error for '/set': no or invalid json data");
        return;
      }

      JsonObject data = doc.as<JsonObject>();

      for (JsonPair led : data) {
        const char *key = led.key().c_str();
        //Log::println("POST /set: JSON DATA: '" + String(key) + "' = '" + String(led.value().as<String>()) + "'");
      }


      // Update leds
      pixels.update(data);
      pixels.show();

      // Store data
      Log::println("Write data");
      files.location("/data.json")->write(doc.as<String>());

      // Response
      Log::println("Build response");
      String response;
      StaticJsonDocument<128> responseData;
      responseData["status"] = "ok";
      serializeJson(responseData, response);

      Log::println("Send response");
      request->send(200, "application/json", response);
      /**/
  /*}
  });/**/

  /*
  server.onRequestBody([_requestData](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    Log::println("onRequestBody:");
    Log::println("-- Len: " + String(len));
    Log::println("-- Index: " + String(index));
    Log::println("-- Total: " + String(total));

    if (len < total) {
      // Chunked request
      if (index == 0) {
        // first chunk
        _requestData = String((char *)data);
      } else if (len + index >= total) {
        // last chunk
        _requestData += String((char *)data);
        onRequest(request, _requestData);
      } else {
        // chunk
        _requestData += String((char *)data);
      }
    } else {
      // only chunk
      onRequest(request, String((char *)data));
    }
  });/**/
}

void loop() {
  wlan.loop();
  http.loop();
  broadcast.loop();
  delay(300);
}


void requestInfo(AsyncWebServerRequest *request) {
  Log::println("SET REQUEST");

  Log::println("Request");
  Log::println("===================");
  Log::println("-- Host: " + String(request->host()));
  Log::println("-- Url: " + String(request->url()));
  Log::println("-----------------------------------------------");


  Log::println("HEADERS:");
  for (int i = 0; i < request->headers(); i++) {
    Log::println("" + String(request->getHeader(i)->name()) + " = " + String(request->getHeader(i)->value()));
  }
  Log::println("-----------------------------------------------");

  Log::println("PARAMS:");
  int params = request->params();  // amount of params
  for (int i = 0; i < params; i++) {
    AsyncWebParameter *p = request->getParam(i);
    Serial.printf("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
  }
  Log::println("################################################");
}

#endif