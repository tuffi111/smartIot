#pragma once

#ifndef ESP_CONSOLE
#define ESP_CONSOLE
#include <Arduino.h>


typedef std::function<void()> ReadyHandler;

class Console {

  private:
    long baud;
    bool _setupDone = false;
    bool _ready = false;
    ReadyHandler _onReadyHandler;

  
  public:
    Console(long baud=460800) {
      this->baud=baud;          
    }


    Console* setup(){
      Serial.println("Console: Setup...");
      Serial.println("Console:  -- baud: "+ String( this->baud));
      Serial.begin(this->baud);
      this->_setupDone = true;
      return this;
    }

   
    Console* wait(){
      if(!this->_setupDone)this->setup();
      Serial.println("Console: Wait for serial (@ "+ String( this->baud ) + String(")..."));
	    while (! Serial);
      Serial.println("");
      Serial.println("Console: Serial started (@ "+ String( this->baud )+ ")" );
      this->dispatchReady();	  
      return this;
    }

    Console* loop(){
      if( !this->_ready && Serial ){			
        this->dispatchReady();
      }
      return this;
    }

    void dispatchReady(){ 
      if( this->_ready) return;
      this->_ready = true;
      if( this->_onReadyHandler ){      
        delay(50);        
        this->_onReadyHandler();
      }
    }

    Console* onReady( ReadyHandler handler ){
      this->_onReadyHandler = handler;
      return this;
    }

    bool ready(){
      return this->_ready;
    }
};

#endif