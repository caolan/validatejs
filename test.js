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
