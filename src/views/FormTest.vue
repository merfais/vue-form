<template>
  <div class='col-md-6'>
    <f-form class='' :area-count='4' 
      :on-approve='apply' :on-cancel='cancel'>
      <template slot='body'>
        <template v-for='item in formtest1'>
          <f-input :rules='item.rule' :holder='item.placeholder'
            :value.sync="item.value" :label='item.label'>
          </f-input>
        </template>
      </template>
    </f-form>
  </div>
  <div class='col-md-10'>
    <f-form :area-count='aclAreaCount'
      :on-approve='apply' :on-cancel='cancel'>
      <template slot="body">
        <template v-for='item in aclForm'>
          <div v-if='item.type == "radio"' class="row">
            <f-radio class='col-md-6'
              :label='item.label' :value.sync='item.value'
              :rules='item.rules' :data='item.items'>
            </f-radio>
          </div>
          <div v-if='item.type == "text"' class="row">
            <f-input class='col-md-6'
              :label='item.label' :value.sync='item.value'
              :rules='item.rules'>
            </f-input>
          </div>
          <div v-if='item.type == "select"' class='form-inline row'>
            <f-select class='col-md-6'
              :label='item.select.label' :value.sync='item.select.value'
              :rules='item.select.rules' :data='item.select.items'>
            </f-select>
            <f-input v-if='item.select.value=="custom"' class='col-md-6'
              :label='item.input.label' :value.sync='item.input.value'
              :rules='item.input.rules' label-width='0px'>
            </f-input>
          </div>
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
  import toastr from 'toastr'
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
            rule: ['required'],
            placeholder: 'input your name',
          },
          age: {
            label: '年龄 ： ',
            value: '',
            rule: ['isAge'],
            placeholder: 'input your age',
          },
          phone: {
            label: '电话 ：',
            value: '',
            rule: ['isPhone'],
            placeholder: 'input your phone number',
          },
          email: {
            label: '邮箱 ： ',
            value: '',
            rule: ['isEmail'],
            placeholder: 'input your email address',
          }
        },
        aclForm: {
          name: {
            type: 'text',
            label: '名称 : ',
            value: '',
            rules: ['required'],
          },
          action: {
            type: 'radio',
            label: '行为 : ',
            value: 'ACCEPT',
            items: [{
              value: 'ACCEPT',
              text: '允许'
            }, {
              value: 'DROP',
              text: '丢弃'
            }]
          },
          proto: {
            type: 'select',
            select: {
              label: '协议 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '6',
                text: 'TCP'
              }, {
                value: '17',
                text: 'UDP'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          },
          gatewayS: {
            type: 'select',
            select: {
              label: '网关入口 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '0',
                text: '网关1'
              }, {
                value: '1',
                text: '网关2'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          },
          ipS: {
            type: 'select',
            select: {
              label: '源IP段 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '192.168.1.10/24',
                text: '192.168.1.10/24'
              }, {
                value: '192.168.1.11/24',
                text: '192.168.1.11/24'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          },
          portS: {
            type: 'select',
            select: {
              label: '源端口范围 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '80',
                text: 'HTTP'
              }, {
                value: '21',
                text: 'FTP'
              }, {
                value: '22',
                text: 'SSH'
              }, {
                value: '25',
                text: 'SMTP'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          },
          gatewayD: {
            type: 'select',
            select: {
              label: '网关出口 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '0',
                text: '网关1'
              }, {
                value: '1',
                text: '网关2'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          },
          ipD: {
            type: 'select',
            select: {
              label: '目的IP段 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '192.168.1.10/24',
                text: '192.168.1.10/24'
              }, {
                value: '192.168.1.11/24',
                text: '192.168.1.11/24'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          },
          portD: {
            type: 'select',
            select: {
              label: '目的端口范围 : ',
              value: '-1',
              items: [{
                value: '-1',
                text: '全部'
              }, {
                value: '80',
                text: 'HTTP'
              }, {
                value: '21',
                text: 'FTP'
              }, {
                value: '22',
                text: 'SSH'
              }, {
                value: '25',
                text: 'SMTP'
              }, {
                value: 'custom',
                text: '自定义'
              }],
            },
            input: {
              value: '',
              rules: ['required']
            }
          }
        },
      }
    },
    computed: {
      aclAreaCount: function() {
        let count = 1
        _.forEach(this.aclForm, item => {
          if (item.type === 'select' && item.select.value === 'custom') {
            count += 1;
          }
        })
        return count
      }
    },
    methods: {
      apply(valid) {
        if (valid) {
          toastr.success('验证通过')
        } else {
          toastr.warning('验证失败，请检查')
        }
      },
      cancel() {

      }
    },
    ready() {
    }
  };
</script>

<style lang="less" scoped>
   
</style>