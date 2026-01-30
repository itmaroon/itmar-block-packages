import { nodeResolve } from "@rollup/plugin-node-resolve";
//import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

const extensions = [".js", ".jsx"];

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

const babelConfig = {
  extensions,
  babelHelpers: "bundled",
  exclude: "node_modules/**",
  presets: [
    ["@babel/preset-env", { modules: false, targets: { esmodules: true } }],
    // JSXをJSへ変換（WP環境ならclassicが無難）
    ["@babel/preset-react", { runtime: "classic" }],
  ],
};

export default [
  // ESM（tree-shaking用）
  {
    input: "src/index.js",
    external,
    output: {
      dir: "build/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [nodeResolve({ extensions }), babel(babelConfig)],
  },

  // CJS（互換用）
  {
    input: "src/index.js",
    external,
    output: {
      dir: "build/cjs",
      format: "cjs",
      exports: "named",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [nodeResolve({ extensions }), babel(babelConfig)],
  },
];
