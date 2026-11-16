const fs = require("node:fs/promises");
const path = require("node:path");
const { transform } = require("esbuild");

const sourceDirectory = path.join(__dirname, "src");
const outputDirectory = path.join(__dirname, "dist", "assets");

async function compileDirectory(relativeDirectory = "") {
  const entries = await fs.readdir(path.join(sourceDirectory, relativeDirectory), {
    withFileTypes: true,
  });
  await fs.mkdir(path.join(outputDirectory, relativeDirectory), { recursive: true });

  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      await compileDirectory(relativePath);
      continue;
    }
    if (!/\.jsx?$/.test(entry.name)) continue;

    const source = await fs.readFile(path.join(sourceDirectory, relativePath), "utf8");
    const outputPath = path.join(outputDirectory, relativePath.replace(/\.jsx$/, ".js"));
    if (!entry.name.endsWith(".jsx")) {
      await fs.writeFile(outputPath, source);
      continue;
    }

    const { code } = await transform(source, {
      loader: "jsx",
      jsx: "automatic",
      jsxImportSource: "portfolio-runtime",
      format: "esm",
      sourcefile: relativePath.replaceAll(path.sep, "/"),
    });
    const runtimeImport = path
      .relative(path.dirname(outputPath), path.join(outputDirectory, "jsx-runtime.js"))
      .replaceAll(path.sep, "/");
    const runtimeSpecifier = runtimeImport.startsWith(".") ? runtimeImport : "./" + runtimeImport;
    await fs.writeFile(outputPath, code.replace('"portfolio-runtime/jsx-runtime"', JSON.stringify(runtimeSpecifier)));
  }
}

compileDirectory().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
