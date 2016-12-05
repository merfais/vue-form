module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6
  },
  extends: [
    'airbnb-base',
    'plugin:import/warnings',
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'vue',
    'jsdoc',
    'import'
  ],
  // add your custom rules here
  rules: {
    'import/no-unresolved': 0,
    'import/newline-after-import': 0,
    'import/imports-first': 0,
    'import/extensions': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,

    //jsdoc
    'jsdoc/check-param-names': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-description-complete-sentence': 0,
    'jsdoc/require-hyphen-before-param-description': 0,
    'jsdoc/require-param': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,


    //usage
    'arrow-parens': [0],
    'arrow-spacing': [1],
    'arrow-body-style': [0],
    'comma-dangle': [1, 'only-multiline'],
    'comma-spacing': [1],
    'consistent-return': [1],
    'eol-last': [0, 'unix'],
    'eqeqeq': [1],
    'func-names': [1, "never"],
    'global-require': [0],
    'guard-for-in': [1],
    'key-spacing': [1],
    'keyword-spacing': [1],
    'indent': [1, 2],
    'max-len': [1],
    'new-cap': [1],
    'no-bitwise': [1, {
      'allow': ['|', '&']
    }],
    'no-lonely-if': [0],
    'no-mixed-operators': [1, {
      'groups': [
        ["+", "-", "*", "/", "%", "**"],
        ["&", "|", "^", "~", "<<", ">>", ">>>"],
        ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
        ["&&", "||"],
        ["in", "instanceof"]
      ],
      'allowSamePrecedence': true
    }],
    'no-empty': [1, {
      'allowEmptyCatch': true
    }],
    'no-empty-function': [2],
    'no-else-return': [0],
    'no-trailing-spaces': [2, {
      "skipBlankLines": true
    }],
    'no-new': [1],
    'no-multiple-empty-lines': [1],
    'no-unused-vars': [1],
    'no-restricted-syntax': [1, "DebuggerStatement"],
    'no-plusplus': [1],
    'no-param-reassign': [1, {
      "props": false
    }],
    'no-shadow': [0],
    'object-shorthand': [0],
    'object-curly-spacing': [1],
    'one-var': [1],
    'one-var-declaration-per-line': [1, 'initializations'],
    'prefer-arrow-callback': [0],
    'prefer-const': [0],
    'prefer-template': [0],
    'prefer-spread': [1],
    'padded-blocks': [1],
    'quotes': [1, "single", {
      "avoidEscape": true,
      "allowTemplateLiterals": true
    }],
    'quote-props': [1],
    'radix': [1, 'as-needed'],
    'spaced-comment': [0],
    'space-infix-ops': [1],
    'semi': [0],
    'space-before-function-paren': [1, "never"],
    'space-before-blocks': [1],
    'no-unneeded-ternary': [1],
    'newline-per-chained-call': [1, {
      "ignoreChainWithDepth": 3
    }],
  },
  env: {
    'browser': true,
    'jquery': true,
    'commonjs': true,
    'node': true

  },
  globals: {
    'Vue': true,
    'ys': true,
    '_': true,
  },
  settings: {
    "html/indent": "+2",
    'html/report-bad-indent': 1
  },
  color: true,
};

