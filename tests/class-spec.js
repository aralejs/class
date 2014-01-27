/* jshint newcap: false */
define(function(require) {
  var Class = require('class');
  var expect = require('expect');

  describe('Class', function() {

    describe('.create', function() {

      it('Class.create(null)', function() {
        var Dog = Class.create(null);
        var dog = new Dog();
        expect(dog.constructor).to.equal(Dog);
        expect(Dog.superclass.constructor).to.equal(Class);

        Dog = Class.create();
        dog = new Dog();
        expect(dog.constructor).to.equal(Dog);
        expect(Dog.superclass.constructor).to.equal(Class);
      });

      it('Class.create(properties)', function() {
        var Dog = Class.create({
          initialize: function(name) {
            this.name = name;
          },

          getName: function() {
            return this.name;
          },

          talk: function() {
            return 'I am ' + this.name;
          }
        });
        var dog = new Dog('Jack');

        expect(dog.name).to.equal('Jack');
        expect(dog.talk()).to.equal('I am Jack');
      });

      it('Class.create(function)', function() {
        var counter = 0;
        function Animal() {
          counter++;
        }

        Animal.prototype.talk = function() {
          return 'wangwang';
        };

        var Dog = Class.create(Animal);
        var dog = new Dog();

        // not call the function
        expect(counter).to.equal(0);
        expect(dog.talk()).to.equal('wangwang');
      });
    });

    describe('.extend', function() {

      it('call initialize method properly', function() {
        var counter = 0;

        var Animal = Class.create({
          initialize: function() {
            counter++;
          }
        });

        var Dog = Animal.extend({
          initialize: function() {
            counter++;
          }
        });
        new Dog();

        // Dog 有 initialize 时，只调用 Dog 的 initialize;
        expect(counter).to.equal(1);

        counter = 0;
        Dog = Animal.extend();
        new Dog();

        // Dog 没有 initialize 时，会自动调用父类中最近的 initialize;
        expect(counter).to.equal(1);
      });

      it('pass arguments to initialize method properly', function() {

        var Animal = Class.create({
          initialize: function(firstName, lastName) {
            this.fullName = firstName + ' ' + lastName;
          }
        });

        var Bird = Animal.extend({
          fly: function() {}
        });

        var bird = new Bird('Frank', 'Wang');

        expect(bird.fullName).to.equal('Frank Wang');
      });

      it('superclass', function() {
        var counter = 0;

        var Animal = Class.create({
          initialize: function() {
            counter++;
          },
          talk: function() {
            return 'I am an animal';
          }
        });

        var Dog = Animal.extend({
          initialize: function() {
            Dog.superclass.initialize();
          },
          talk: function() {
            return Dog.superclass.talk();
          }
        });

        var dog = new Dog();

        expect(counter).to.equal(1);
        expect(dog.talk()).to.equal('I am an animal');
      });

      it('new AnotherClass() in initialize', function() {
        var called = [];

        var Animal = Class.create({
          initialize: function() {
            called.push('Animal');
          }
        });

        var Pig = Animal.extend({
          initialize: function() {
            called.push('Pig');
          }
        });

        var Dog = Animal.extend({
          initialize: function() {
            new Pig();
            called.push('Dog');
          }
        });

        new Dog();
        expect(called.join(' ')).to.equal('Pig Dog');

      });

      it('SubClass.extend', function() {
        var Animal = Class.create({
          initialize: function(name) {
            this.name = name;
          }
        });

        var Dog = Animal.extend();
        var dog = new Dog('Jack');

        expect(dog.name).to.equal('Jack');
        expect(Dog.superclass.constructor).to.equal(Animal);
      });

    });

    describe('.implement', function() {
      it('.implement(null)', function() {
        var Animal = Class.create();
        Animal.implement(null);
      });

      it('.implement will return this', function() {
        var Animal = Class.create({
          initialize: function(name) {
            this.name = name;
          }
        });

        var Flyable = {
          fly: function() {
            return 'I am flying';
          }
        };

        var Talkable = {
          talk: function() {
            return 'I am ' + this.name;
          }
        };

        Animal
          .implement(Flyable)
          .implement(Talkable);

        var animal = new Animal('Jack');

        expect(animal.name).to.equal('Jack');
        expect(animal.fly()).to.equal('I am flying');
        expect(animal.talk()).to.equal('I am Jack');
      });

      it('.implement([prop1, prop2])', function() {
        var Animal = Class.create({
          initialize: function(name) {
            this.name = name;
          },
          getName: function() {
            return this.name;
          }
        });

        var Flyable = {
          fly: function() {
            return 'I am flying';
          }
        };

        var Talkable = function() {};
        Talkable.prototype.talk = function() {
          return 'I am ' + this.name;
        };

        var Dog = Animal
          .extend()
          .implement([Flyable, Talkable]);

        var dog = new Dog('Jack');

        expect(dog.name).to.equal('Jack');
        expect(dog.getName()).to.equal('Jack');
        expect(dog.fly()).to.equal('I am flying');
        expect(dog.talk()).to.equal('I am Jack');
      });
      
      it('.implement(properties)', function() {
        var Animal = Class.create({
          initialize: function(name) {
            this.name = name;
          }
        });

        var Dog = Animal.extend();
        Dog.implement({
          talk: function() {
            return 'I am ' + this.name;
          }
        });

        var dog = new Dog('Jack');

        expect(dog.name).to.equal('Jack');
        expect(dog.talk()).to.equal('I am Jack');
        expect(Dog.superclass.constructor).to.equal(Animal);
      });

    });

    describe('static', function() {
      it('statics inherited from parent', function() {
        var Animal = Class.create();
        Animal.LEGS = 4;

        var Dog = Animal.extend({
          initialize: function(name) {
            this.name = name;
          }
        });

        expect(Dog.LEGS).to.equal(4);

        var Pig = Class.create(Class);

        expect(typeof Pig.implement).to.equal('function');
        expect(typeof Pig.extend).to.equal('function');
        expect(typeof Pig.Mutators).to.equal('undefined');
        expect(typeof Pig.create).to.equal('undefined');
      });
    });

    describe('convert', function() {

      it('convert function to Class', function() {
        function Animal(name) {
          this.name = name;
        }

        Animal.prototype.getName = function() {
          return this.name;
        };

        var Dog = Class(Animal);
        var dog = new Dog('Jack');

        expect(dog.constructor).to.equal(Dog);
        expect(dog.name).to.equal('Jack');
        expect(dog.getName()).to.equal('Jack');
      });

      it('convert existed function to Class', function() {
        function Dog(name) {
          this.name = name;
        }


        Class(Dog).implement({
          getName: function() {
            return this.name;
          }
        });

        var dog = new Dog('Jack');

        expect(dog.name).to.equal('Jack');
        expect(dog.getName()).to.equal('Jack');

        var MyDog = Dog.extend({
          talk: function() {
            return 'I am ' + this.name;
          }
        });

        var myDog = new MyDog('Frank');
        expect(myDog.name).to.equal('Frank');
      });

    });

  });

});
