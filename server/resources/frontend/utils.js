String.format =
    function (str) {
        "use strict";
        if (
            arguments
            && arguments.length
            && arguments.length > 1
            && arguments[1]
        ) {
            let args = []

            if (
                typeof arguments[1] === 'object'
                && !Array.isArray(arguments[1])
            ) {
                args = arguments[1]
            } else {
                let t = typeof arguments[1];
                args = ("string" === t || "number" === t) ?
                    Array.prototype.slice.call(arguments, 1)
                    : arguments[1];
            }

            for (let key in args) {
                str = str.replace(new RegExp("\\{\\s*?" + key + "\\s*?\\}", 'g'), args[key])
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


export function isObject(test) {
    return (typeof test === 'object' && !Array.isArray(test))
}

export function isArray(test) {
    return Array.isArray(test)
}

export function indexOf (arr, q){
  return arr.findIndex(item => q.toLowerCase() === item.toLowerCase())
}

export default {
    isObject,
    isArray,
    indexOf,
}

