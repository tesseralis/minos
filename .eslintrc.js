module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
    "react-app",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "react", "jsx-a11y", "@typescript-eslint"],
  rules: {
    "import/no-webpack-loader-syntax": "off",
    // don't need to import react in NextJS
    "react/react-in-jsx-scope": "off",
    // don't need hrefs in NextJS
    "jsx-a11y/anchor-is-valid": "off",
    // we have a lot of anonymous renderers passed as props
    "react/display-name": "off",
    // I care more about readibility than possible errors
    "react/no-unescaped-entities": "off",
    // typescript will take care of this for me
    "react/prop-types": "off",
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    // This is too annoying for a personal project
    "@typescript-eslint/no-explicit-any": "off",
    // Too annoying for a personal project -- maybe enable for specific libs?
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Lots of places where we use ! for simplicity
    "@typescript-eslint/no-non-null-assertion": "off",
    // Enabled only for parameters with defaults for clarity
    "@typescript-eslint/no-inferrable-types": [
      "error",
      {
        ignoreParameters: true,
      },
    ],
    "no-console": ["error"],
  },
}
