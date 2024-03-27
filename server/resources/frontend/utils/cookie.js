export class Cookie {
    _maxAge = 3 * 3600 // number < 1: immediately; seconds: *1; minutes: *60; hours: *3600; days: *86400;
    _expires //= Date.now() // Date
    _path = '/'

    load(name) {
        const cookieData = new RegExp("(?<=" + name + "=)[^;]+").exec(document.cookie)
        if (cookieData) {
            return cookieData[0]
        }
        return null
    }

    write(name, value, maxAge = null, expires = null, path = null, domain = null, sameSite = null, secure = null) {
        document.cookie = "{name}={value}; {maxAge} {expires} Path={path}; Domain={domain}; SameSite={sameSite}; {secure}".format({
            name,
            value,
            maxAge: maxAge ? "Max-Age={0};".format(maxAge) : '',
            expires: expires ? "expires={0};".format(expires.toUTCString()) : '',
            path: path ?? this.path(),
            domain: domain ?? window.location.hostname,
            sameSite: sameSite ?? process.env.NODE_ENV === 'development' ? 'lax' : 'Strict',
            secure: secure ?? process.env.NODE_ENV === 'development' ? '' : 'Secure'
        })
    }

    save(name, value) {
        this.write(name, value || '', this.maxAge(), this.expires())
    }

    delete(name) {
        this.write(name, '', '0')
    }

    expires(setDate = null) {
        if (setDate === null) {
            return this._expires
        }

        this._expires = setDate
        return this
    }

    maxAge(setSeconds = undefined) {
        if (setSeconds === undefined) {
            return this._maxAge
        }

        this._maxAge = setSeconds
        return this
    }

    path(set = undefined) {
        if (set === undefined) {
            return this._path
        }

        this._path = set
        return this
    }
}

