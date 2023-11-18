#ifndef ESP_NEOPIXEL
#define ESP_NEOPIXEL

#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include "Log.cpp"

class EspNeoPixel : public Adafruit_NeoPixel {
  using Adafruit_NeoPixel::Adafruit_NeoPixel;

private:

public:
  void setup() {
    this->begin();
  }


  void update(JsonObject data) {
    Log::println("UPDATE LEDS");
    for (JsonPair led : data) {
      const char *key = led.key().c_str();
      JsonArray colors = led.value().as<JsonArray>();

      uint16_t idx = atol(key);
      uint8_t R = (uint8_t)colors[0];
      uint8_t G = (uint8_t)colors[1];
      uint8_t B = (uint8_t)colors[2];
      uint32_t color = this->Color(R, G, B);

      this->setPixelColor(idx, color);

      /*
    for (String color : colors) {
      Serial.println("SET1 LED #" + String(key) + " = " + color);
    }
    for (uint8_t color : colors) {
      Serial.println("SET2 LED #" + String(key) + " = " + String(color));
    }
    Serial.println("LED #" + String(key));
    Serial.println("SET LED R#" + String(key) + " = " + String(R));
    Serial.println("SET LED G#" + String(key) + " = " + String(G));
    Serial.println("SET LED B#" + String(key) + " = " + String(B));
    Serial.println("Color #" + String(key) + " = " + String(color));
    /**/
    }
  }
};


#endif