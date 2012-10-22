
# 类与模块

- order: 1

---

在 SeaJS 倡导的模块体系里，推荐一个文件一个模块。这样，我们经常会如下组织代码：

```js
/* animal.js */
define(function(require, exports, module) {
    ...
    var Animal = Class.create(...);
    ...
});
```

```js
/* dog.js */
define(function(require, exports, module) {
    ...
    var Dog = Animal.extend(...);
    ...
});
```

```js
/* collie.js */
define(function(require, exports, module) {
    ...
    var Collie = Dog.extend(...);
    ...
});
```

我们在调试代码时，经常会使用 `console.dir` 来查看某个实例的来龙去脉：

```js
/* test.js */
define(function(require, exports, module) {
    var Collie = require('./collie');

    var collie = new Collie(...);
    console.dir(collie);
});
```

大部分类库的 OO 实现方式，上面的代码在 `console` 中的输出都很难直接看出 `collie`
的继承关系。

在 SeaJS 环境下，通过 `Class.create` 或 `Base.extend` 创建类时，可以通过内部的
`_getCompilingModule` 方法将类与模块关联起来。这样，我们就可以得到下面的输出：

```
> console.dir(collie)
  ▼ Object
     ▼ __proto__: Object
       __filename: 'collie.js'
       __module: Object
       ▼ __proto__: Object
         __filename: 'dog.js'
         __module: Object
         ▼ __proto__: Object
           __filename: 'animal.js'
           __module: Object
```

通过 `__filename` 属性，可以比较清晰地看到 `collie` 的父类关系，并能直接定位到相应的文件，方便调试。还可以通过
`__module` 属性，来得到相关的模块信息，利用这些元信息，可以进一步生成模块关系图等等。


## 感谢

- 李牧对该问题的研究：[扩展 SeaJS 模块定义中的 module 参数的应用示例](http://limu.iteye.com/blog/1136712)
