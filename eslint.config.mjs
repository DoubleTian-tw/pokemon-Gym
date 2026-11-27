import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

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
];

export default eslintConfig;
