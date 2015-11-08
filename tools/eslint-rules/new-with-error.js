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
      const arg = node.argument;
      if (arg.type === 'CallExpression' && arg.callee.name === 'Error') {
        context.report(node, 'Use new keyword when throwing.');
      }
    }
  };
};

module.exports.schema = [];
