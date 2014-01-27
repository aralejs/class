define(function(require) {

  var Animal = require('./animal');

  return Animal.extend({
    isDog: true
  });

});
