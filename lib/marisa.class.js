(function (factory, glob) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        glob.marisa = glob.marisa || {};
        glob.marisa.Class = factory();
    }
}(function () {
    'use strict';

    function create() {
        var methods,
            include,
            parent,
            i,
            length,
            klass = function () {
                this.initialize.apply(this, arguments);
            };

        if (typeof arguments[0] === 'function') {
            parent = arguments[0];
            methods = arguments[1];
        } else {
            methods = arguments[0];
        }

        include = methods.$include;

        if (parent) {
            extend(klass, parent);
            klass.__$parent = parent.prototype;
            klass.$super = function (instance, method, args) {
                return klass.__$parent[method].apply(instance, args);
            };
        }

        mixin(klass.prototype, methods);

        if (include) {
            if (typeof include === 'array') {
                for (i = 0, length = include.length; i < length; i += 1) {
                    mixin(klass.prototype, include[i].prototype);
                }
            } else {
                mixin(klass.prototype, include.prototype);
            }
        }

        if (!klass.prototype.initialize) {
            klass.prototype.initialize = function () {};
        }

        return klass;
    }

    function extend(child, parent) {
        if (Object.create) {
            child.prototype = Object.create(parent.prototype);
        } else {
            var F = function () {};
            F.prototype = parent.prototype;
            child.prototype = new F();
        }

        child.prototype.constructor = child;
    }

    function mixin(receive, give) {
        var i,
            length,
            methodName;

        // only provide certain given methods
        if (arguments[2]) {
            for (i = 2, length = arguments.length; i < length; i += 1) {
                receive[arguments[i]] = give[arguments[i]];
            }
        }
        // provide all methods
        else {
            for (methodName in give) {
                if (!Object.hasOwnProperty(receive, methodName)) {
                    receive[methodName] = give[methodName];
                }
            }
        }
    }

    return function () {
        return create.apply(this, arguments);
    };
}, window));