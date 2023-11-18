#pragma once
#ifndef ESP_FILES
#define ESP_FILES

#include <functional>
#include <map>
#include <Arduino.h>
#include <FS.h>
#include <LittleFS.h>
#include <WiFiClient.h>
#include <DNSServer.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include "Log.cpp"

typedef std::function<void(File)> OpenHandler;


class Files {

private:
  //FS _fs;
  File _file;
  String _mode = "r";
  String _location;

  //std::map<String, ArRequestHandlerFunction> _handler;

  bool mountFs() {
    if (!LittleFS.begin()) {
      Log::line(Log::ERROR, "Http", "An error occurred while mounting filesystem");
      return false;
    }
    return true;
  }

public:
  Files() {
  }

  /* todo: inject fs
  Files(FS fs) {
    this->fs(fs);
  }  
  void fs(FS set){
    this->_fs = set;
  }
  FS fs(){
    return this->_fs;
  }/**/


  void setup() {
    if (!this->mountFs()) {
      Log::line(Log::ERROR, "Http", "An error occurred while mounting filesystem");
    }
  }

  // OPEN
  File open(String location) {
    return this->file(location);
  }

  File open(OpenHandler onOpen) {
    return this->open(this->location(), onOpen);
  }

  File open(String location, OpenHandler onOpen) {
    File file = this->file(location);
    if (file) {
      onOpen(file);
    }
    file.close();
  }


  // FILE
  Files* file(File set) {
    this->_file = set;
    return this;
  }

  File file() {
    if (!this->_file) {
      //this->_file = LittleFS.open(strstr(this->location().c_str(), this->location().c_str()), strstr(this->mode().c_str(), this->location().c_str()));
      this->_file = LittleFS.open(this->location().c_str(), this->mode().c_str());
    }
    return this->_file;
  }

  File file(String location) {
    if (!this->_file) {
      this->_file = LittleFS.open(location.c_str(), this->mode().c_str());
    }
    return this->_file;
  }

  File file(String location, String mode) {
    if (!this->_file) {
      this->_file = LittleFS.open(location.c_str(), mode.c_str());
    }
    return this->_file;
  }


  // READ
  String read() {
    return this->read(this->location());
  }

  String read(String location) {
    Log::println("Files: Read file: " + String(location));
    String result;
    File file = this->open(location);
    if (file) {
      if (!file.isDirectory()) {
        Log::println("Files: Read lines...");
        while (file.available()) {
          char s[2] = { 0 };
          s[0] = file.read();          
          result += s;
        }
        file.close();
      } else {
        Log::println("Files: Read abort: file is directory: " + String(location));
      }
    } else {
      Log::println("Files: Read abort: file not found: " + String(location));
    }

    return result;
  }


  // WRITE
  bool append(String data) {
    return this->write(data, "a");
  }

  bool append(String location, String data) {
    return this->write(location, data, "a");
  }

  bool write(String data) {
    return this->write(this->location(), data, "w");
  }

  bool write(String data, String mode) {
    return this->write(this->location(), data, mode);
  }

  bool write(String location, String data, String mode) {
    Log::println("Files: Write to file: '" + String(location) + "' / Data:" + String(data));
    File file = this->mode(mode)->open(location);
    if (file) {
      if (!file.isDirectory()) {
        if (file.print(data)) {
          Log::println("Files: File written: '" + String(location) + "'");
          return true;
        } else {
          Log::println("Files: Error writing file: '" + String(location) + "'");
        }
        file.close();
      } else {
        Log::println("Files: Abort writing file: is directory: '" + String(location) + "'");
      }
    } else {
      Log::println("Files: Abort writing file: can not open file: '" + String(location) + "'");
    }
    return false;
  }

  // FILE CHECKS
  bool exists() {
    return this->exists(this->location());
  }
  bool exists(String location) {
    return LittleFS.exists(location);
  }

  bool isDir() {
    return !this->isFile();
  }

  bool isDir(String location) {
    return !this->isFile(location);
  }

  bool isFile() {
    return this->isFile(this->location());
  }

  bool isFile(String location) {
    File file = this->open(location);
    bool is = false;
    if (file) {
      is = !file.isDirectory();
    }
    file.close();
    return is;
  }


  // Properties
  Files* location(String set) {
    this->_location = set;
    return this;
  }

  String location() {
    return this->_location;
  }

  Files* mode(String set) {
    this->_mode = set;
    return this;
  }

  String mode() {
    return this->_mode;
  }
};

/**/
#endif