<template>
  <div class=''>
    <f-form  class='col-md-6'
      :area-count='4' 
      :on-approve=''
      :on-cancel=''>
      <template slot='body' >
        <template v-for='item in formtest1'>
          <f-input :rules='item.rule' :holder='item.holder' :inline-able='false'
            :value.sync="item.value" :label='item.label'>
          </f-input>
       </template>
     </template>
    </f-form>
  </div>
</template>

<script>
  import FForm from '../components/Form.vue';
  import FInput from '../components/FormInput.vue';
  import FSelect from '../components/FormSelect.vue';
  import FRadio from '../components/FormRadio.vue';
  import FCheckbox from '../components/FormCheckbox.vue';
  import FTextarea from '../components/FormTextarea.vue';
  export default {
    components: {
        FForm,
        FInput,
        FSelect,
        FRadio,
        FCheckbox,
        FTextarea,
    },
    data() {
      return {
        formtest1: {
          name: {
            label: '姓名 ： ',
            value: '',
            rule: ['isRequired'],
            placeholder: 'input your name',
          },
          age: {
            label: '年龄 ： ',
            value: '',
            rule: ['isNumber'], // ip的校验中需要校验是否存在这个ip
            placeholder: 'input your age',
          },
          phone: {
            label: '电话 ：',
            value: '',
            rule: ['isPhone'],  // 这个校验规则在getIpList时生成
            placeholder: 'input your phone number',
          },
          email: {
            label: '邮箱 ： ',
            value: '',
            rule: ['isEmail'],
            placeholder: 'input your email address',
          }
        },
      }
    },
    ready() {
        
    }
  };
</script>

<style lang="less" scoped>
   
</style>