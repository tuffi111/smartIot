#pragma once
#ifndef ESP_BROADCAST
#define ESP_BROADCAST

#include <vector>
#include <Arduino.h>
#include <AsyncUDP.h>
#include "Log.cpp"

typedef std::function<String(AsyncUDP*)> BroadcastEventHandler;
typedef std::vector<BroadcastEventHandler> BroadcastEventHandlerMap;


class Broadcast {

private:

  AsyncUDP* _udp;
  uint16_t _port = 4200;
  unsigned long _interval = 2000;
  unsigned long _started = 0;
  bool _sending = false;
  BroadcastEventHandlerMap _sendHandler;

  void init(AsyncUDP* udp, uint16_t port, unsigned long interval) {
    this->udp(udp);
    this->port(port);
    this->interval(interval);
  }


public:
  Broadcast() {
    this->init(new AsyncUDP(), this->_port, this->_interval);
  }

  Broadcast(uint16_t port) {
    this->init(new AsyncUDP(), port, this->_interval);
  }

  Broadcast(uint16_t port, unsigned long interval) {
    this->init(new AsyncUDP(), port, interval);
  }

  Broadcast(AsyncUDP* udp) {
    this->init(udp, this->_port, this->_interval);
  }

  Broadcast(AsyncUDP* udp, uint16_t port) {
    this->init(udp, port, this->_interval);
  }

  Broadcast(AsyncUDP* udp, uint16_t port, unsigned long interval) {
    this->init(udp, port, interval);
  }

  Broadcast* setup() {
    return this;
  }

  Broadcast* loop() {
    if (!this->_sending && this->_started > 0) {
      const unsigned long diff = millis() - this->_started;
      if (diff > this->interval()) {
        this->send();
        this->_started = millis();
      }
    }

    return this;
  }

  Broadcast* send() {
    if (this->_sending) return this;  // do not allow overlaping calls
    this->_sending = true;
    for (BroadcastEventHandler handler : this->_sendHandler) {
      //Log::println("-------- SEND to " + String(this->port()) + " :" + String(handler().c_str()));

      Log::println("-------- listenIP: "+String( this->udp()->listenIP().toString()));
      this->udp()->broadcastTo(handler( this->udp() ).c_str(), this->port());
    }
    this->_sending = false;
    return this;
  }

  Broadcast* onSend(BroadcastEventHandler handler) {
    this->_sendHandler.push_back(handler);
    return this;
  }

  Broadcast* start() {
    this->_started = millis();
    return this;
  }

  Broadcast* stop() {
    this->_started = 0;
    return this;
  }

  Broadcast* interval(unsigned long set) {
    this->_interval = set;
    return this;
  }

  unsigned long interval() {
    return this->_interval;
  }

  Broadcast* port(uint16_t set) {
    this->_port = set;
    return this;
  }

  uint16_t port() {
    return this->_port;
  }

  Broadcast* udp(AsyncUDP* set) {
    this->_udp = set;
    return this;
  }

  AsyncUDP* udp() {
    return this->_udp;
  }
};

#endif