'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        visitor: {
            Program: function Program(path) {
                var name = path.scope.generateUid('Promise');

                var used = false;
                path.traverse(replaceIdentifier, {
                    getReplacement: function getReplacement() {
                        used = true;
                        return t.identifier(name);
                    }
                });

                if (used) {
                    path.unshiftContainer('body', buildPolyfill({
                        PROMISE: t.identifier(name)
                    }));
                }
            }
        }
    };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file index
 * @author Sheeta(wuhayao@gmail.com)
 */

var buildPolyfill = (0, _babelTemplate2.default)('\n    var PROMISE = Promise;\n    if (typeof Promise === \'undefined\') {\n        var _es6Promise = require(\'es6-promise\');\n        PROMISE = _es6Promise.Promise;\n    }\n');

var replaceIdentifier = {
    ReferencedIdentifier: function ReferencedIdentifier(path) {
        var node = path.node,
            scope = path.scope;


        if (node.name !== 'Promise') {
            return;
        }
        if (scope.getBindingIdentifier(node.name)) {
            return;
        }

        path.replaceWith(this.getReplacement());
    }
};

module.exports = exports['default'];