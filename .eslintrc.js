const OFF = `off`
// eslint-disable-next-line no-unused-vars
const WARN = `warn`
const ERROR = `error`
const TEMP_OFF_WARN = `off`
const TEMP_OFF_ERROR = `off`
module.exports = {
	parser: `@typescript-eslint/parser`,
	parserOptions: {
		sourceType: `module`,
		ecmaVersion: 6, // latest
	},
	plugins: [
		`unused-imports`,
	],
	env: {
		node: true,
		browser: true,
		es6: true,
		jest: true,
		es2021: true,
	},
	extends: [
		`eslint:recommended`,
		// "plugin:import/recommended",
		`standard`,
	],
	settings: { react: { version: `detect` } },
	rules: {
		// "no-restricted-syntax": [
		//     ERROR,
		//     {
		//         selector: `MemberExpression[object.property.name='constructor'][property.name='name']`,
		//         message: `The minifier will make string based comparisons fail in production, so this is disallowed`,
		//     },
		// ],
		"no-delete-var": ERROR,
		"prefer-arrow-callback": OFF,
		"no-this-before-super": ERROR,
		"no-dupe-class-members": ERROR,
		"no-new-symbol": ERROR,
		"constructor-super": ERROR,
		"no-const-assign": ERROR,
		"no-class-assign": ERROR,
		"no-fallthrough": ERROR,
		"no-global-assign": ERROR,
		"no-case-declarations": TEMP_OFF_WARN, // warn
		"no-useless-escape": TEMP_OFF_WARN, // warn
		"no-warning-comments": [TEMP_OFF_WARN, { terms: [`todo`, `edb`], location: `anywhere` }], // warn
		"no-prototype-builtins": OFF,
		"no-undef": ERROR,
		"no-var": ERROR, // 2 is error
		"no-unused-vars": ERROR, // superceded by unused-imports/no-unused-imports and unused-imports/no-unused-vars
		// "unused-imports/no-unused-imports": ERROR,
		"no-inner-declarations": TEMP_OFF_WARN, // warn
		"no-unreachable": TEMP_OFF_WARN, // warn
		"no-ex-assign": ERROR,
		"no-extra-parens": ERROR,
		"no-extra-semi": ERROR,
		"no-extend-native": WARN,
		"no-func-assign": ERROR,
		"no-irregular-whitespace": ERROR,
		"no-obj-calls": ERROR,
		"no-template-curly-in-string": ERROR,
		"no-unexpected-multiline": ERROR,
		"no-unsafe-negation": ERROR,
		"valid-jsdoc": TEMP_OFF_ERROR,
		"valid-typeof": ERROR,
		"default-case": ERROR,
		"no-caller": ERROR,
		// semi-fixable below
		// "sort-imports": OFF,
		"no-confusing-arrow": [
			TEMP_OFF_ERROR,
			{ allowParens: false },
		],
		// stylistic preferences below
		// fixable below
		"no-implicit-coercion": OFF,
		"arrow-spacing": [
			ERROR,
			{ before: true, after: true },
		],
		"no-tabs": OFF,
		indent: [
			ERROR,
			`tab`,
		],
		// "linebreak-style": [
		//     ERROR,
		//     `windows`
		// ],
		quotes: [
			ERROR,
			`backtick`,
		],
		semi: [
			ERROR,
			`never`,
		],
		'comma-spacing': [ERROR],
		'no-trailing-spaces': [ERROR],
		'space-in-parens': [ERROR],
		'no-multi-spaces': [ERROR],
		'no-whitespace-before-property': [ERROR],
		'key-spacing': [ERROR],
		'getter-return': [OFF],
		'comma-dangle': [ERROR, `always-multiline`],
		'prefer-const': [OFF],
		'space-before-function-paren': [ERROR, `never`],
		'quote-props': [ERROR, `as-needed`],
		'object-curly-spacing': [ERROR, `always`],
		'prefer-promise-reject-errors': [OFF],
		'no-return-assign': [OFF],
		'no-shadow': [ERROR],
		'no-throw-literal': [OFF],
		'standard/no-callback-literal': [OFF],
		// 'newline-destructuring/newline': [ERROR, {
		//   items: 1,
		// }],
	},
}
