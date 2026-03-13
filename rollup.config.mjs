import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
const extensions = [".js", ".jsx", ".ts", ".tsx"];

// WordPress/React関連はバンドルしない（利用側の@wordpress/scriptsに任せる）
const external = (id) =>
  id === "react" ||
  id === "react-dom" ||
  id.startsWith("@wordpress/") ||
  id === "@wordpress/icons" ||
  id === "lodash" ||
  id.startsWith("lodash/") ||
  id === "styled-components" ||
  id === "react-select";

export default [
  // ESM（tree-shaking用）
  {
    input: "src/index.ts",
    external,
    output: {
      dir: "build/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].js",
    },
    //plugins: [nodeResolve({ extensions }), babel(babelConfig)],
    plugins: [
      nodeResolve({ extensions }),
      typescript({
        tsconfig: "./tsconfig.json",
        declarationDir: "build/esm/types", // ESM用の型定義
      }),
    ],
  },

  // CJS（互換用）
  {
    input: "src/index.ts",
    external,
    output: {
      dir: "build/cjs",
      format: "cjs",
      exports: "named",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].js",
    },
    //plugins: [nodeResolve({ extensions }), babel(babelConfig)],
    plugins: [
      nodeResolve({ extensions }),
      typescript({
        tsconfig: "./tsconfig.json",
        declarationDir: "build/cjs/types",
      }),
    ],
  },
];
