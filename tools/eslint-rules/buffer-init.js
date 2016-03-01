/**
 * @fileoverview Rule to enforce initializing a Buffer when it is declared.
 * @author Rich Trott
 */
'use strict';


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    'VariableDeclaration': function(node) {
      var name, init;
      for (var i = 0; i < node.declarations.length; i++) {
        name = node.declarations[i].id.name;
        init = node.declarations[i].init;
        if (init && init.callee && init.callee.name === 'Buffer') {
          if (init.arguments && Number.isInteger(init.arguments[0].value))
            context.report(node,
              'Buffer "{{name}}" is declared without being initialized',
              {name: name}
            );
        }
      }

    },
  };

};

module.exports.schema = [];
