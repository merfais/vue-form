
<style lang="less" scoped>
  .form-inline {
    margin-bottom: 0;
    padding-top: 9px;
    padding-bottom: 6px;
    .b-control-label {
      text-align: right;
    }
    .b-form-group {
      padding-top: 9px;
      padding-bottom: 6px;
    }
  }

</style>

<template>
  <div :id='id' class='form-group b-form-group' :class='{"form-inline": inlineAble}'>
    <label class='control-label b-control-label' :style='{width: labelWidth}'>
      {{label}}
    </label>
    <span data-placement='bottom' :title='msg'>
      <template v-for='item in options'>
        <label class='radio-inline b-radio-inline' :style='{minWidth: inputMinWidth}'>
          <input type='checkbox' :name='name' :value='item.value'
            v-model='value'/>{{item.text}}
        </label>
      </template>
    </span>
  </div>
</template>

<script>
  import valid from 'src/util/valid.js';

  export default {
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      label: {
        type: String,
      },
      value: {
        type: Array,
        default() {
          return [];
        }
      },
      valid: {
        type: Boolean,
        default() {
          return true;
        }
      },
      rules: {
        type: Array,
        default() {
          return [];
        }
      },
      check: {
        type: Boolean,
        default() {
          return false;
        }
      },
      inputMinWidth: {
        type: String,
        default() {
          return '60px';
        }
      },
      labelWidth: {
        type: String,
        default() {
          return '25%';
        }
      },
      inlineAble: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    data() {
      return {
        id: '',
        name: '',
        msg: '',
        ruleMsg: {},
        tooltipOut: '',
      };
    },
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
    events: {
      validating() {
        this.valid = true;
        if (this.check) {
          this.validate();
        }
      },
      initialize() {
        this.valid = true;
        this.hideMsg();
      }
    },
    methods: {
      init() {
        /* eslint-disable */
        // 生成随机ID
        this.id = 'fxyxxyxxxy'.replace(/[xy]/g, function(c) {
          let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        this.name = this.id + 'f';
        /* eslint-enable */
        this.ruleMsg = valid.getRuleMsg(this.rules);
        // 必须指定msg，msg不能为空，否则tooltip将初始化失败。
        // 采用的是bootstrap的tooltip插件
        if (!_.isEmpty(this.rules)) {
          const tmpMsg = _.values(this.ruleMsg)[0];
          this.msg = tmpMsg || 'init';
        }
        this.$nextTick(function() {
          const $span = $(`#${this.id} span`);
          // 初始化tooltip插件，msg!=null 才能成功
          $span.tooltip({
            delay: { show: 200, hide: 10000 },
            trigger: 'manual',
          });
        });
      },
      validate() {
        if (this.value || this.value === 0) {
          this.value = this.value.toString();
        }
        const val = this.value ? this.value.trim() : '';
        if ('required' in this.ruleMsg || val.length > 0) {
          // 如果必填或者填写内容，则需要校验，其他情况不校验
          // 逐条校验规则，一旦失败返回
          _.forEach(this.rules, rule => { // eslint-disable-line consistent-return
            const result = valid.isValid(val, rule);
            if (!result.valid) {
              // 校验未通过
              this.valid = false;
              this.msg = result.msg;
              return false;
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
        const $span = $(`#${this.id} span`);
        if (this.valid) {
          $span.tooltip('hide');
        } else {
          $span.attr('data-original-title', this.msg);
          $span.tooltip('show');
          // 1.5秒后清除tooltip
          clearTimeout(this.tooltipOut);
          this.tooltipOut = setTimeout(() => {
            $span.tooltip('hide');
          }, 1500);
        }
      },
      hideMsg() {
        const $span = $(`#${this.id} span`);
        // 清除所有信息
        $span.tooltip('hide');
      },
    },
    ready() {
      this.init();
    }
  }
</script>

