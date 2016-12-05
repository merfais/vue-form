
<style lang="less" scoped>
  .form-container {
    .form-body{
      min-height: 250px;
    }
    .form-footer{
      text-align: center;
      .btn {
        margin: 10px;
      }
    }
  }
</style>

<template>
  <div class='form-container'>
    <div class='form-body'>
      <slot name='body'></slot>
    </div>
    <div class='form-footer clearfix'>
      <button class="btn btn-default" @click="clickCancel">取消</button>
      <button class="btn btn-primary" @click="clickApprove">确定</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      areaCount: {
        required: true,
        type: Number,
        default() {
          return 0;
        }
      },
      onCancel: {
        type: Function,
        default: function() {} // eslint-disable-line object-shorthand
      },
      onApprove: {
        type: Function,
        default: function() {} // eslint-disable-line object-shorthand
      },
    },
    data() {
      return {
        signal: false,  // 检测状态， true 检测中，false 检测完毕
        validCount: 0,  // 记录自检完成的子组件个数
        validName: [], // 记录自检完成的子组件名字，配合计数，为了双保险
        valid: true,    // 检验通过标示，采用 && 计算 只要有一个组件没有通过，则false
      };
    },
    events: {
      checkedover(msg) {
        if (this.signal && msg && this.validName.indexOf(msg.name) === -1) {
          // 如果这个child首次校验完成，过滤重复发送时间的child
          this.valid = msg.valid && this.valid;
          this.validName.push(msg.name);
          this.validCount += 1;
          if (this.validCount === this.areaCount) {
            // 全部自检完成，更新信号，触发回调
            this.signal = false;  // 更新校验状态为校验完毕
            this.onApprove(this.valid);
          }
        }
      }
    },
    methods: {
      clickCancel() {
        this.$broadcast('initialize');
        this.onCancel();
      },
      clickApprove() {
        this.init();
        if (this.areaCount) {
          // 需要校验的区域  > 0
          this.$broadcast('validating');
        } else {
          // 需要校验的区域==0 或没有
          this.onApprove(this.valid);
        }
      },
      init() {
        this.signal = true;
        this.valid = true;
        this.validName = [];
        this.validCount = 0;
      },
    },
    ready() {
    }
  }
</script>

