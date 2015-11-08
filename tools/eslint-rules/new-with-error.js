/**
 * @fileoverview Require `throw new Error()` rather than `throw Error()`
 * @author Rich Trott
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  return {

    'ThrowStatement': function(node) {
      if (node.argument.type === 'CallExpression') {
        if (node.argument.callee.name === 'Error') {
          context.report(node, 'Use new keyword when throwing.');
        }
      }
    }

  };

};

module.exports.schema = [];
