var v = require('./validate');


exports['string field (required)'] = function (test) {
    var schema = {
        foo: v.string()
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
        foo: v.any([v.string(), v.undefined()])
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
            bar: v.string()
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
        foo: v.number(),
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
        foo: v.string()
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
        foo: v.string(),
        bar: {
            qux: function () { return true; }
        }
    };
    test.same(v.validate(schema, d), [
        {error: 'Unexpected property', path: ['bar', 'baz']}
    ]);
    test.done();
};

exports['validator - undefined'] = function (test) {
    var schema = {foo: v.undefined()};
    test.equal(v.validate(schema, {}).length, 0);
    test.equal(v.validate(schema, {foo: null}).length, 1);
    test.equal(v.validate(schema, {foo: 123}).length, 1);
    test.same(
        v.validate({foo: v.undefined('asdf')}, {foo: 123}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - string'] = function (test) {
    var schema = {foo: v.string()};
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 0);
    test.equal(v.validate(schema, {foo: null}).length, 1);
    test.equal(v.validate(schema, {foo: 123}).length, 1);
    test.same(
        v.validate({foo: v.string('asdf')}, {foo: 123}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - number'] = function (test) {
    var schema = {foo: v.number()};
    test.equal(v.validate(schema, {foo: 123}).length, 0);
    test.equal(v.validate(schema, {foo: null}).length, 1);
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.same(
        v.validate({foo: v.number('asdf')}, {foo: 'bar'}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - array'] = function (test) {
    var schema = {foo: v.array()};
    test.equal(v.validate(schema, {foo: [1,2,3]}).length, 0);
    test.equal(v.validate(schema, {foo: {}}).length, 1);
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.same(
        v.validate({foo: v.array('asdf')}, {foo: 'bar'}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - boolean'] = function (test) {
    var schema = {foo: v.boolean()};
    test.equal(v.validate(schema, {foo: true}).length, 0);
    test.equal(v.validate(schema, {foo: false}).length, 0);
    test.equal(v.validate(schema, {foo: {}}).length, 1);
    test.equal(v.validate(schema, {foo: 123}).length, 1);
    test.same(
        v.validate({foo: v.boolean('asdf')}, {foo: 'bar'}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - object'] = function (test) {
    var schema = {foo: v.object()};
    test.equal(v.validate(schema, {foo: {bar: 'asdf'}}).length, 0);
    test.equal(v.validate(schema, {foo: {}}).length, 0);
    test.equal(v.validate(schema, {foo: [1,2,3]}).length, 1);
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.same(
        v.validate({foo: v.object('asdf')}, {foo: 'bar'}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - min'] = function (test) {
    var schema = {foo: v.min(5)};
    test.equal(v.validate(schema, {foo: 5}).length, 0);
    test.equal(v.validate(schema, {foo: 10}).length, 0);
    test.equal(v.validate(schema, {foo: 0}).length, 1);
    test.equal(v.validate(schema, {foo: 4.99}).length, 1);
    test.same(
        v.validate({foo: v.min(5, 'asdf')}, {foo: 2}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - max'] = function (test) {
    var schema = {foo: v.max(5)};
    test.equal(v.validate(schema, {foo: 0}).length, 0);
    test.equal(v.validate(schema, {foo: 4.99}).length, 0);
    test.equal(v.validate(schema, {foo: 5}).length, 0);
    test.equal(v.validate(schema, {foo: 10}).length, 1);
    test.same(
        v.validate({foo: v.max(5, 'asdf')}, {foo: 20}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - range'] = function (test) {
    var schema = {foo: v.range(2, 5)};
    test.equal(v.validate(schema, {foo: 0}).length, 1);
    test.equal(v.validate(schema, {foo: 3.33}).length, 0);
    test.equal(v.validate(schema, {foo: 2}).length, 0);
    test.equal(v.validate(schema, {foo: 5}).length, 0);
    test.equal(v.validate(schema, {foo: 6}).length, 1);
    test.same(
        v.validate({foo: v.range(2, 5, 'asdf')}, {foo: 20}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - maxLength'] = function (test) {
    var schema = {foo: v.maxLength(5)};
    test.equal(v.validate(schema, {foo: [1,2,3]}).length, 0);
    test.equal(v.validate(schema, {foo: [1,2,3,4,5,6,7]}).length, 1);
    test.equal(v.validate(schema, {foo: 'abcde'}).length, 0);
    test.equal(v.validate(schema, {foo: 'abcdef'}).length, 1);
    test.equal(v.validate(schema, {foo: []}).length, 0);
    test.equal(v.validate(schema, {foo: ''}).length, 0);
    test.same(
        v.validate({foo: v.maxLength(5, 'asdf')}, {foo: 'abcdef'}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - minLength'] = function (test) {
    var schema = {foo: v.minLength(5)};
    test.equal(v.validate(schema, {foo: [1,2,3]}).length, 1);
    test.equal(v.validate(schema, {foo: [1,2,3,4,5,6,7]}).length, 0);
    test.equal(v.validate(schema, {foo: 'abcde'}).length, 0);
    test.equal(v.validate(schema, {foo: 'abcdef'}).length, 0);
    test.equal(v.validate(schema, {foo: []}).length, 1);
    test.equal(v.validate(schema, {foo: ''}).length, 1);
    test.same(
        v.validate({foo: v.minLength(5, 'asdf')}, {foo: 'abc'}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - rangeLength'] = function (test) {
    var schema = {foo: v.rangeLength(2, 5)};
    test.equal(v.validate(schema, {foo: [1]}).length, 1);
    test.equal(v.validate(schema, {foo: [1,2]}).length, 0);
    test.equal(v.validate(schema, {foo: [1,2,3,4,5]}).length, 0);
    test.equal(v.validate(schema, {foo: [1,2,3,4,5,6]}).length, 1);
    test.equal(v.validate(schema, {foo: 'a'}).length, 1);
    test.equal(v.validate(schema, {foo: 'ab'}).length, 0);
    test.equal(v.validate(schema, {foo: 'abcdef'}).length, 1);
    test.equal(v.validate(schema, {foo: []}).length, 1);
    test.equal(v.validate(schema, {foo: ''}).length, 1);
    test.same(
        v.validate({foo: v.rangeLength(2, 5, 'asdf')}, {foo: ''}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - regexp'] = function (test) {
    var schema = {foo: v.regexp(/^testing$/)};
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.equal(v.validate(schema, {foo: 'testing'}).length, 0);
    test.same(
        v.validate({foo: v.regexp(/^testing$/, 'asdf')}, {foo: ''}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - regexp with string'] = function (test) {
    var schema = {foo: v.regexp('^testing$')};
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.equal(v.validate(schema, {foo: 'testing'}).length, 0);
    test.same(
        v.validate({foo: v.regexp('^testing$', 'asdf')}, {foo: ''}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - email'] = function (test) {
    var schema = {foo: v.email()};
    test.equal(v.validate(schema, {foo: 'user@example.com'}).length, 0);
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.same(
        v.validate({foo: v.email('asdf')}, {foo: ''}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['validator - url'] = function (test) {
    var schema = {foo: v.url()};
    test.equal(v.validate(schema, {foo: 'http://example.com'}).length, 0);
    test.equal(v.validate(schema, {foo: 'https://example.com'}).length, 0);
    test.equal(v.validate(schema, {foo: 'asdf'}).length, 1);
    test.same(
        v.validate({foo: v.url('asdf')}, {foo: ''}),
        [{error: 'asdf', path: ['foo']}]
    );
    test.done();
};

exports['all'] = function (test) {
    var vpass = function () { return []; };
    var vfail1 = function () { return [{error: 'failure1'}]; };
    var vfail2 = function () { return [{error: 'failure2'}]; };

    var s1 = {foo: v.all([vpass, vpass])};
    test.equal(v.validate(s1, {foo: null}).length, 0);

    var s2 = {foo: v.all([vpass, vfail1])};
    test.same(v.validate(s2, {foo: null}), [
        {error: 'failure1', errors: [{error: 'failure1'}], path: ['foo']}
    ]);

    var s3 = {foo: v.all([vfail1, vfail2])};
    test.same(v.validate(s3, {foo: null}), [
        {
            error: 'failure1 AND failure2',
            errors: [{error: 'failure1'}, {error: 'failure2'}],
            path: ['foo']
        }
    ]);

    var s4 = {foo: v.all([vfail1, vfail2], 'custom message')};
    test.same(v.validate(s4, {foo: null}), [
        {
            error: 'custom message',
            errors: [{error: 'failure1'}, {error: 'failure2'}],
            path: ['foo']
        }
    ]);

    test.done();
};

exports['any'] = function (test) {
    var vpass = function () { return []; };
    var vfail1 = function () { return [{error: 'failure1'}]; };
    var vfail2 = function () { return [{error: 'failure2'}]; };

    var s1 = {foo: v.any([vpass, vpass])};
    test.equal(v.validate(s1, {foo: null}).length, 0);

    var s2 = {foo: v.any([vpass, vfail1])};
    test.same(v.validate(s2, {foo: null}).length, 0);

    var s3 = {foo: v.any([vfail1, vfail2])};
    test.same(v.validate(s3, {foo: null}), [
        {
            error: 'failure1 OR failure2',
            errors: [{error: 'failure1'}, {error: 'failure2'}],
            path: ['foo']
        }
    ]);

    var s4 = {foo: v.any([vfail1, vfail2], 'custom message')};
    test.same(v.validate(s4, {foo: null}), [
        {
            error: 'custom message',
            errors: [{error: 'failure1'}, {error: 'failure2'}],
            path: ['foo']
        }
    ]);

    test.done();
};
