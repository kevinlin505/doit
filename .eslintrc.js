module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true,
    "es6": true
  },
  "globals": {
    "crl8": false,
    "window": false,
    "document": false,
    "fetch": false,
    "fetchJsonp": false,
    "formData": false,
    "Expo": false
  },
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-native"
  ],
  "rules": {
    "arrow-body-style": "off",
    "arrow-parens": "off",
    "class-methods-use-this": "off",
    "comma-dangle": ["error", "never"],
    "eol-last": "off",
    "lines-around-comment": ["error", {
      "beforeBlockComment": true,
      "beforeLineComment": true, 
      "allowBlockStart": true,
      "allowBlockEnd": true,
      "allowObjectStart": true,
      "allowObjectEnd": true,
      "allowArrayStart": true,
      "allowArrayEnd": true
    }],
    "max-len": "off",
    "no-mixed-operators": ["error", { "allowSamePrecedence": true }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-underscore-dangle": [2, { "allowAfterThis": true }],
    "no-var": "off",
    "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": false }],
    "prefer-arrow-callback": ["error", { "allowNamedFunctions": true }],
    "radix": ["error", "as-needed"],
  
    // React-specific
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/forbid-prop-types": "off",
    "react/no-array-index-key": "off",
    "react/sort-comp": [1, {
      "order": [
        "static-methods",
        "lifecycle",
        "everything-else",
        "render"
      ]
    }],
    
    // Accessibility
    "jsx-a11y/no-static-element-interactions": "off"
  }
};