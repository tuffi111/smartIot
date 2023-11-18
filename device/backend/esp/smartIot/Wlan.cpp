#pragma once 

#ifndef ESP_WLAN
#define ESP_WLAN

#include <map>
#include <vector>
#include <WiFi.h>
#include "Log.cpp"

typedef std::function<void()> WlanEventHandler;
typedef std::map<String, std::vector<WlanEventHandler>> WlanEventHandlerMap;
//typedef std::function<void(const WiFiEventModeChange&)> WiFiEventModeChange_t;

/**
 * Async wifi:
 *
 * 	WiFiClass wifi;
 *  Wlan wlan(&wifi, "ssid", "pass");    
 * 
 *	void setup() {
 *	  wlan->setup();
 *  }
 *
 * 	void loop() {
 *    wlan->loop();
 *  }
 *
 *  wlan->onConnection([](){
 *     // do whatever you like
 *  });
 *
 *  wlan->onDisconnection([](){
 *    // do whatever you like
 *  });
 *
 *	- or -
 *
 *	class HandlerClass{
 *		public:
 *	 		HandlerClass(Wlan* wlan){
 *	  			wlan->onConnection(std::bind(&HandlerClass::onConnect, this));
 *	  			wlan->onDisconnection(std::bind(&HandlerClass::onDisconnect, this));
 *	 		}
 *	 		void onConnect() {}
 *	    void onDisconnect() {}
 *	};
 *
 */
class Wlan {

private:
  WiFiClass* _wifi;
  String _ssid = "";
  String _pass = "";
  bool _autoReconnect = true;
  unsigned int _maxReconnects = 5;
  unsigned long _maxReconnectTimeout = 60000;  // milliseconds
  unsigned long _reconnectCount = 0;
  unsigned long _currentRetryDelay = 0;
  unsigned long _lastConnectTry = 0;
  bool _keepAlive = true;
  bool _setupDone = false;
  unsigned int _lastState = 0;
  bool _apReady = false;
  WlanEventHandlerMap _WlanEventHandler;
  WiFiMode_t _mode = WIFI_STA;
  unsigned int throttleAutoReconnect = 300;
  inline static const String EVT_CONNECTED = "connected";
  inline static const String EVT_DISCONNECTED = "disconnected";
  inline static const String EVT_MODE_CHANGE = "mode_change";
  inline static const String EVT_RECONNECT = "reconnect";
  inline static const String EVT_MAX_RECONNECTS = "max_reconnects";
  inline static const String EVT_AP_READY = "ap_ready";
  inline static const String EVT_AP_STOP = "ap_stop";

  void connected() {
    if (this->_lastState != 1) {
        this->_lastState = 1;
        Log::println("Wlan", "connected!");
        Log::println("Wlan", "  -- IP address: " + this->wifi()->localIP().toString());
        Log::println("Wlan", "  -- ssid: " + String(this->ssid()));
        Log::println("Wlan", "  -- mode: " + String(this->mode()));        
        this->dispatchEvent(Wlan::EVT_CONNECTED);
    }
  }

  void disconnected() {    
    if (this->_lastState != 2) {        
      this->_lastState = 2;
      Log::println("Wlan", "disconnected");
      this->dispatchEvent(Wlan::EVT_DISCONNECTED);    
    }    
  }

  void init(WiFiClass* wifi, String ssid, String pass) {
    this->wifi(wifi);
    this->ssid(ssid);
    this->password(pass);
  }


public:
  Wlan() {
    this->init(new WiFiClass(), "", "");
  };

  Wlan(String ssid, String pass) {
    this->init(new WiFiClass(), ssid, pass);
  }

  Wlan(WiFiClass* wifi, String ssid, String pass) {
    this->init(wifi, ssid, pass);
  }

  void setup() {
    Log::println("Wlan", "setup start...");
    this->_setupDone = true;

    this->wifi()->onEvent(std::bind(&Wlan::onWiFiEvent, this, std::placeholders::_1));

    if (this->mode() != this->wifi()->getMode()) {
      this->mode(this->mode());
    }

    Log::println("Wlan", "-- ssid: " + String(this->ssid()));
    Log::println("Wlan", "-- pass: " + String(this->password() ? "****" : "<not set>"));
    Log::println("Wlan", "-- mode should: " + String(this->mode()));
    Log::println("Wlan", "-- mode is: " + String(this->wifi()->getMode()));
    Log::println("Wlan", "setup done.");
  }



  void start() {
    if (!this->_setupDone) this->setup();
    Log::println("Wlan", "connect to: " + String(this->ssid()) + " (Password: " + String(this->password() ? "****" : "<not set>") + ")");
    this->wifi()->begin(this->ssid(), this->password());
  }

  void wait() {
    Log::println("Wlan", "Wait for connection...");
    this->start();
    while (this->isConnected()) {
      Log::out(Log::VERBOSE, ".");
      delay(333);
    }
  }

  void onWiFiEvent(WiFiEvent_t event) {
    switch (event) {
      /*
      case SYSTEM_EVENT_AP_START:
        this->apReady(true);
      break;
      case SYSTEM_EVENT_AP_STOP:
        this->apReady(false);
      break;
      //case SYSTEM_EVENT_AP_STACONNECTED:
      //case SYSTEM_EVENT_AP_STADISCONNECTED:
      case SYSTEM_EVENT_STA_STOP:
      case SYSTEM_EVENT_STA_LOST_IP:
      //case SYSTEM_EVENT_STA_DISCONNECTED:
        // try reconnect here (after delay???)
        Log::println("Wlan", "Event: WiFi disconnected ");
        this->disconnected();
        break;
      case SYSTEM_EVENT_STA_GOT_IP:
        // Connected successfully
        Log::println("Wlan", "Event: Connected successfully");
        this->connected();
        break;/**/
      case SYSTEM_EVENT_AP_START:
        this->apReady(true);
      break;
      case SYSTEM_EVENT_AP_STOP:
        this->apReady(false);
      break;
      case SYSTEM_EVENT_STA_DISCONNECTED:
      break;
      default:
        // Display additional events???
        Log::println("Wlan", "Event: " + String(event));
    }
  }

  bool isConnected() {
    if (this->wifi()->status() == WL_CONNECTED) {
      if (this->_lastState != 1) {
        this->connected();
      }
      return true;
    } else {
      if (this->autoReconnect()) {
          this->reconnect();
      }else{
        this->disconnected();
      }
      return false;
    }
  }

  void reconnect(bool force = false) {
    if (force || this->_reconnectCount < this->maxReconnects()) {
      if (force || millis() > (this->_lastConnectTry + this->_currentRetryDelay)) {
        if (!force) {
          this->_reconnectCount++;
          this->_lastConnectTry = millis();
          this->_currentRetryDelay = ((1 + sin((M_PI * (this->_reconnectCount * (1 / (float)this->maxReconnects()))) + (1.5 * M_PI))) / 2) * this->_maxReconnectTimeout;
        }

        Log::println("Wlan", "Connection attempt #" + String(this->_reconnectCount) + " of " + String(this->maxReconnects()) + " (next attempt in " + String(this->_currentRetryDelay) + " ms)");
        this->dispatchEvent(Wlan::EVT_RECONNECT);
        this->start();
      } else {
        //Log::out(".", Log::VERBOSE);
      }
    } else {
      if (this->keepAlive()) {
        this->_reconnectCount = 0;
        this->_currentRetryDelay = 0;
      } else {
        //Log::println("Wlan", "Max reconnection attempts reached. Giving up; can't connect.");        
        this->disconnected();
      }
    }
  }


  bool apReady(){
    return this->_apReady;    
  }

  void apReady(bool set){
    this->_apReady = set;
    if(set){
      Log::println("Wlan", "ap ready");
      this->dispatchEvent(Wlan::EVT_AP_READY);
    }else{
      Log::println("Wlan", "ap stop");
      this->dispatchEvent(Wlan::EVT_AP_STOP);
    }
  }

  void onConnection(WlanEventHandler handler) {
    this->bindEvent(Wlan::EVT_CONNECTED, handler);
  }

  void onDisconnection(WlanEventHandler handler) {
    this->bindEvent(Wlan::EVT_DISCONNECTED, handler);
  }

  void onModeChange(WlanEventHandler handler) {
    this->bindEvent(Wlan::EVT_MODE_CHANGE, handler);
  }

  void onReconnect(WlanEventHandler handler) {
    this->bindEvent(Wlan::EVT_RECONNECT, handler);
  }

  void onMaxReconnects(WlanEventHandler handler) {
    this->bindEvent(Wlan::EVT_MAX_RECONNECTS, handler);
  }

  void bindEvent(String event, WlanEventHandler handler) {
    this->_WlanEventHandler[event].push_back(handler);
  }

  void dispatchEvent(String event) {
    for (WlanEventHandler handler : this->_WlanEventHandler[event]) {
      handler();
    }
  }

  WiFiClass* wifi() {
    return this->_wifi;
  }

  Wlan* wifi(WiFiClass* set) {
    this->_wifi = set;
    return this;
  }

  String ssid() {
    return this->_ssid;
  }

  Wlan* ssid(String set) {
    this->_ssid = set;
    return this;
  }

  String password() {
    return this->_pass;
  }

  Wlan* password(String set) {
    this->_pass = set;
    return this;
  }

  bool autoReconnect() {
    return this->_autoReconnect;
  };

  Wlan* autoReconnect(bool set) {
    this->_autoReconnect = set;
    return this;
  };

  unsigned int maxReconnects() {
    return this->_maxReconnects;
  };

  Wlan* maxReconnects(unsigned int set) {
    this->_maxReconnects = set;
    return this;
  };

  unsigned long maxReconnectTimeout() {
    return this->_maxReconnectTimeout;
  };

  Wlan* maxReconnectTimeout(unsigned long set) {
    this->_maxReconnectTimeout = set;
    return this;
  };


  bool keepAlive() {
    return this->_keepAlive;
  };

  Wlan* keepAlive(bool set) {
    this->_keepAlive = set;
    return this;
  };


  WiFiMode_t mode() {
    //Log::println("Wlan", "get mode: " + String(this->_mode));
    return this->_mode;
  }

  Wlan* mode(WiFiMode_t mode) {
    //Log::println("Wlan", "Set wifi mode to: "+String(mode));
    this->_mode = mode;
    WiFiMode_t oldMode = this->wifi()->getMode();
    if (oldMode == mode) {
      Log::println("Wlan", " ==> mode is already: " + String(oldMode));
    } else {
      //Log::println("Wlan", "==> mode should be: " + String(this->mode()));
      this->wifi()->mode(this->mode());
      this->dispatchEvent(Wlan::EVT_MODE_CHANGE);
      /*Log::println("Wlan",
                "==> mode should be: "
                  + String(this->mode())
                  + " - mode is: "
                  + String(this->wifi()->getMode())
                  + " - mode was: "
                  + String(oldMode));/**/
    }
    return this;
  }

  void loop() {
    this->isConnected();
  }
};

#endif