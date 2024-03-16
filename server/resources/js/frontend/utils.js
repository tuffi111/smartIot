String.format = String.format ||
    function (str) {
        "use strict";
        if (arguments.length) {
            let t = typeof arguments[1];
            let key;
            let args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments, 1)
                : arguments[1];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };

String.prototype.format = String.prototype.format ||
    function () {
        "use strict";
        let str = this.toString();
        return String.format(str, ...arguments);
    };


Object.objectDeepKeys = Object.objectDeepKeys ||
    function (obj) {
        if (!(obj instanceof Object)) return []
        return Object.keys(obj).filter(key => obj[key] instanceof Object).map(key => Object.objectDeepKeys(obj[key]).map(k => `${key}.${k}`)).reduce((x, y) => x.concat(y), Object.keys(obj))
    }

