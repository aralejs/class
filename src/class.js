define(function(require, exports, module) {

  // Class
  // -----------------
  // Thanks to:
  //  - http://mootools.net/docs/core/Class/Class
  //  - http://ejohn.org/blog/simple-javascript-inheritance/
  //  - https://github.com/ded/klass
  //  - http://documentcloud.github.com/backbone/#Model-extend
  //  - https://github.com/joyent/node/blob/master/lib/util.js
  //  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js


  // The base Class implementation.
  function Class(o) {
    // Convert existed function to Class.
    if (!(this instanceof Class) && isFunction(o)) {
      // extended object will not call this function but call initialize
      return classify(o).implement({
        initialize: o
      });
    }
  }

  module.exports = Class;


  // Create a new Class.
  //
  //  var Animal = Class.create({
  //    initialize: function() {}
  //  });
  //
  //  var SuperPig = Animal.extend({
  //    initialize: function() {
  //      SuperPig.superclass.initialize.apply(this, arguments)
  //    }
  //  }).implement(Flyable)

  Class.create = function(properties) {
    properties || (properties = {});

    // The created class constructor
    function SubClass() {
      // Only call initialize in self constructor.
      if (this.constructor === SubClass && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }

    // Transform normal function to class
    classify(SubClass);

    // Add instance properties to the subclass.
    SubClass.implement(properties);

    return SubClass;
  };

  function classify(cls) {
    _extend(cls, Class);
    cls.extend = extend;
    cls.implement = implement;
    return cls;
  }

  function implement(properties) {
    Array.isArray(properties) || (properties = [properties]);
    var item, proto = this.prototype;

    while (item = properties.shift()) {
      mix(proto, item.prototype || item);
    }
    return this;
  }

  function extend(properties) {
    var subClass = Class.create(properties);
    _extend(subClass, this);
    mix(subClass, this, ['extend', 'implement', 'superclass']);
    return subClass;
  }

  function _extend (self, parent) {
    var existed = self.prototype;
    var proto = Object.create(parent.prototype);

    // Keep existed properties.
    mix(proto, existed);

    // Enforce the constructor to be what we expect.
    proto.constructor = self;

    // Set the prototype chain to inherit from `parent`.
    self.prototype = proto;

    // Set a convenience property in case the parent's prototype is
    // needed later.
    self.superclass = parent.prototype;
  }


  // Helpers
  // ------------

  function mix(r, s, bl) {
    // Copy "all" properties including inherited ones.
    for (var p in s) {
      if (s.hasOwnProperty(p)) {
        if (bl && bl.indexOf(p) !== -1) continue;
        r[p] = s[p];
      }
    }
  }


  var toString = Object.prototype.toString;

  var isFunction = function(val) {
    return toString.call(val) === '[object Function]';
  };
});
