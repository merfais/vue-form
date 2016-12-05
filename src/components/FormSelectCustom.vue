<style lang="less" scoped>
  .b-form-group {
    padding-left: 5px;
    .b-control-label {
      font-weight: normal;
      font-size: 0.9em;
      margin-right: 3px;
    }
    .b-form-control {
      height: 28px;
      font-size: 1em;
      padding-left: 5px;
      padding-right: 25px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: default;
    }
    .b-dropdown-menu {
      min-width: 100%;
      cursor: default;
      li {
        padding: 0px 5px;
        &:hover {
          background-color: #999;
        }
      }
    }
  }
</style>
<template>
<div style="height:700px; padding:10px;">
<div class="form-inline">
  <div :id="id" class="form-group b-form-group">
    <label class="control-label b-control-label " for="inputSuccess2">{{label}}</label>
    <div class="dropdown has-feedback form-group">
        <input class="form-control b-form-control" data-toggle="dropdown" readonly
         :value="selectedItem" @focus='focus'  @blur='blur' @click='click'
         :style='{width: selectWidth}'  data-placement='bottom' :title='msg'>
        <span class="glyphicon glyphicon-ok form-control-feedback"></span>
        <ul class="dropdown-menu b-dropdown-menu" role="menu">
          <li role="presentation" v-for='item in listArray' @click='select($index)'>
            {{item.text || item}}
          </li>
        </ul>
    </div>
  </div>
</div>


</template>

<script>
  import valid from '../util/valid.js';
  import _ from 'lodash';
  export default {
    props: {
      label: {
        type: String,
      },
      items: {
        type: Array,
      },
      value: {
      },
      rules: {
        type: Array,
        default() {
          return [];
        }
      },
      selectWidth: {
        type: String,
      },
      tooltipWidth: {
        type: String,
      },
      onChange: {
        type: Function,
        default() {
          return () => {};
        }
      }
    },
    data() {
      return {
        id: '',
        msg: '',
        selectedItem: '',
        valid: true,
        ruleMsg: {},
        tooltipOut: '',
        selected: '',
        options: [
          { text: 'One', value: 'A' },
          { text: 'Two', value: 'B' },
          { text: 'Three', value: 'C' }
        ]
      };
    },
    computed: {
      listArray: function() {
        if (this.items && this.items.length === 0) {
          this.items = ['任意'];
        }
        return this.items;
      }
    },
    events: {
      validating() {
          this.validate();
      },
      initialize() {
        this.hideMsg();
      }
    },
    methods: {
      init() {
        /* eslint-disable */
        // 生成随机ID
        this.id = 'sxyxxyxxxy'.replace(/[xy]/g,
          function(c) {
            let r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        /* eslint-enable */
        this.ruleMsg = valid.getRuleMsg(this.rules);
        // 必须指定msg，msg不能为空，否则tooltip将初始化失败。
        // 采用的是bootstrap的tooltip插件
        if (!_.isEmpty(this.rules)) {
          const tmpMsg = _.values(this.ruleMsg)[0];
          this.msg = tmpMsg ? tmpMsg : 'init';  // eslint-disable-line no-unneeded-ternary
        }
        this.$nextTick(function() {
          const $input = $(`#${this.id} input`);
          // 初始化tooltip插件，msg!=null 才能成功
          $input.tooltip({
            delay: { show: 200, hide: 10000 },
            trigger: 'manual',
          });
        });
      },
      focus() {
        // 获取焦点，校验
          this.validate();
          console.log('focus')
      },
      blur() {
        // 失去焦点，检验
          this.validate();
          console.log('blur')
      },
      click() {
        //debugger;
        //$(`#${this.id} dropdown`).dropdown('toggle');
      },
      select(index){
        if (this.items[index].value || this.items[index].value === 0) {
          if (this.selectedItem !== this.items[index].value) {
            this.selectedItem = this.items[index].value;
            this.value = this.items[index].value;
            this.onChange();
          }
        } else {
          if (this.selectedItem !== this.items[index]) {
            this.selectedItem = this.items[index];
            this.value = this.items[index];
            this.onChange();
          }
        }
      },
      validate() {
        // 逐条校验规则，一旦失败返回
        if(this.value || this.value === 0) {
          this.value = this.value.toString();
        }
        const val = this.value ? this.value.trim() : '';
        this.valid = true;
        if (!('isRequired' in this.ruleMsg) && val.length === 0) {
          // 如果可以为空，并且没有填写，则不校验，
        } else {
          // 其他情况都校验
          _.forEach(this.rules, rule => {
            const result = valid.isValid(val, rule);
            if (!result.valid) {
              // 校验未通过
              this.valid = false;
              this.msg = result.msg;
              return;
            }
          });
        }
        // 显示校验结果信息
        this.showMsg();
        // 通知父级
        this.$dispatch('checkedover', {
          name: this.id,
          valid: this.valid,
        });
      },
      showMsg() {
        // 用于显示校验结果，包括 tooltip，icon
        const $input = $(`#${this.id} input`);
        const $tooltip = $(`#${this.id} .tooltip-inner`);
        if (this.valid) {
          $input.tooltip('hide');
        } else {
          $input.attr('data-original-title', this.msg);
          if (this.tooltipWidth) {
            $tooltip.addCss({
              width: this.tooltipWidth,
            });
          }
          $input.tooltip('show');
          // 1秒后清除tooltip
          clearTimeout(this.tooltipOut);
          this.tooltipOut = setTimeout(() => {
            $input.tooltip('hide');
          }, 1500);
        }
      },
      hideMsg() {
        // 用于显示校验结果，包括 tooltip，icon
        const $input = $(`#${this.id} input`);
        // 清除所有信息
        $input.tooltip('hide');
      },
    },
    ready() {
      this.label = 'nininini'
      this.items=['22222222222222222222222222222',2321,32423];
//      this.selectWidth = '100px'
//      this.rules=['isRequired']
      this.init();
    }
  };
</script>