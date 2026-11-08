import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
 ...nextVitals,
 ...nextTs,
 {
  rules: {
   "react-hooks/set-state-in-effect": "off",
   "react-hooks/purity": "off",
   "react-hooks/static-components": "off",
   "react-hooks/exhaustive-deps": "off",
   "jsx-a11y/role-supports-aria-props": "off",
   "@next/next/no-img-element": "off",
   "@typescript-eslint/no-unused-vars": "off",
  },
 },
 globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
 ]),
]);

export default eslintConfig;
