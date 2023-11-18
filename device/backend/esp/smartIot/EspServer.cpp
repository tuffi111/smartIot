#pragma once 

#ifndef ESP_WEBSERVER
#define ESP_WEBSERVER

#include <ESPAsyncWebServer.h>

class EspServer : public AsyncWebServer {
  using AsyncWebServer::AsyncWebServer;

public:

  virtual ~EspServer() {}


  void setup() {
  }


  void loop() {
  }
};
#endif 