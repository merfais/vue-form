# FormSelect组件
> /src/components/FormSelect.vue

## 逻辑描述

  **组件采用事件驱动，可配合Form使用，也可单独使用**

  + 初始化
    - 生成随机ID，用于jquery索引DOM，因为有状态的变化，需要操作DOM，记录校验结果也会使用这个值
    - 根据`rules`调用 valid.js 缓存 `{rules: msg}`的map，用于显示msg
    - 初始化 tooltip，采用的bootstrap的 [tooltips](http://v3.bootcss.com/javascript/#tooltips) 插件,
      由于插件的限制，必须使用代码
      ```html
       <select data-placement='bottom' :title='msg' ></select>

      ```
      ```javascript
        // 必须指定msg，msg不能为空，否则tooltip将初始化失败。
        if (!_.isEmpty(this.rules)) {
          const tmpMsg = _.values(this.ruleMsg)[0];
          this.msg = tmpMsg || 'init';
        }
        this.$nextTick(function() {
          const $select = $(`#${this.id} select`);
          // 初始化tooltip插件，msg!=null 才能成功
          $select.tooltip({
            delay: { show: 200, hide: 10000 },
            trigger: 'focus',
          });
        });
      ```

  + 校验

  当组件监听到 `validating` 事件，读取 `check` 接口，

  如果需要校验，执行校验逻辑，存储校验结果 `valid`，更新 `msg`， 派发 `checkedover` 事件到上级,

  如果不需要校验，直接返回，`valid=true`，不派发事件

## 接口说明
**1. data:   select的options字段**

  类型：数组

  默认：`[]`

  schema： `[{value: 0, text: '接口1'}, {}, {}]` or `['192.168.1.1', '', '']`

  说明：`options`接收俩个参数，`value`和`text` ，分别对应 value 和显示的text,
  如果传递字符串的数组，则 `value`和`text` 的值均为字符串的值

  代码：
  ```javascript
    computed: {
      options: function() {
        if (_.isString(this.data[0])) {
          // 接受传入 ['',''] 字符串形式的数据，
          // 转义为 value text的object
          return this.data.map(item => {
            return {
              value: item,
              text: item,
            }
          })
        }
        return this.data;
      }
    },
  ```

  **注意：**  当使用规则 `required`时，`value`禁止传递空字符串，因为会校验失败

**2. label:  select 左侧的label**

  类型：字符串

**3. value: select 值**

  必填：是

  使用：

  ```html
    // 必须使用 sync 否则读不到数据
    <select :value.sync='ip'></select>
  ```
**4. valid:  校验结果**

  + 如果不配合Form使用，需要使用这个接口收集校验结果，
  + 如果配置Form使用，这个接口没有作用

  使用：
  ```html
    // 必须使用 sync 否则读不到数据
    <select :valid.sync='result'><select>

  ```

**5. onChange:  select change 事件回调**

  类型： 函数

**6.rules:  校验规则**

  类型： 数组

  说明： 如果不指定，则不校验，直接返回 `true`

**7. check:  是否具备校验功能**

  类型： 布尔值

  默认：  `false`

  说明： 默认会跳过这个字段的校验，也不会派发`checkedover`事件，如果需要指定为 `true`

**8. selectWidth: select 宽度**

  类型： 字符串

  默认： `160px`

**9. labelWidth: label 宽度**

  类型： 字符串

  默认： `90px`

**10. inlineAble:  inline 模式**

  类型: 布尔值

  默认： `true`

  说明： 默认是采用label与select在一行，且独占一行，如果行内需要配置其他field，指定为 `false`

  代码示例：

  ```html
    // select 配合 input， 当select.value = custom 时，显示 input 输入
    <div v-if='item.type == "select"' class='form-inline'>
      <vue-select
        :label='item.select.label' :value.sync='item.select.value'
        :rules='item.select.rules' :data='item.select.items'>
      </vue-select>
      <vue-input v-show='item.select.value=="custom"'
        :label='item.input.label' :value.sync='item.input.value'
        :rules='item.input.rules' label-width='0px'>
      </vue-input>
    </div>
  ```


## 功能说明

**默认不执行校验，需要校验需要制定 `check=true`**

1. 监听 `validating` 事件，触发组件自检
2. 检验成功，销隐msg，校验失败，显示msg
3. 派发 `checkedover` 事件
4. 监听 `initialize` 时间，初始化组件到默认状态

## 依赖说明

**组件自身不带校验功能，需要依赖校验文件 [valid.js](./valid.md)**

执行校验逻辑的时机

+ focus
+ blur
+ submit

执行校验逻辑的条件是

+ 接口 check = `true`
+ 规则中包含`required`
+ 规则中没有`required`，但是内容不为空

代码
```javascript
  if ('required' in this.ruleMsg || val.length > 0) {
    // 如果必填或者填写内容，则需要校验，其他情况不校验
    // 逐条校验规则，一旦失败返回
    _.forEach(this.rules, rule => {
      const result = valid.isValid(val, rule); //调用valid.js 依赖
      if (!result.valid) {
        // 校验未通过
        this.valid = false;
        this.msg = result.msg;
        return false;
      }
    });
  }
```

## 其他说明

**组件脱离Form使用**

不推荐脱离单独使用，因为没有暴露出很好的接口，组件采用的事件驱动，结果的收集比较困难，
JS处理异步操作，通用的做法是采用事件回调机制，但是本组件并没有提供。

如果真的想独立使用，可以自己扩展，预留的接口是`valid [type=Boolean]`，
将这个接口修改为 `validated [type=Function]` 在校验结束时，回调传入的函数。
但这带来的问题是，**当表单中有多个field时，多次回调的处理也是很头疼的**

**组件扩展**
如果 select 下面需要说明文字，需要扩展一个label，这个功能在页面展示时样式比较难调，
产品也没有定案，所以暂不做此功能
