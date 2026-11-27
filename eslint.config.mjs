import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/legacy-backup/**",
      "scripts/**",
    ],
  },
  ...[nextCoreWebVitals].flat(),
  ...[nextTypescript].flat(),
  eslintConfigPrettier,
];

export default eslintConfig;
