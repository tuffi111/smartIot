#pragma once
#ifndef ESP_TOOLS
#define ESP_TOOLS

#include <string>
#include <vector>
#include <sstream>
#include <ArduinoJson.h>
#include "Log.cpp"

class Tools {
public:

  // explode
  static std::vector<std::string> explode(std::string const& str, char delim) {
    std::vector<std::string> result;
    std::istringstream iss(str);

    for (std::string token; std::getline(iss, token, delim);) {
      result.push_back(std::move(token));
    }

    return result;
  }


  static String json_encode(DynamicJsonDocument doc) {
    String response;
    serializeJson(doc, response);
    return response;
  }

  // json_decode
  static DynamicJsonDocument json_decode(String data) {
    return json_decode((uint8_t*)data.c_str(), 1024);
  }

  static DynamicJsonDocument json_decode(uint8_t* data) {
    return json_decode(data, 1024);
  }

  static DynamicJsonDocument json_decode(String data, size_t size) {
    return json_decode((uint8_t*)data.c_str(), size);
  }

  static DynamicJsonDocument json_decode(uint8_t* data, size_t size) {
    DynamicJsonDocument doc(size);
    Log::println("json_decode data: " + String((char*)data));
    DeserializationError error = deserializeJson(doc, data);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      doc.clear();
    }

    return doc;
  }
};
#endif