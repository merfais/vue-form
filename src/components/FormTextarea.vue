
<style lang="less" scoped>
  .b-form-group {
    padding-left: 5px;
    .b-form-control {
      font-size: 1em;
      padding: 3px;
    }
    .b-control-label {
      font-weight: normal;
      font-size: 0.9em;
      margin-right: 3px;
      margin-top: 3px;
      vertical-align: top;
    }
  }
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
    <textarea type='text' class='form-control b-form-control' data-placement='bottom'
      :title='msg' :rows='rows' :placeholder='holder' v-model='value'
      :style='{width: textareaWidth}'
      @focus='focus' @blur='blur' :disabled='disabled'>
    </textarea>
  </div>
</template>

<script>
  import valid from 'src/util/valid.js';

  export default {
    components: {},
    props: {
      label: {
        type: String,
      },
      value: {
      },
      holder: {
        type: String,
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
          return true;
        }
      },
      rows: {
        type: Number,
        default() {
          return 3;
        }
      },
      disabled: {
        default() {
          return false;
        }
      },
      textareaWidth: {
        type: String,
        default() {
          return '160px';
        }
      },
      labelWidth: {
        type: String,
        default() {
          return '80px';
        }
      },
      tooltipWidth: {
        type: String,
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
        msg: '',
        valid: true,
        ruleMsg: {},
        tooltipOut: '',
      };
    },
    events: {
      validating() {
        // console.log('validating');
        if (this.check) {
          this.validate();
        }
      },
      initialize() {
        this.hideMsg();
      }
    },
    methods: {
      init() {
        /* eslint-disable */
        // 生成随机ID
        this.id = 'axyxxyxxxy'.replace(/[xy]/g,
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
          const $textarea = $(`#${this.id} textarea`);
          // 初始化tooltip插件，msg!=null 才能成功
          $textarea.tooltip({
            delay: { show: 200, hide: 10000 },
            trigger: 'focus',
          });
        });
      },
      focus() {
        // 获取焦点，校验
        if (this.check) {
          this.validate();
        }
      },
      blur() {
        // 失去焦点，检验
        if (this.check) {
          this.validate();
        }
      },
      validate() {
        // 逐条校验规则，一旦失败返回
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
        const $textarea = $(`#${this.id} textarea`);
        const $tooltip = $(`#${this.id} .tooltip-inner`);
        if (this.valid) {
          $textarea.tooltip('hide');
        } else {
          $textarea.attr('data-original-title', this.msg);
          if (this.tooltipWidth) {
            $tooltip.addCss({
              width: this.tooltipWidth,
            });
          }
          $textarea.tooltip('show');
          // 1秒后清除tooltip
          clearTimeout(this.tooltipOut);
          this.tooltipOut = setTimeout(() => {
            $textarea.tooltip('hide');
          }, 1500);
        }
      },
      hideMsg() {
        // 用于显示校验结果，包括 tooltip，icon
        const $textarea = $(`#${this.id} textarea`);
        // 清除所有信息
        $textarea.tooltip('hide');
      },
    },
    ready() {
      this.init();
    }
  } // eslint-disable-line semi
</script>

