
<style type="text/css" media="all"  lang="less" rel="stylesheet/less" scoped>
  @import '../assets/css/theme-nsp.less';

  .vue-modal-operation-parent {
    cursor: pointer;
    margin-bottom: 4px;
  }
  .vue-form-inline {
   display: flex;
    margin-bottom: 5px;
    font-size: 14px;
    justify-content: center;
    flex-wrap: wrap;
    &.validate-msg {
      height: 20px;
      margin: 0px;
      label.validate-err {
        color: #D84C29;
        font-size: 0.7em;
        font-weight: normal;
        width: 100%;
        padding: 0 6% 0 38%;
        align-items: flex-start;
      }
    }
    label {
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-direction: column;
      font-weight: normal;
    }
  }
  .vue-form {
    padding-top: 10px;
    input, textarea {
      background-color: @g-dark-bgcolor;
      color: #fff;
      outline: 0;
      margin-left:20px;
      border: 1px solid #29223F;
      width: 60%;
    }
    input {
      height: 30px;
    }
  }
  .wan-modal-body {
    padding-top: 10px;
  }
  .wan-ip-statistic-table {
    background-color: @g-dark-bgcolor;
  }
  .b-label {
    font-weight: normal;
    font-size: 14px;
    color: @g-color-l1;
  }
  .wan-label-content {
    line-height: 45px;
    padding-left: 60px;
    font-size: 0;
    position:relative;
    .b-label{
      position: absolute;
      top: 10px;
      left: 10px;
    }
  }
  .wan-ip-list-content {
    padding: 5px 5px  5px 65px;
    position: relative;
    color: @g-color-l1;
    .b-label {
      position: absolute;
      top: 5px;
      left: 10px;
    }
    .ip-list {
      font-style:italic;
    }
  }
  .b-form-inline {
    margin-bottom: 10px;
  }
  .sublabel-rules-tip {
    margin:5px 0px 0px;
  }
  .sublabel-rules-form {
    .rule-inline {
      padding: 8px 0px;
      border-bottom: 1px solid @g-border-color;
      text-align: center;
    }
    .btn-inline {
      padding: 8px 0px;
      text-align: center;
    }
    .del-btn {
      background-color: @g-main-bgcolor;
      height: 28px;
      padding: 3px 6px;
      color: darken(red, 10%);
      border: 0px;
    }
    .add-btn {
      background-color: @g-btn-active-bgcolor;
      height: 28px;
      padding: 3px 15px;
      color: @g-main-color;
      border: 1px solid @g-btn-bgcolor;
      outline: none;
      &:hover,
      &:active {
        color: @g-main-color;
        background-color: @g-btn-hover-bgcolor;
      }
    }
  }
</style>

<template>
<div>
  <!--子标签模态对话框开始-->
  <modal :show.sync='subLabelModal.showing' :on-approve='clickApply(subLabelModal.parentId)'>
    <span slot='header'>{{subLabelModal.title}}</span>
    <div slot='operation'>
      <img class='vue-modal-operation-parent' @click='showModifyLabelModal' src='../assets/images/edit.png' />
      <img class='vue-modal-operation-parent' @click='deleteLabel(labels[subLabelModal.parentId])' src='../assets/images/delete.png' />
    </div>
    <div slot='body' class='wan-modal-body'>
      <vue-table :check-able='true' :is-single-check='true' :title-able='false'
        :slot-able='true' :columns='subLabelModal.subTable.columns' :data='subLabelModal.subTable.data'
        :checked-fields.sync='subLabelModal.subTable.checkedFields' :page-able='false'>
        <div slot='restContent'>
          <!--列表管理按钮开始，分别是创建，删除，管理-->
          <vue-button value='新建' @click='showAddSubLabelModal'
            :is-link='true' width='50px' height='28px'>
          </vue-button>
          <vue-button value='修改' @click='showModifySubLabelModal'
            :is-link='true' width='50px' height='28px'>
          </vue-button>
          <vue-button value='管理' @click='showModifySubLabelRules(subLabelModal.subTable.checkedFields)'
            :is-link='true' width='50px' height='28px'>
          </vue-button>
          <vue-button value='删除' @click='deleteSubLabel(subLabelModal.subTable.checkedFields)'
            :is-link='true' width='50px' height='28px'>
          </vue-button>
         <!--列表管理按钮结束-->
        </div>
      </vue-table>
    </div>
  </modal>
  <!--子标签模态对话框结束-->
  <!--新建、修改标签的模态对话框 开始-->
  <modal :show.sync='labelModal.showing' :with-footer='false'>
    <span slot='header'>{{labelModal.title}}</span>
    <div slot='body'>
      <f-form :area-count='labelModal.areaCount' :on-approve='labelModal.onApprove'
        class='sublabel-rules-form' :on-cancel='labelModal.onCancel'>
        <template slot='body'>
          <f-input :rules='labelModal.name.rule'
            :value.sync='labelModal.name.value'
            :label='labelModal.name.label'
            input-width='250px'>
          </f-input>
          <f-textarea :rules='labelModal.description.rule'
            :value.sync='labelModal.description.value'
            :rows='labelModal.description.rows'
            :label='labelModal.description.label'
            textarea-width='250px'>
          </f-textarea>
       </template>
      </f-form>
    </div>
  </modal>
  <!--新建、修改标签 结束-->
  <!--新建、修改子标签规则开始-->
  <modal :show.sync='subLabelRule.showing' :with-footer='false' width='710px'>
    <span slot='header'>{{subLabelRule.title}}</span>
    <template slot='body'>
      <p class='sublabel-rules-tip'>注意：对规则进行【增加】【修改】【删除】均不会改变历史统计数据</p>
      <f-form :area-count='4 * subLabelRule.rules.length' :on-approve='modifySubLabelRules'
        class='sublabel-rules-form' :on-cancel='hideSubLabelRuleModal'>
        <template slot='body' >
          <template v-for='item in subLabelRule.rules'>
            <div class='form-inline rule-inline'>
              <tip-modal width="180px" height="180px" :on-approve="selectedEpc">
                <f-input :rules='item.epc.rule' :holder='item.epc.placeholder'
                  :value.sync="epcList.dataObj[item.epc.value]" label='租户 : '
                  input-width='100px' slot="title" :show-caret='true' readonly
                  slot='title' @click='clickEpc($index)' label-width='32px'>
                </f-input>
                <div slot="body">
                  <vue-table :check-able="true" :is-single-check="true"
                    :th-able="false" :scroll-able="true" checked-field="id"
                    :checked-fields.sync ="epcList.checkedFields" :title-able='false'
                    :columns="epcList.columns" :data="epcList.data"
                    :page-able="false" :search-able ='false' tr-line-height='2em'>
                  </vue-table>
                </div>
              </tip-modal>
              <f-input :rules='item.ipfrom.rule' :value.sync='item.ipfrom.value'
                :holder='item.ipfrom.placeholder' label-width='19px'
                label='ip : ' input-width='120px'></f-input>
              <f-input :rules='item.ipto.rule' :value.sync='item.ipto.value'
                :holder='item.ipto.placeholder' label-width='10px'
                label='-&nbsp;' input-width='120px'></f-input>
              <f-input :rules='item.vlan.rule' :value.sync='item.vlan.value'
                :holder='item.vlan.placeholder' label-width='41px'
                label='VLAN : ' input-width='100px'></f-input>
              <button class='btn b-btn del-btn' @click='delSubLabelRule($index)'>删除</button>
            </div>
          </template>
          <div class='form-inline btn-inline'>
            <button class='btn b-btn add-btn' @click='addSubLabelRule'>增加</button>
          </div>
       </template>
      </f-form>
    </template>
  </modal>
  <!--新建，编辑子标签规则 结束-->
  <msg :type.sync='msgModal.type' :msg.sync='msgModal.msg' :show.sync='msgModal.showing'
    :on-approve.sync='msgModal.onApprove' :on-cancel.sync='msgModal.onCancel'>
  </msg>
  <!--按钮列表开始-->
  <div class='wan-label-content col-md-12'>
    <span class='label b-label'> 分类：</span>
    <vue-button  value='整体' :is-active="'all' == activeButtonId"
      id='wanAn_btn_all' @click="clickApply('all')()">
    </vue-button>
    <template v-for='label in labels'>
      <vue-button v-on:click='showSubLabelModal(label.id,label.name)'
        :is-active='label.id == activeButtonId'
        id='wanAn_btn_{{label.id}}' :label-id='label.id' :value='label.name'>
      </vue-button>
    </template>
    <tip-modal width='260px' height='260px' :on-approve="clickApply('ip')">
      <vue-button slot='title' :show-caret='true'
        :is-active="'ip' == activeButtonId"
        id='wanAn_btn_ip' value='自定义IP'>
      </vue-button>
      <div slot='body'>
        <vue-table :check-able='true' :is-single-check='false' class='ip-list'
          :title-able='false' :scroll-able='true' checked-field='ip'
          :checked-fields.sync ='allIpList.checkedFields'
          :columns='allIpList.columns' :data='allIpList.data'
          :page-able='false' :th-able='false' >
        </vue-table>
      </div>
    </tip-modal>
    <vue-button slot='title' value='增加标签' :is-link='true'
      @click='showAddLabelModal'>
    </vue-button>
  </div>
  <!--按钮列表结束-->
  <div class='col-md-12 wan-ip-list-content'>
    <span class='label b-label'>条件：</span>
    <span class='ip-list'>{{selectedIpList}}</span>
  </div>
</div>
</template>

<script type='text/javascript'>
  import labelInfo from '../assets/js/labelInfo.js';
  import VueTable from '../components/Table/Table.vue';
  import VueButton from '../components/Button.vue';
  import Modal from '../components/Modal.vue';
  import Msg from '../components/Message.vue';
  import TipModal from '../components/TipModal';
  import FForm from '../components/Form.vue';
  import FInput from '../components/FormInput.vue';
  import FTextarea from '../components/FormTextarea.vue';

  export default {
    components: {
      VueTable,
      VueButton,
      Modal,
      Msg,
      TipModal,
      FForm,
      FInput,
      FTextarea,
    },
    props: {
    },
    data() {
      return {
        activeButtonId: 'all',
        labels: {},
        selectedIpList: '所有的Ip均已选中',
        subLabelModal: {
          parentId: null,
          showing: false,
          title: '',
          subTable: {
            columns: [{
              en: 'name',
              cn: '标签名',
              sort: true
            }, {
              en: 'description',
              cn: '描述',
              sort: true
            }],
            data: [],
            checkedFields: null
          },
          dataMap: {},
          subLabel: {
            name: '',
            description: ''
          },
        },
        subLabelRule: {
          showing: false,
          title: '',
          curRule: 0,
          rules: [],
          tpl: {
            epc: {
              value: '',
              rule: [],
              placeholder: '0',
            },
            ipfrom: {
              value: '',
              rule: ['isIP'], // ip的校验中需要校验是否存在这个ip
              placeholder: '0.0.0.0',
            },
            ipto: {
              value: '',
              rule: ['isIP'],  // 这个校验规则在getIpList时生成
              placeholder: '255.255.255.255',
            },
            vlan: {
              value: '',
              rule: ['isVlanId'],
              placeholder: '0-4095',
            }
          },
          onApprove: function() {},
        },
        epcList: {
          columns: [{
            en: 'name',
            cn: '项目名称',
          }],
          data: [],
          dataObj: {},    // 存储id：name，用于更新列表按钮名字
          checkedFields: null,
        },
        labelModal: {
          showing: false,
          title: '',
          areaCount: 2,
          id: '',
          name: {
            value: '',
            rule: ['isRequired', 'range50', 'notSpecial'],
            label: '',
          },
          description: {
            value: '',
            rule: ['range255', 'notSpecial'],
            label: '描述 : ',
            rows: 3,
          },
          onApprove: function() {},
          onCancel: function() {},
        },
        msgModal: {
          showing: false,
          type: 'error',
          msg: '',
          onApprove: function() {},
          onCancel: function() {}
        },
        allIpList: {
          columns: [{
            en: 'ip',
            cn: 'ip'
          }],
          data: [],
          checkedFields: [],
        },
      };
    },
    methods: {
      clickApply(selectedId) {
        const self = this;
        // 这里返回函数是为了配合modal的onApprove的事件
        // 但在button里面click事件调用方式不同，因此可见click事件的html增加了一层（）
        return function() {
          self.activeButtonId = selectedId;
          let tags;
          if (selectedId === 'all') {
            // 选择整体标签
            tags = {};
            self.selectedIpList = '所有的Ip均已选中';
          } else if (selectedId === 'ip') {
            // 选择自定义IP
            tags = {
              ip: self.allIpList.checkedFields
            };
            self.selectedIpList = self.allIpList.checkedFields.length ?
              self.allIpList.checkedFields.join(' / ') :
              '未选IP，显示所有IP的数据';
          } else {
            // 选择自定义标签
            const subLabelId = self.subLabelModal.subTable.checkedFields;
            tags = subLabelId === null ? {
              custom_tag_id: [-1000] // 这里使用负值是为了使es返回空数据
            } : {
              custom_tag_id: [parseInt(subLabelId)]
            };
            // 查询custom_tag_id对应的ips
            labelInfo.getSubLabelRules(self.$http, subLabelId).then(data => {
              if (data.DATA.length === 0) {
                self.selectedIpList = '此标签下没有规则，不能统计数据';
              } else {
                let subLabelName;
                _.forEach(self.subLabelModal.subTable.data, item => {
                  if (item.id === parseInt(subLabelId)) {
                    subLabelName = item.name;
                    return;
                  }
                });
                self.selectedIpList = `已选标签：${self.subLabelModal.title} ，
                  已选子标签：${subLabelName}`;
              }
            }, err => {
              throw new Error(err);
            });
          }
          self.$dispatch('refreshWanStatistic', tags);
        };
      },
      showSubLabelModal(labelId, labelName) {
        this.subLabelModal.showing = true;
        this.subLabelModal.title = labelName;
        this.subLabelModal.parentId = labelId;
        this.getSubLabel();
      },
      hideLabelModal() {
        this.labelModal.showing = false;
      },
      showAddLabelModal() {
        this.labelModal.showing = true;
        this.labelModal.title = '增加标签';
        this.labelModal.id = '';
        this.labelModal.name.label = '标签名称 : ';
        this.labelModal.name.value = '';
        this.labelModal.description.value = '';
        this.labelModal.onApprove = this.addLabel;
        this.labelModal.onCancel = this.hideLabelModal;
      },
      showModifyLabelModal() {
        const labelId = parseInt(this.subLabelModal.parentId);
        const label = this.labels[labelId];
        this.labelModal.showing = true;
        this.labelModal.title = '修改标签';
        this.labelModal.id = label.id;
        this.labelModal.name.label = '标签名称 : ';
        this.labelModal.name.value = label.name;
        this.labelModal.description.value = label.description;
        this.labelModal.onApprove = this.modifyLabel;
        this.labelModal.onCancel = this.hideLabelModal;
      },
      showAddSubLabelModal() {
        this.labelModal.showing = true;
        this.labelModal.title = '增加子标签';
        this.labelModal.id = '';
        this.labelModal.name.value = '';
        this.labelModal.name.label = '子标签名称 : ';
        this.labelModal.description.value = '';
        this.labelModal.onApprove = this.addSubLabel;
        this.labelModal.onCancel = this.hideLabelModal;
      },
      showModifySubLabelModal() {
        const labelId = parseInt(this.subLabelModal.subTable.checkedFields);
        if (labelId) {
          const label = this.subLabelModal.dataMap[labelId];
          this.labelModal.showing = true;
          this.labelModal.title = '修改子标签';
          this.labelModal.id = label.id;
          this.labelModal.name.label = '子标签名称 : ';
          this.labelModal.name.value = label.name;
          this.labelModal.description.value = label.description;
          this.labelModal.onApprove = this.modifySubLabel;
          this.labelModal.onCancel = this.hideLabelModal;
        } else {
          this.showMsgModal('error', '请先创建子标签')
        }
      },
      showModifySubLabelRules(subLabelId) {
        if (this.subLabelModal.subTable.checkedFields) {
          this.subLabelRule.showing = true;
          this.getSubLabelRules(subLabelId);
        } else {
          this.showMsgModal('error', '请先创建标签');
        }
      },
      hideSubLabelRuleModal() {
        this.subLabelRule.showing = false;
      },
      showMsgModal(type, msg, onApprove, onCancel) {
        this.msgModal.showing = true;
        this.msgModal.type = type;
        this.msgModal.msg = msg;
        this.msgModal.onApprove = onApprove || function() {};
        this.msgModal.onCancel = onCancel || function() {};
      },
      getIpList() {
        labelInfo.getIp(this.$http).then(data => {
          this.allIpList.data = data;
          // 得到所有的ip，组装进subLabel的校验规则，
          const ipArray = data.map(item => {
            return item.ip;
          });
          _.forEach(this.subLabelRule.tpl, (item, key) => {
            if (key.indexOf('ip') !== -1) {
              item.rule.push(['isIn', ipArray]);
            }
          });
        }, err => {
          throw new Error(err);
        });
      },
      getLabel() {
        labelInfo.getLabel(this.$http).then(data => {
          this.labels = data;
        }, err => {
          throw new Error(err);
        });
      },
      addLabel(valid) {
        if (valid) {
          labelInfo.addLabel(this.$http, {
            name: this.labelModal.name.value,
            description: this.labelModal.description.value,
          }).then(data => {
            if (data.OPT_STATUS === false) {
              this.showMsgModal('error', data.OPT_STATUS_CH);
            } else {
              this.showMsgModal('success', data.OPT_STATUS_CH);
              this.getLabel();
              this.hideLabelModal()
            }
          }, err => {
            throw new Error(err);
          });
        }
      },
      deleteLabel(label) {
        const self = this;
        self.showMsgModal('error', '确定删除标签' + label.name + '吗？',
          function() {
            labelInfo.deleteLabel(self.$http, label.id).then(data => {
              if (data.OPT_STATUS === false) {
                self.showMsgModal('error', data.OPT_STATUS_CH + '是否强制删除子标签？',
                  function() {
                    labelInfo.deleteLabelForce(self.$http, label.id)
                      .then(() => {
                        self.subLabelModal.showing = false;
                        self.getLabel();
                      }, err => {
                        throw new Error(err);
                      });
                  });
              } else {
                self.subLabelModal.showing = false;
                self.getLabel();
              }
            }, err => {
              throw new Error(err);
            });
          });
      },
      modifyLabel(valid) {
        if (valid) {
          labelInfo.modifyLabel(this.$http, {
            id: this.labelModal.id,
            name: this.labelModal.name.value,
            description: this.labelModal.description.value,
          }).then(data => {
            if (data.OPT_STATUS === false) {
              this.showMsgModal('error', data.OPT_STATUS_CH);
            } else {
              this.showMsgModal('success', data.OPT_STATUS_CH);
              this.getLabel();
              this.hideLabelModal()
            }
          }, err => {
            throw new Error(err);
          });
        }
      },
      getSubLabel() {
        const self = this;
        labelInfo.getSubLabel(this.$http, this.subLabelModal.parentId)
          .then(data => {
            self.subLabelModal.subTable.data = data.DATA;
            _.forEach(data.DATA, item => {
              self.subLabelModal.dataMap[item.id] = {
                id: item.id,
                description: item.description,
                parentId: item.label_id,
                name: item.name,
              };
            });
            if (data.DATA.length > 0) {
              // 默认选中第一个子标签
              self.subLabelModal.subTable.checkedFields = data.DATA[0].id;
            } else {
              self.subLabelModal.subTable.checkedFields = null;
            }
          }, err => {
            throw new Error(err);
          });
      },
      addSubLabel(valid) {
        if (valid) {
          labelInfo.addSubLabel(this.$http, {
            name: this.labelModal.name.value,
            description: this.labelModal.description.value,
            parentId: this.subLabelModal.parentId,
          }).then(data => {
            if (data.OPT_STATUS === false) {
              this.showMsgModal('error', data.OPT_STATUS_CH);
            } else {
              this.showMsgModal('success', data.OPT_STATUS_CH);
              this.getSubLabel();
              this.hideLabelModal()
            }
          }, err => {
            throw new Error(err);
          });
        }
      },
      deleteSubLabel(subLabelId) {
        const self = this;
        let name;
        this.subLabelModal.subTable.data.forEach(item => {
          if (item.id === subLabelId) {
            name = item.name;
          }
        });
        self.showMsgModal('error', '确定删除标签<' + name + '>吗？', () => {
          labelInfo.deleteSubLabel(self.$http, subLabelId).then(data => {
            if (data.OPT_STATUS === false) {
              self.showMsgModal('error',
                `${data.OPT_STATUS_CH},是否强制删除子标签？`,
                () => {
                  labelInfo.deleteSubLabelForce(self.$http, subLabelId)
                    .then(() => {
                      self.getSubLabel();
                    }, err => {
                      throw new Error(err);
                    });
                });
            } else {
              self.getSubLabel();
            }
          }, err => {
            throw new Error(err);
          });
        });
      },
      modifySubLabel(valid) {
        if (valid) {
          labelInfo.modifySubLabel(this.$http, {
            id: this.labelModal.id,
            name: this.labelModal.name.value,
            description: this.labelModal.description.value,
          }).then(data => {
            if (data.OPT_STATUS === false) {
              this.showMsgModal('error', data.OPT_STATUS_CH);
            } else {
              this.showMsgModal('success', data.OPT_STATUS_CH);
              this.getSubLabel();
              this.hideLabelModal()
            }
          }, err => {
            throw new Error(err);
          });
        }
      },
      modifySubLabelRules(valid) {
        if (valid) {
          let allValid = true;
          let ipValid = true;
          let validIndex = 0;
          _.forEach(this.subLabelRule.rules, (item, index) => {
            if (item.epc.value.length === 0 && item.ipfrom.value.length === 0 &&
                item.ipto.value.length === 0 && item.vlan.value.length === 0) {
              allValid = false;
              validIndex = index;
              return;
            }
            if ((item.ipfrom.value.length > 0 && item.ipto.value.length < 1) ||
              (item.ipfrom.value.length < 1 && item.ipto.value.length > 0)) {
              ipValid = false;
              validIndex = index;
              return;
            }
          });
          if (!allValid) {
            this.showMsgModal('error', `第 ${validIndex + 1} 条规则，不能全为空`);
          } else if (!ipValid) {
            this.showMsgModal('error', `第 ${validIndex + 1} 条规则，ip不能填一个`);
          } else {
            this.subLabelRule.showing = false;
            const rules = this.subLabelRule.rules.map(item => {
              const epcId = item.epc.value ? item.epc.value : 0;
              const ipfrom = item.ipfrom.value.length === 0 ?
                '0.0.0.0' : item.ipfrom.value;
              const ipto = item.ipto.value.length === 0 ?
                '255.255.255.255' : item.ipto.value;
              const vlanRange = item.vlan.value.length === 0 ?
                '0-4095' : `${item.vlan.value}-${item.vlan.value}`;
              return {
                epc_id: parseInt(epcId),
                ip_range: `${ipfrom}-${ipto}`,
                vlan_range: vlanRange,
              };
            });
            const options = {
              rules: JSON.stringify(rules),
              sublabel_id: this.subLabelModal.subTable.checkedFields
            };
            labelInfo.modifySubLabelRules(this.$http, options).then(data => {
              if (data.OPT_STATUS === false) {
                this.showMsgModal('error', data.OPT_STATUS_CH);
              } else {
                this.showMsgModal('success', data.OPT_STATUS_CH);
              }
            });
          }
        }
      },
      getSubLabelRules(subLabelId) {
        labelInfo.getSubLabelRules(this.$http, subLabelId).then(data => {
          if (data.OPT_STATUS) {
            this.subLabelRule.rules = [];
            if ((data.DATA[0] && data.DATA[0].rules === '[]') ||
               data.DATA.length === 0) {
              // 当没有rules时，不在默认添加一条规则，需要手动点击添加
              // const rule = _.cloneDeep(this.subLabelRule.tpl);
              // rule.epc.value = '0';
              // this.subLabelRule.rules.push(rule);
            } else {
              const rules = JSON.parse(data.DATA[0].rules);
              _.forEach(rules, item => {
                const rule = _.cloneDeep(this.subLabelRule.tpl);
                rule.epc.value = item.epc_id;
                const vlanStr = item.vlan_range === '0-4095' ? '' : item.vlan_range;
                if (vlanStr === '') {
                  rule.vlan.value = '';
                } else {
                  rule.vlan.value = vlanStr.split('-')[0];
                }
                const ipRange = item.ip_range.split('-');
                rule.ipfrom.value = ipRange[0] === '0.0.0.0' ? '' : ipRange[0];
                rule.ipto.value = ipRange[1] === '255.255.255.255' ? '' : ipRange[1];
                this.subLabelRule.rules.push(rule);
              });
            }
          } else {
            this.showMsgModal('error', data.OPT_STATUS_CH);
          }
        }, err => {
          throw new Error(err);
        });
      },
      addSubLabelRule() {
        const rule = _.cloneDeep(this.subLabelRule.tpl);
        rule.epc.value = '0';
        this.subLabelRule.rules.push(rule);
      },
      delSubLabelRule(index) {
        this.subLabelRule.rules.splice(index, 1);
        // if(this.subLabelRule.rules.length === 0){
        //   this.addSubLabelRule();
        // }
      },
      getEpcList() {
        labelInfo.getEpcList(this.$http).then(data => {
          data.unshift({
            id: 0,
            name: '任意'
          });
          this.epcList.data = data;
          data.forEach(item => {
            this.epcList.dataObj[item.id] = item.name;
          });
          this.epcList.checkedFields = data[0].id;
        }, err => {
          throw new Error(err);
        });
      },
      clickEpc(index) {
        this.subLabelRule.curRule = index;
      },
      selectedEpc() {
        this.subLabelRule.rules[this.subLabelRule.curRule].epc.value = this.epcList.checkedFields;
        return true;
      },
      init() {
        this.getLabel();
        this.getIpList();
        this.getEpcList();
      }
    },
    events: {
      refreshTime() {
        this.clickApply(this.activeButtonId)();
      },
    },
    ready() {
      this.init();
      this.clickApply('all')();
    },
    destroyed() {
    },
    route: {
      data() {}
    }
  } // eslint-disable-line semi
</script>

