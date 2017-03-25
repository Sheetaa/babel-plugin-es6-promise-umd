/**
 * @file index
 * @author Sheeta(wuhayao@gmail.com)
 */

import template from 'babel-template';
import * as t from 'babel-types';

const buildPolyfill = template(`
    var PROMISE = Promise;
    if (typeof Promise === 'undefined') {
        var _es6Promise = require('es6-promise');
        PROMISE = _es6Promise.Promise;
    }
`);

const replaceIdentifier = {
    ReferencedIdentifier(path) {
        const {node, scope} = path;

        if (node.name !== 'Promise') {
            return;
        }
        if (scope.getBindingIdentifier(node.name)) {
            return;
        }

        path.replaceWith(this.getReplacement());
    }
};

export default function () {
    return {
        visitor: {
            Program(path) {
                const name = path.scope.generateUid('Promise');

                let used = false;
                path.traverse(replaceIdentifier, {
                    getReplacement() {
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
}
