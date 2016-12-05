
<style lang="less" scoped>
  .b-form-group {
    padding-left: 5px;
    .b-form-control {
      height: 28px;
      font-size: 1em;
      padding: 3px;
    }
    .b-control-label {
      font-weight: normal;
      font-size: 0.9em;
      margin-right: 3px;
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
  <div :id='id' class='form-group b-form-group' :class='{"form-inline": inlineAble}'
    data-placement='bottom' :title='msg'>
    <label class='control-label b-control-label' :style='{width: labelWidth}'>
      {{label}}
    </label>
    <template v-for='item in itemArr'>
      <label class='radio-inline b-radio-inline' :style='{minWidth: inputMinWidth}'>
        <input type='checkbox' :name='name' :value='item.value'
          v-model='value'/>{{item.text}}
      </label>
    </template>
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
      value: [],
      rules: {
        type: Array,
        default() {
          return [];
        }
      },
      itemArr: {
        type: Array,
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
        name: '',
        msg: '',
        valid: true,
        ruleMsg: {},
        tooltipOut: '',
      };
    },
    events: {
      validating() {
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
          const $group = $(`#${this.id}`);
          // 初始化tooltip插件，msg!=null 才能成功
          $group.tooltip({
            delay: { show: 200, hide: 10000 },
            trigger: 'focus',
          });
        });
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
        const $group = $(`#${this.id}`);
        const $tooltip = $(`#${this.id} .tooltip-inner`);
        if (this.valid) {
          $group.tooltip('hide');
        } else {
          $group.attr('data-original-title', this.msg);
          if (this.tooltipWidth) {
            $tooltip.addCss({
              width: this.tooltipWidth,
            });
          }
          $group.tooltip('show');
          // 1秒后清除tooltip
          clearTimeout(this.tooltipOut);
          this.tooltipOut = setTimeout(() => {
            $group.tooltip('hide');
          }, 1500);
        }
      },
      hideMsg() {
        // 用于显示校验结果，包括 tooltip，icon
        const $group = $(`#${this.id}`);
        // 清除所有信息
        $group.tooltip('hide');
      },
    },
    ready() {
      this.init();
    }
  } // eslint-disable-line semi
</script>

