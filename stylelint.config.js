module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  'rules': {
    'indentation': 2,
    'string-quotes': 'single',
    'no-duplicate-selectors': true,
    'color-hex-case': 'upper',
    'color-hex-length': 'short',
    'color-named': 'never',
    'selector-max-id': 0,
    'selector-combinator-space-after': 'always',
    'selector-attribute-quotes': 'always',
    'selector-attribute-operator-space-before': 'always',
    'selector-attribute-operator-space-after': 'always',
    'selector-attribute-brackets-space-inside': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-no-important': true,
    'declaration-colon-space-before': 'never',
    'declaration-colon-space-after': 'always',
    'number-leading-zero': 'always',
    'function-url-quotes': 'always',
    'font-weight-notation': 'named-where-possible',
    'font-family-name-quotes': 'always-unless-keyword',
    'comment-whitespace-inside': 'always',
    'comment-empty-line-before': 'always',
    'rule-empty-line-before': 'always-multi-line',
    'selector-pseudo-class-parentheses-space-inside': 'always',
    'selector-max-universal': 0,
    'selector-max-type': 2,
    'media-feature-range-operator-space-before': 'always',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-parentheses-space-inside': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-colon-space-after': 'always',
    'at-rule-no-unknown': null,
    'no-descending-specificity': null
  }
}
