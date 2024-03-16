import {StorageModel} from "@/models/StorageModel.js";


export class CookieModel extends StorageModel {

    _path = '/'
    _maxAge = 3 * 3600 // number < 1: immediately; seconds: *1; minutes: *60; hours: *3600; days: 86400;
    //_expires = 3 // days

    name() {
        return 'CookieStorageModel'
    }

    setStorageData(data) {
        this.setCookie(this.storageKey(), JSON.stringify(data))
    }

    getStorageData() {
        try {
            return JSON.parse(this.getCookie(this.storageKey()) ?? "{}") ?? {}
        } catch (error) {
            return {}
        }

    }


    setCookie = (name, value) => {
        let maxAge = ''
        const maxAgeVal = this.maxAge()
        if (maxAgeVal !== null) {
            maxAge = "Max-Age={0};".format(maxAgeVal)
        }

        let expires = ""
        const date = this.expires()
        if (date) {
            expires = "expires={0};".format(date.toUTCString())
        }

        document.cookie = "{0}={1}; {2} {3} Path={4}; Domain={5}; SameSite={6}; {7}".format(
            name,                                                       // 0
            value || "",                                                // 1
            maxAge,                                                     // 2
            expires,                                                    // 3
            this.path(),                                                // 4
            window.location.hostname,                                   // 5
            process.env.NODE_ENV === 'development' ? 'lax' : 'Strict',  // 6
            process.env.NODE_ENV === 'development' ? '' : 'Secure'      // 7
        )
    }

    getCookie = (name) => {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    eraseCookie = (name) => {
        document.cookie = "{0}={1}; Path={2}; Domain={3}; SameSite={4}; {5}".format(
            name,                                                       // 0
            "",                                                         // 1
            this.path(),                                                // 2
            window.location.hostname,                                   // 3
            process.env.NODE_ENV === 'development' ? 'lax' : 'Strict',  // 4
        )
    }


    expires(set = null) {
        if (set === null) {
            if (this._expires) {
                let date = new Date()
                date.setTime(date.getTime() + (this._expires * 24 * 60 * 60 * 1000))
                return date
            }
            return null
        }

        this._expires = set
        return this
    }

    maxAge(set = undefined) {
        if (set === undefined) {
            return this._maxAge
        }

        this._maxAge = set
        return this
    }

    path(set = undefined) {
        if (set === undefined) {
            return this._path
        }

        this._path = set
        return this
    }


    remove() {
        this.eraseCookie(this.storageKey())
    }
}
