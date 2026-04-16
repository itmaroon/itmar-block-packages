import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

// 外部依存の判定を関数形式にして、サブパスも含めて完全に除外する
const isExternal = (id) => {
  const externals = [
    "react",
    "react-dom",
    "styled-components",
    "nanoid",
    "react-select",
    "lodash",
    "swiper",
    "@wordpress",
  ];
  // 完全一致、または「パッケージ名/」で始まるサブパスを外部として扱う
  return externals.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));
};

const commonPlugins = [nodeResolve({ extensions }), commonjs()];

export default [
  // ESM（モダンなビルド環境用）
  {
    input: "src/index.ts",
    external: isExternal, // 関数を割り当てる
    output: {
      dir: "build/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      // entryFileNames を指定することで、余計なパス計算を防ぐ
      entryFileNames: "[name].js",
    },
    plugins: [
      ...commonPlugins,
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "build/esm/types",
        rootDir: "src",
        // ビルド速度向上のため
        noEmitOnError: true,
      }),
    ],
  },

  // CJS（互換性・古いNode環境用）
  {
    input: "src/index.ts",
    external: isExternal, // 関数を割り当てる
    output: {
      dir: "build/cjs",
      format: "cjs",
      exports: "named",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].js",
    },
    plugins: [
      ...commonPlugins,
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "build/cjs/types",
        rootDir: "src",
        noEmitOnError: true,
      }),
    ],
  },
];
