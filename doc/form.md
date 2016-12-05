# 表单组件
> /src/components/Form.vue

## 逻辑描述

  **form组件只是一个壳子，需要配合formInput formSelect 等组件使用**

  form组件整体采用事件驱动，因为submit本身就是一个事件，由click触发校验的动作，
  然后组件内会broadcast一个自检事件`validating`，当slot进来的子组件收到这个事件后，
  进行自检，然后dispatch一个自检完毕事件`checkedover`，form会监听到这个事件，
  收集所有的检验结果，当计算得知（比对areaCount）所有的field都校验完毕，
  form会触发`onApprove`方法，将校验的结果传递给外层组件。

## 接口说明

**1. areaCount 需要校验的区域(field)数量**

  必填 : 是

  类型： 数字

  这个接口关于校验结果的正确与否，必须使用这个接口因为form本身只是壳子，
  无法感知slot进来多少个field，全程的校验过程又是事件驱动的，可以认为是异步，
  那么带来的问题就是，form无法知道何时校验完毕，只有当校验完毕才能触发`onApprove`,
  因此，感知校验完毕的机制我采用报数的方式，用累计的报数比对`areaCount`，
  当比对结果全等的时候证明所有的field自检完毕，所以，如果这个接口不能填写错误，

  如果 `areaCount > fieldCount` 永远不会触发 `onApprove`

  如果 `areaCount < fieldCount` 提前触发 `onApprove` 但收集了哪些field的结果未知（_异步_）

  如果 `areaCount = 0` 直接返回 true  不广播事件，不做校验

  源码

  ```javascript
    clickApprove() {
      this.init();
      if (this.areaCount) {
        // 需要校验的区域  > 0
        this.$broadcast('validating');
      } else {
        // 需要校验的区域==0 或没有
        this.onApprove(this.valid);
      }
    }

  ```

**2. onApprove 检验完毕的回调**

  必填: 是

  类型： 函数

  校验完毕后回调传递进来的函数，携带一个校验是否通过的Boolean参数，

  源码

  ``` javascript
  events: {
    checkedover(msg) {
      if (this.signal && msg && this.validName.indexOf(msg.name) === -1) {
        // 如果这个child首次校验完成，过滤重复发送时间的child
        this.valid = msg.valid && this.valid;
        this.validName.push(msg.name);
        this.validCount += 1;
        if (this.validCount === this.areaCount) {
          // 全部自检完成，更新信号，触发回调
          this.signal = false; // 更新校验状态为校验完毕
          this.onApprove(this.valid);
        }
      }
    }
  },

    ```
**3. onCancel 取消事件回调**

  类型：函数

  这个不是必须，由于项目的特色才有这个按钮，项目内form多嵌在对话框中,
  对话框的取消按钮需要事件回调

  这个按钮有内置的一个小功能，初始化slot进来的field到默认状态，
  开发这个功能是设计的初衷，表单内是带三种状态（未实现）**默认**、**成功**、**失败**，
  主要是样式上的表现，初始化就是将状态置为**默认**，但目前已成为鸡肋。

  源码

  ``` javascript
  clickCancel() {
    this.$broadcast('initialize');
    this.onCancel();
  },

  ```

## 功能说明

1. 广播 validating 事件，触发子组件自检
2. 监听 checkedover 事件，回调 onApprove 函数

## 依赖说明

单独使用 Form.vue 没有任何意义，需要配合一下文件共同使用
1. [FormInput.vue](./formInput.md)
2. [FormSelect.vue](./formSelect.md)
3. [FormRadio.vue](./formRadio.md)
4. [FormCheckbox.vue](./formCheckbox.md)
5. [FormTextarea.vue](./formTextarea.md)

示例

``` html
  // 简单模式
  <f-form :area-count='vniFrom.areaCount'
    :on-approve='addSwitchVni' :on-cancel='hideAddModal'>
    <template slot='body'>
     <template v-for='item in vniFrom.rules'>
        <f-input
          :rules='item.rule' :value.sync='item.value'
          :label='item.label' :holder='item.placeholder'>
        </f-input>
      </template>
    </template>
  </f-form>

```
``` html
  // 复杂模式
  <vue-form :area-count='aclForm.areaCount'
    :on-approve='addAcl' :on-cancel='hideModal'>
    <template slot="body">
      <template v-for='item in aclForm'>
        <template v-if='item.type == "radio"'>
          <vue-radio
            :label='item.label' :value.sync='item.value'
            :rules='item.rules' :data='item.items'>
          </vue-radio>
        </template>
        <template v-if='item.type == "text"'>
          <vue-input
            :label='item.label' :value.sync='item.value'
            :rules='item.rules'>
          </vue-input>
        </template>
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
      </template>
    </template>
  </vue-form>

```

## 其他说明

**编写这个壳子的初衷**

这个壳子使用起来确实有些怪异和别扭，因为与通用的逻辑不太一样，
但编写这个壳子，为的是不在页面级编写重复的广播事件，收集校验结果的代码，
这些逻辑如果放到每个页面来做，一是会带来代码的重复度，二是这个逻辑代码会写很大一坨，
这不是想要的结果，带来的限制就是逻辑复杂了，舒适度下降，
如果你真心觉得不好用，可以裸用FormInput等组件，它们本身自带校验功能和校验结果，
自己在页面收集结果也是可以的

没用采用社区常见的表单模式，是想做一个高度自定义的表单，社区的表单或多或少的有限制，
限制就意味着要多做许多代码来适配这些限制，由于引用过jquery-validator这个插件，
为了设配做了很大一坨的代码，并不方便。随后也在社区看了几个其他的form，
都不能高度自定义，所以才有了写form的想法。
