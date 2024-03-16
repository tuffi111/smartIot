import {BrowserSettingsModel} from "@app/models/BrowserSettingsModel.js";

let browserSettings;

export function useBrowserSettings(){
    if(!browserSettings){
        browserSettings = new BrowserSettingsModel()
    }
    return browserSettings;
}
