#pragma once
#ifndef ESP_ROUTES
#define ESP_ROUTES

#include <map>
#include <vector>
#include <ESPAsyncWebServer.h>
#include "Log.cpp"
#include "Http.cpp"


typedef std::function<void(AsyncWebServerRequest, String)> RouteHandler;
typedef std::map<String, std::map<String, std::vector<RouteHandler>>> RouteHandlerMap;

class Routes {

private:

  String _requestData;
  RouteHandlerMap _routes;
  Http *_http;

public:
  Routes(Http *http) {
    this->http(http);
  }

  void setup() {
    // Handle POST requests
    this->http()->server()->onRequestBody([this](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
      if (len < total) {
        // Chunked request
        if (index == 0) {
          // first chunk
          this->_requestData = String((char *)data);
        } else if (len + index >= total) {
          // last chunk
          this->_requestData += String((char *)data);
          this->onPostRequest(request, _requestData);
        } else {
          // chunk
          this->_requestData += String((char *)data);
        }
      } else {
        // only chunk
        this->onPostRequest(request, String((char *)data));
      }
    });
  }


  void onPostRequest(AsyncWebServerRequest *request, String data) {
    Log::println("POST request");
    String route = request->url();
    /*
    if (this->_routes["post"] & this->_routes["post"][route]) {
      for (RouteHandler handler : this->_routes["post"][route]) {
        handler(request, data);
      }
    }/**/
  }


  Routes *get(String route, ArRequestHandlerFunction handler) {
    //this->http()->server->on((char*)route.c_str(), handler);
    //this->http()->server()->on(route, handler);
    return this;
  }

  Routes *post(String route, RouteHandler handler) {
    /*
    if (!this->_routes["post"]) {
      this->_routes["post"] = [];  // new std::map<String, std::vector<RouteHandler>>
    }

    this->_routes["post"][route].push_back(handler);
    /**/
    return this;
  }

  Routes *any(String route, RouteHandler handler) {
    //this->get(route, handler);
    //this->post(route, handler);
    return this;
  }

  Routes *http(Http *set) {
    this->_http = set;
    return this;
  }

  Http *http() {
    return this->_http;
  }
};

#endif