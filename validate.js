/**
 * Utility functions
 */

var slice = Array.prototype.slice,
    toString = Object.prototype.toString;

function map(a, f) {
    var b = [];
    for (var i = 0, l = a.length; i < l; i++) {
        b[i] = f(a[i]);
    }
    return b;
}

var isArray = Array.isArray || function (value) {
    return toString.call(value) === '[object Array]';
};

var isFunction = function (value) {
    return toString.call(value) === '[object Function]';
};

exports.passed = function (errs) {
    return isArray(errs) && errs.length === 0;
};


/**
 * Validator functions
 */

exports.undefined = function (doc, value) {
    if (value !== undefined) {
        return [{error: 'Expected undefined'}];
    }
    return [];
};

exports.string = function (doc, value) {
    if (toString.call(value) !== '[object String]') {
        return [{error: 'Expected string'}];
    }
    return [];
};

exports.min = function (min) {
    return function (doc, value) {
        if (value < min) {
            return [
                {error: 'Expected a value greater than or equal to ' + min}
            ];
        }
        return [];
    };
};

exports.max = function (max) {
    return function (doc, value) {
        if (value > max) {
            return [
                {error: 'Expected a value less than or equal to ' + max}
            ];
        }
        return [];
    };
};

exports.range = function (min, max) {
    return function (doc, value) {
        if (value < min || value > max) {
            return [
                {error: 'Expected a value between ' + min + ' and ' + max}
            ];
        }
        return [];
    };
};

exports.any = function (/* args... */) {
    var args = slice.call(arguments);

    return function (doc, value) {
        var errs = [];
        for (var i = 0, l = args.length; i < l; i++) {
            var e = args[i](doc, value);
            if (exports.passed(e)) {
                return [];
            }
            errs = errs.concat(e);
        }
        var msgs = map(errs, function (e) { return e.error; });
        return [{error: msgs.join(' OR '), errors: errs}];
    };
};


/**
 * Actual validation proceedure
 */

var unshiftPath = function (k) {
    return function (err) {
        if (!err.path) {
            err.path = [];
        }
        err.path.unshift(k);
        return err;
    }
};

exports.validate = function (schema, node, root) {
    root = root || node;

    var errs = [];
    for (var k in schema) {
        if (schema.hasOwnProperty(k)) {
            var v = schema[k],
                n = node[k];

            var e = isFunction(v) ? v(root, n): exports.validate(v, n, root);
            errs = errs.concat( map(e, unshiftPath(k)) );
        }
    }

    return errs;
};
