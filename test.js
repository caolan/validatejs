var v = require('./validate');


exports['string field (required)'] = function (test) {
    var schema = {
        foo: v.string
    };
    test.same(v.validate(schema, {foo: 'bar'}), []);
    test.same(v.validate(schema, {foo: 123}), [
        {error: 'Expected string', path: ['foo']}
    ]);
    test.same(v.validate(schema, {}), [
        {error: 'Expected string', path: ['foo']}
    ]);
    test.done();
};

exports['string field (not required)'] = function (test) {
    var schema = {
        foo: v.any(v.string, v.undefined)
    };
    test.same(v.validate(schema, {foo: 'bar'}), []);
    test.same(v.validate(schema, {foo: 123}), [{
        error: 'Expected string OR Expected undefined',
        errors: [
            {error: 'Expected string'},
            {error: 'Expected undefined'}
        ],
        path: ['foo']
    }]);
    test.same(v.validate(schema, {}), []);
    test.done();
};

exports['nested field'] = function (test) {
    var schema = {
        foo: {
            bar: v.string
        }
    };
    test.same(v.validate(schema, {foo: {bar: 'asdf'}}), []);
    test.same(v.validate(schema, {foo: {bar: 123}}), [
        {error: 'Expected string', path: ['foo', 'bar']}
    ]);
    test.done();
};

exports['validate sub-objects'] = function (test) {
    test.expect(3);
    var d = {
        foo: 123,
        bar: {
            baz: 'foo',
            qux: 456
        }
    };
    var validator = function (doc, value) {
        test.same(doc, d);
        test.same(value, {baz: 'foo', qux: 456});
        return [];
    };
    var schema = {
        foo: v.number,
        bar: validator
    };
    test.same(v.validate(schema, d), []);
    test.done();
};

exports['allow extra properties'] = function (test) {
    var d = {
        foo: 'asdf',
        bar: 123
    };
    var schema = {
        foo: v.string
    };
    test.same(v.validate(schema, d, true), []);
    test.done();
};

exports['do not allow extra properties'] = function (test) {
    var d = {
        foo: 'asdf',
        bar: {
            baz: 123
        }
    };
    var schema = {
        foo: v.string,
        bar: {
            qux: function () { return true; }
        }
    };
    test.same(v.validate(schema, d), [
        {error: 'Unexpected property', path: ['bar', 'baz']}
    ]);
    test.done();
};
