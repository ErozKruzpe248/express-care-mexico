import { cp, lstat, realpath, rm } from "node:fs/promises";
import { join } from "node:path";

const project = await realpath(new URL("../", import.meta.url));
const output = join(project, "dist");
const source = join(project, "src");
const existingOutput = await lstat(output).catch(error => {
  if (error.code !== "ENOENT") throw error;
});

if (existingOutput) {
  if (!existingOutput.isDirectory() || await realpath(output) !== output) {
    throw new Error("dist debe ser una carpeta dentro del proyecto.");
  }
  await rm(output, { recursive: true });
}

await cp(source, output, { recursive: true });
console.log("Sitio estático generado en dist/.");
