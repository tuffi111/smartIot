import {BrowserSettingsModel} from "@/models/BrowserSettingsModel.js";
import {SessionDataModel} from "@/models/SessionDataModel.js";
import {LocalDataModel} from "@/models/LocalDataModel.js";
import {CookieDataModel} from "@/models/CookieDataModel.js";

let browserSettings;
let sessionData;
let cookieData;

export function useBrowserSettings(){
    if(!browserSettings){
        browserSettings = new BrowserSettingsModel()
    }
    return browserSettings;
}

export function useLocalModel(){
    if(!sessionData){
        sessionData = new LocalDataModel()
    }
    return sessionData;
}

export function useSessionModel(){
    if(!sessionData){
        sessionData = new SessionDataModel()
    }
    return sessionData;
}

export function useCookieModel(){
    if(!cookieData){
        cookieData = new CookieDataModel()
    }
    return cookieData;
}
