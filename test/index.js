/**
 * @file test
 * @author Sheeta(wuhayao@gmail.com)
 */

import test from 'ava';
import {transform as babelTransform} from 'babel-core';
import es6PromiseUmd from '../lib/index';
import {runInNewContext} from 'vm';
import {Promise} from 'es6-promise';

function transform(code) {
    return babelTransform(code, {
        babelrc: false,
        plugins: [
            es6PromiseUmd
        ]
    }).code;
}

function run(explicitPromise, es6Promise) {
    let testExports = {};
    const inputCode = `
        exports.instance = new Promise(function () {});
    `;
    const outputCode = transform(inputCode);
    runInNewContext(outputCode, {
        exports: testExports,
        Promise: explicitPromise,
        require () {
            return es6Promise;
        }
    });
    return testExports;
}

test('not change code when not reference Promise', t => {
    const code = 'function foo() {}';
    t.true(transform(code) === code);
});

test('not change code when Promise is defined', t => {
    const code = `var Promise = function () {};new Promise();`;
    t.true(transform(code) === code);
});

test('polyfill Promise if necesary', t => {
    const result = run(undefined, {Promise: Promise});
    t.true(result.instance instanceof Promise);
});
