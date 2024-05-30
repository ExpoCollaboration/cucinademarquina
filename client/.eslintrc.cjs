module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  'plugins': [
    'react',
    'react-hooks',
  ],
  'rules': {
    /**********************/
    /* General Code Rules */
    /**********************/

    'indent': ['error', 2],

    'quotes': ['error', 'single'],

    'semi': ['error', 'always'],

    // Enforce import order
    'import/order': 'error',

    // Imports should come first
    'import/first': 'error',

    // Other import rules
    'import/no-mutable-exports': 'error',

    // Allow paren-less arrow function only when there's no braces
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],

    // Allow async-await
    'generator-star-spacing': 'off',

    // Allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-console': 'off',

    // Prefer const over let
    'prefer-const': ['error', {
      destructuring: 'any',
      ignoreReadBeforeAssign: false,
    }],

    // No single if in an "else" block
    'no-lonely-if': 'error',

    // Force curly braces for control flow
    // including if blocks with a single statement
    curly: ['error', 'all'],

    // No async function without await
    'require-await': 'error',

    // Force dot notation when possible
    'dot-notation': 'error',

    'no-var': 'error',

    // Force object shorthand where possible
    'object-shorthand': 'error',

    // No useless destructuring/importing/exporting renames
    'no-useless-rename': 'error',

    'comma-dangle': ['error', 'always-multiline'],
    'no-new': 0,
    'no-undef': 0,

    /****************/
    /* React Rules */
    /****************/

    'react/jsx-indent': ['error', 2],

    'react/jsx-tag-spacing': ['error', {
      'closingSlash': 'never',
      'beforeSelfClosing': 'always',
      'afterOpening': 'never',
      'beforeClosing': 'never',
    }],

    'react/prop-types': 'off',

    'react/react-in-jsx-scope': 'off',

    'react/jsx-filename-extension': [1, { 'extensions': ['.jsx', '.js'] }],

    'react/jsx-uses-react': 'off',

    'react/jsx-uses-vars': 'error',

    'react-hooks/rules-of-hooks': 'error',

    'react-hooks/exhaustive-deps': 'warn',
  },

  settings: {
    'react': {
      'version': 'detect',
    },
  },
};