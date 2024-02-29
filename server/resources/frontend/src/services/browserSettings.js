import {BrowserSettingsModel} from "@/models/BrowserSettingsModel.js";
import {SessionDataModel} from "@/models/SessionDataModel.js";

let browserSettings;
let sessionData;

export function useBrowserSettings(){
    if(!browserSettings){
        browserSettings = new BrowserSettingsModel()
    }
    return browserSettings;
}

export function useSessionModel(){
    if(!sessionData){
        sessionData = new SessionDataModel()
    }
    return sessionData;
}
