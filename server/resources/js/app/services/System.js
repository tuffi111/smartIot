import {useQuasar} from "quasar";
import {Model} from "@/models/Model.js";
import {SystemSettings} from "@app/models/SystemSettings.js";

class SystemService {

    _theme
    _settings
    _noUpdate = false
    _defaultFontsize = 12

    constructor(quasar = null) {
        if (quasar) {
            this.theme(quasar)
        }
    }

    getFontSize() {
        return parseFloat(this.settings().get('fontsize'))
    }

    stepFontSize(step = 1) {
        this.setFontSize(this.getFontSize() + step)
    }

    setFontSize(set) {
        set = parseFloat(set)
        this.settings().set('fontsize', set)
        this.applyFontSize(set)
    }

    applyFontSize(size, rootElement = ".q-page-container") {
        const list = this.getContainerElements(rootElement)
        for (let index = 0; index < list.length; ++index) {
            list[index]["style"].fontSize = size + "px"
        }
    }

    toggleTheme() {
        this.setTheme(!this.settings().get('themeMode'))
        this.settings().set('themeMode', this.theme().dark.isActive)
    }

    setTheme(set) {
        if (set === undefined) {
            this.theme().dark.set("auto")
        } else {
            this.theme().dark.set(set)
        }
    }

    settings() {
        if (!this._settings) {
            this._settings = new SystemSettings()


            console.log(this._settings)

            this._settings.bind(Model.EVENT_CHANGED, (data) => {
                try {
                    if (this._noUpdate) return
                    //this._noUpdate = true
                    const {themeMode} = data;
                    this.setTheme(themeMode);
                    this.applyFontSize(parseFloat(data.fontsize));
                } catch (error) {
                    throw error
                }
                this._noUpdate = false
            })

        }
        return this._settings;
    }


    theme(set = null) {
        if (set === null) {
            if (!this._theme) {
                this._theme = useQuasar()
            }
            return this._theme
        }

        this._theme = set
        return this
    }

    getContainerElements(selector) {
        return document.querySelectorAll(selector)
    }

    defaultFontsize() {
        return this._defaultFontsize
    }

    load() {
        this.settings().load()
        return this
    }

    autoLoad(...args) {
        this.settings().autoLoad(...args)
        return this
    }
}

let systemInstance;

export function useSystem(quasar = null) {

    if (!systemInstance) {
        systemInstance = new SystemService(quasar)
    }

    return systemInstance
}
