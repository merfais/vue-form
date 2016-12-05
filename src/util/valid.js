/**
 * @file    验证工具
 * @author  biwenqing (wenqing@yunshan.net.cn)
 */

import _ from 'lodash';
import validator from 'validator';

/**
 * 定制规则列表，根据validate函数决定使用正则或函数
 *
 * @constant
 * @type {Object}
 *
 */
const SELF_DEFINED_RULES = {
  required: /\S/,
  isAge: ['isInt', {
    min: 0,
    max: 150
  }],
  isPhone: ['isMobilePhone', 'zh-CN'],
};


/**
 * 定制错误提示信息，根据rule映射
 *
 * @constant
 * @type {Object}
 *
 */
const ERROR_MSG = {
  required: '必填',
  isAge: '请输入正确的年龄',
  isPhone: '请输入中国地区电话号码',
  isEmail: '请输入正确的邮箱地址',
};

/**
 * 自定义的校验方式，采用和validator相同的参数以统一兼容
 *
 * @name validate
 * @function
 * @param {string} value 被校验的字段
 * @param {string} rule 校验规则名字
 * @param {Any} options 校验的额外参数，参考validator
 * @returns {boolean} 校验结果
 */
// function validate(value, rule, options) { // eslint-disable-line no-unused-vars
//   const reg = new RegExp(RULES[rule]);
//   return reg.test(value);
// }


// 将自定义的检查注入到validator中
// 用遍历方式使得能直接用自定义方法定义新别名
for (let key in SELF_DEFINED_RULES) {
  if (key in validator) {
    throw new Error('rule name already defined');
  }
  let param = SELF_DEFINED_RULES[key];
  if (param instanceof RegExp) {
    validator[key] = (a) => param.test(a)
  } else if (_.isArray(param) && param[0] in validator) {
    let ruleName = param[0];
    validator[key] = (a) => {
      param[0] = a;
      return validator[ruleName].apply(null, param)
    }
  } else {
    throw new Error('illege selfdefined rule');
  }
}

/**
 * 准备校验函数的参数
 *
 * @name prepareParam
 * @function
 * @param {string} value 被校验的字段
 * @param {Array | string} rule 校验规则
 * @returns {Object} check函数需要的参数 {rule, param}
 */
function prepareParam(value, rule) {
  const ruleClone = _.cloneDeep(rule);
  let ruleStr;
  let options;
  if (_.isArray(ruleClone)) {
    ruleStr = ruleClone.shift();
    ruleClone.unshift(value);
    options = ruleClone;
  } else if (_.isString(ruleClone)) {
    ruleStr = ruleClone;
    options = [value];
  } else {
    // console.log('参数错误');
    throw new Error('参数错误');
  }
  return {
    rule: ruleStr,
    param: options,
  };
}

/**
 * 根据rule校验param是否通过规则，
 *
 * @name check
 * @function
 * @param {Object} 必须是{rule, param}的结构，es6语法
 *                  传入validate或validator的参数
 * @returns {Object} 携带result和msg的对象
 */
function check({
  rule,
  param
}) {
  let result;
  if (rule in validator) {
    result = validator[rule].apply(null, param);
  } else {
    // console.log(`rule=${rule} => 无此规则配置`);
    throw new Error(`rule=${rule} => 无此规则配置`);
  }
  return {
    valid: result,
    msg: ERROR_MSG[rule] ? ERROR_MSG[rule] : '此规则无提示信息',
  };
}


/**
 * 检验value是否通过rule的验证
 *
 * @name isValid
 * @function
 * @param {string} value 被校验的字段
 * @param {string | Array} rule 校验规则
 * @returns {boolean} 检验是否通过的bool值
 */
function isValid(value, rule) {
  return check(prepareParam(value, rule));
}

/**
 * 校验value是否通过所有rules
 *
 * @name isValidMulti
 * @function
 * @param {string} value 被校验的字段
 * @param {Array} rules 校验规则
 * @returns {Object} 携带{rule:{result,msg}的对象
 */
function isValidMulti(value, rules) {
  const result = {};
  if (_.isArray(rules)) {
    _.forEach(rules, rule => {
      const param = prepareParam(value, rule);
      result[param.rule] = check(param);
    });
  } else {
    // console.log('需要传入数组');
    throw new Error('需要传入数组');
  }
  return result;
}

/**
 * 获取规则对应msg的对象
 *
 * @name getRuleMsg
 * @function
 * @param {Array} rules 规则数组
 * @returns {Object} 携带{rule:msg}的对象
 */
function getRuleMsg(rules) {
  const rtnRule = {};
  if (_.isArray(rules)) {
    _.forEach(rules, item => {
      let rule;
      if (_.isString(item)) {
        rule = item;
      } else if (_.isArray(item)) {
        rule = item[0];
      }
      if (ERROR_MSG[rule]) {
        rtnRule[rule] = ERROR_MSG[rule];
      } else {
        rtnRule[rule] = '此规则无提示信息';
      }
    });
  } else {
    // console.log('rules 需要传入数组');
    throw new Error('rules 需要传输数组');
  }
  return rtnRule;
}


module.exports = {
  isValid,
  isValidMulti,
  getRuleMsg,
};

