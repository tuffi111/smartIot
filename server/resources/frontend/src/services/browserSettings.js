import {BrowserSettingsModel} from "@/models/BrowserSettingsModel.js";

let browserSettings;

export function useBrowserSettings(){
    if(!browserSettings){
        browserSettings = new BrowserSettingsModel()
    }
    return browserSettings;
}
