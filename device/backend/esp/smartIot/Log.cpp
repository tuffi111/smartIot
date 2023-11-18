#pragma once

#ifndef ESP_LOG
#define ESP_LOG
#include <Arduino.h>

class Log
{
  private:
    inline static int logLevel = 4;
    inline static bool lastBr = false;

  public:
    typedef enum Level
    {
        NONE = 0,
        DEV = 1,
        STAGE = 2,
        PROD = 4,
        VERBOSE = 8,
        ERROR = 16,
    };
    
    static void set(int set){
      Log::logLevel = set;
    }

    static int get(){
      return Log::logLevel;
    }

    static bool has(int level){    
      return !!((Log::get() & level) > 0);
    }

    static void println(String text){
        Serial.println(text);    
    }

    static void println(String section, String text){
        Serial.println(section+": "+text);   
    }


    static void print(String text){
        Serial.print(text);    
    }


    static void line(String text, Level level = Level::DEV){
      if( Log::has(level) ){
        Log::println((Log::lastBr? "":"\n")+ text);
        Log::lastBr = true;
      }
    }

    static void line(String text, String verboseData, Level level = Level::DEV){
      if( Log::has(level) ){
        Log::println((Log::lastBr? "":"\n")+ text+": "+verboseData);
        Log::lastBr = true;
      }
    }

    static void line(Level level, String text, String verboseData = ""){
      if( Log::has(level) ){
        Log::println((Log::lastBr? "":"\n")+ text+ (verboseData? ": "+verboseData : "" ));
        Log::lastBr = true;
      }
    }


    static void out(String text, Level level = Level::DEV){
      if( Log::has(level) ){
        Log::print(text);
        Log::lastBr = false;
      }
    }

    static void out(String text, String verboseData, Level level = Level::DEV){
      if( Log::has(level) ){
        Log::print(text+": "+verboseData);
        Log::lastBr = false;
      }
    }

    static void out(Level level, String text, String verboseData = ""){
      if( Log::has(level) ){
        Log::print(text+ (verboseData? ": "+verboseData : "" ));
        Log::lastBr = false;
      }
    }
};

#endif