# 检验工具
> src/util/valid.js

## 接口
  1. **isValid** 单条规则校验

    ```javascript
       /*
        * @param {string} value 被校验的字段
        * @param {string} rule 校验规则
        * @returns {Object} 携带result和msg的对象
        */
    ```
  2. **isValidMulti** 多条规则校验

    ```javascript
      /**
       * @param {string} value 被校验的字段
       * @param {Array} rules 校验规则
       * @returns {Object} 携带{rule:{result,msg}的对象
       */
    ```
  3. **getRuleMsg** 根据rules获取 `{rules: msg}` 对象

    ```javascript
      /**
       * @param {Array} rules 规则数组
       * @returns {Object} 携带{rule:msg}的对象
       */
    ```

## 依赖

依赖[validator](https://github.com/chriso/validator.js)插件，并在此基础做了增强性功能，

使用此工具，必须熟知validator的使用方式，参数，接口等，请自行参阅相关文档。

```javascript
import validator from 'validator';

```
```javascript
// 将自定义的检查注入到validator中
// 用遍历方式使得能直接用自定义方法定义新别名
_.forEach(SELF_DEFINED_RULES, (param, key) =>{
  if (key in validator) {
    throw new Error('rule name already defined');
  }
  if (param instanceof RegExp) {
    // 正则表达式，注入到validator
    validator[key] = (a) => param.test(a)
  } else if (_.isArray(param) && param[0] in validator) {
    // 复用validator方法，自定义后注入validator
    let ruleName = param[0];
    validator[key] = (a) => {
      param[0] = a;
      return validator[ruleName].apply(null, param)
    }
  } else {
    // 待扩展
    throw new Error('illege selfdefined rule');
  }
})
```
增强性功能主要是将自定义的规则注入的`validator`中，
这么做只要是因为`validator`提供的默认规则太过宽泛，且没有错误提示，
而我们需要的经常是同一个校验规则，对应不同的`params`和`msg`

如 `isInt`能判定是不是整数，且可以指定整数的范围，
但实际应用中，如 `isPort`，需要整数`0~65535`, `isVlan`需要整数`1~4095`，
同样的规则，不同的参数，不同的错误提示信息。

因此，我们可以自定义一个keyName和msg,将其注入到 `validator`,
自定义的 keyName 放到 `SELF_DEFINED_RULES`
自定义的 msg 放到 `ERROR_MSG`
```javascript
const SELF_DEFINED_RULES = {
  isPort: ['isInt', {
    min: 0,
    max: 65535
  }],
  isVlan: ['isInt', {
    min: 1,
    max: 4095
  }],
};

const ERROR_MSG = {
  isIP: '需要IPv4地址',
  isIn: '数据不在备选范围内',
  isPort: '需要填入端口范围，0-65535',
  isVlan: '需要填入VLAN范围，1 ~ 4095',
};

```
**目前只支持两种格式的校验**
1. 正则表达式
2. validator提供的规则

***计划扩展自定函数的校验，什么时候遇到什么时候扩展***

##函数

+ prepareParam  准备校验函数的参数

  参数 与 返回值
  ```javascript
  /**
   * @param {string} value 被校验的字段
   * @param {Array | string} rule 校验规则
   * @returns {Object} check函数需要的参数 {rule, [value, options]}
   */
  ```
  函数逻辑

  校验函数`check`需要规则名`rule`作为索引，`value`，和`options`作为参数，
  因此`prepareParam`需要组织 `{rule, [value, options]}`的数据。

  + 如果`rule`是数组，将数组`index=0`的规则名与value置换，
  + 如果`rule`是字符串，将`value`变换为 `[value]`

  代码片段
  ```javascript
    function prepareParam(value, rule) {
      const ruleClone = _.cloneDeep(rule);
      let ruleStr;
      let options;
      if (_.isArray(ruleClone)) {
        ruleStr = ruleClone.shift();
        ruleClone.unshift(value);
        options = ruleClone;
      } else if (_.isString(ruleClone)) {
        ruleStr = ruleClone;
        options = [value];
      } else {
        throw new Error('参数错误');
      }
      return {
        rule: ruleStr,
        param: options,
      };
    }
  ```
+ check

  参数 与 返回值
  ```javascript
  /**
   * @param {Object} 必须是{rule, [value, options]}的结构，es6语法
   * @returns {Object} 携带result和msg的对象
   */
  ```
  函数逻辑

  校验函数`check`需要规则名`rule`作为索引，`value`，和`options`作为参数，

  如果`rule`在`validator`注册，执行检验，否则，抛出异常，等待扩展

  代码
  ```javascript
    function check({
      rule,
      param
    }) {
      let result;
      if (rule in validator) {
        // 使用原生或注入validator的方法
        result = validator[rule].apply(null, param);
      } else {
        // 扩展校验
        throw new Error(`rule=${rule} => 无此规则配置`);
      }
      return {
        valid: result,
        msg: ERROR_MSG[rule] ? ERROR_MSG[rule] : '此规则无提示信息',
      };
    }
  ```

##其他

**valid.js 需要大家功能维护，因为规则并不完善，需要随时增减**

对于新增规则命名要求

+ is类：表示【是】某规则，如 `isPort` 表示是端口
+ 数字类： 表示同名规则的不同【范围】 如 `range50`,`range255` 表示字符个数在`50`,`255`以内，
+ 其他： 更贴近业务的校验名字，因为业务不同，可能会出现相同的规则但参数不一致，所以建议使用贴近业务的名字

对待扩展功能，参数检查，均以抛出异常的方式处理，目的是在开发阶段及时发现错误，
因为线上代码是不应该在这里出现错误的
