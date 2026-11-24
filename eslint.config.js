import { configs, plugins } from 'eslint-config-airbnb-extended';
import prettierConfig from 'eslint-config-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores(['dist', 'node_modules', 'coverage']),

  // Airbnb style guide (React + TypeScript flavour)
  plugins.stylistic,
  plugins.importX,
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  plugins.typescriptEslint,
  ...configs.base.recommended,
  ...configs.react.recommended,
  ...configs.base.typescript,
  ...configs.react.typescript,

  // Strict TypeScript rules on top of Airbnb
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.strict, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      // React 17+ JSX transform: React does not need to be in scope.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Props are typed with TypeScript; defaults are set via destructuring.
      'react/require-default-props': 'off',
      // Immer drafts in Redux Toolkit reducers are meant to be mutated.
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    },
  },

  {
    files: ['*.config.{js,ts}'],
    rules: { 'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }] },
  },

  // Must be last: turns off formatting rules that Prettier owns.
  prettierConfig,
]);
