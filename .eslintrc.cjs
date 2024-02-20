module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "@electron-toolkit/eslint-config-ts/recommended",
        "@electron-toolkit/eslint-config-prettier",
    ],
    rules: {
        // "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        // "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        // "react-hooks/rules-of-hooks": "warn",
        // "react-hooks/exhaustive-deps": "warn",
        // "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        // "@typescript-eslint/no-non-null-assertion": "off",
        // "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        "prefer-const": "warn",
        // // "@typescript-eslint/no-floating-promises": "warn",
    },
}
