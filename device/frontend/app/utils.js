
String.format = String.format ||
    function (str) {
        "use strict";
        if (arguments.length) {
            var t = typeof arguments[1];
            var key;
            var args = ("string" === t || "number" === t) ?
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
