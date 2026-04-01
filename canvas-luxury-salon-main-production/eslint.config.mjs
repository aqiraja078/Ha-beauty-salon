import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

// Next.js ships flat ESLint configs directly; avoid FlatCompat here because it can
// trip ESLint 9's config validator on some setups.
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    files: ["scripts/**/*.cjs"],
    rules: {
      // These scripts are CommonJS by design.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
