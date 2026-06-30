// ESLint 10 flat config. eslint-config-next 16 ships native flat configs, so we
// import them directly instead of via @eslint/eslintrc's FlatCompat (which is
// incompatible with ESLint 10 + the Next plugin's circular config structure).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    // React Compiler advisory rules newly enabled by eslint-config-next 16.
    // They flag common, working patterns (e.g. reading matchMedia on mount,
    // mounted-flag effects); keep them as visible warnings to address
    // incrementally rather than hard build-blocking errors.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/incompatible-library": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
