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

exports.undefined = function (message) {
    return function (doc, value) {
        if (value !== undefined) {
            return [{error: message || 'Expected undefined'}];
        }
        return [];
    };
}

exports.string = function (message) {
    return function (doc, value) {
        if (toString.call(value) !== '[object String]') {
            return [{error: message || 'Expected string'}];
        }
        return [];
    };
}

exports.number = function (message) {
    return function (doc, value) {
        if (toString.call(value) !== '[object Number]') {
            return [{error: message || 'Expected number'}];
        }
        return [];
    };
};

exports.array = function (message) {
    return function (doc, value) {
        if (toString.call(value) !== '[object Array]') {
            return [{error: message || 'Expected array'}];
        }
        return [];
    };
};

exports.boolean = function (message) {
    return function (doc, value) {
        if (value === true ||
            value === false ||
            toString.call(value) === '[object Boolean]') {
            return [];
        }
        return [{error: message || 'Expected boolean'}];
    };
};

exports.object = function (message) {
    return function (doc, value) {
        if (value !== Object(value) || toString.call(value) === '[object Array]') {
            return [{error: message || 'Expected object'}];
        }
        return [];
    };
};

exports.min = function (min, message) {
    return function (doc, value) {
        if (value < min) {
            return [
                {error: message ||
                    'Expected a value greater than or equal to ' + min}
            ];
        }
        return [];
    };
};

exports.max = function (max, message) {
    return function (doc, value) {
        if (value > max) {
            return [
                {error: message ||
                    'Expected a value less than or equal to ' + max}
            ];
        }
        return [];
    };
};

exports.range = function (min, max, message) {
    return function (doc, value) {
        if (value < min || value > max) {
            return [
                {error: message ||
                    'Expected a value between ' + min + ' and ' + max}
            ];
        }
        return [];
    };
};

exports.minLength = function (val, message) {
    return function (doc, value) {
        if (value.length < val) {
            return [
                {error: message ||
                    'Please enter at least ' + val + ' characters'}
            ];
        }
        return [];
    };
};

exports.maxLength = function (val, message) {
    return function (doc, value) {
        if (value.length > val) {
            return [
                {error: message ||
                    'Please enter no more than ' + val + ' characters'}
            ];
        }
        return [];
    };
};

exports.rangeLength = function (min, max, message) {
    return function (doc, value) {
        if (value.length < min || value.length > max) {
            return [
                {error: message ||
                    'Please enter a value between ' + min + ' and ' + max +
                    ' characters long'}
            ];
        }
        return [];
    };
};

exports.regexp = function (re, message) {
    re = (typeof re === 'string') ? new RegExp(re): re;
    return function (doc, value) {
        if (!re.test(value)) {
            return [
                {error: message || 'Invalid format'}
            ];
        }
        return [];
    };
};

// regular expression by Scott Gonzalez:
// http://projects.scottsplayground.com/email_address_validation/
exports.email = function (message) {
    return exports.regexp(new RegExp("^((([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?$", "i"), message || 'Please enter a valid email address');
};

// regular expression by Scott Gonzalez:
// http://projects.scottsplayground.com/iri/
exports.url = function (message) {
    return exports.regexp(new RegExp("^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$", "i"), message || 'Please enter a valid URL');
};

exports.any = function (fns, message) {
    return function (doc, value) {
        var errs = [];
        for (var i = 0, l = fns.length; i < l; i++) {
            var e = fns[i](doc, value);
            if (exports.passed(e)) {
                return [];
            }
            errs = errs.concat(e);
        }
        var msgs = map(errs, function (e) { return e.error; });
        return [{error: message || msgs.join(' OR '), errors: errs}];
    };
};

exports.all = function (fns, message) {
    return function (doc, value) {
        var errs = [];
        for (var i = 0, l = fns.length; i < l; i++) {
            errs = errs.concat(fns[i](doc, value));
        }
        if (!errs.length) {
            return [];
        }
        else {
            var msgs = map(errs, function (e) { return e.error; });
            return [{error: message || msgs.join(' AND '), errors: errs}];
        }
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

var uniqKeys = function (ks) {
    ks.sort();
    for (var i = 0; i < ks.length - 1; i++) {
        if (ks[i] === ks[i + 1]) {
            ks.splice(i + 1, 1);
        }
    }
    return ks;
};

var keys = function (obj) {
    var ks = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            ks.push(k);
        }
    }
    return ks;
};

var validate = exports.validate = function (schema, node, extra, root) {
    root = root || node;

    var errs = [];
    var ukeys = uniqKeys(keys(schema).concat(keys(node)));

    for (var i = 0, len = ukeys.length; i < len; i++) {
        var k = ukeys[i],
            v = schema[k],
            n = node[k];

        if (!extra && !schema.hasOwnProperty(k)) {
            errs.push({error: 'Unexpected property', path: [k]});
        }
        else {
            var e = isFunction(v) ? v(root, n): validate(v, n, extra, root);
            errs = errs.concat( map(e, unshiftPath(k)) );
        }
    }

    return errs;
};
