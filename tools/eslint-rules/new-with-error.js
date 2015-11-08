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
      if (node.argument.type === 'CallExpression' &&
          /^([A-Z]\w*)?Error$/.test(node.argument.callee.name)) {
        context.report(node, 'Use new keyword when throwing.');
      }
    }
  };
};

module.exports.schema = [];
