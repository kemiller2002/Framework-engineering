import { mkdir, readFile, rename, stat } from "node:fs/promises";
import path from "node:path";
import { hashFile } from "./hash-file.js";

export async function safeMove(sourcePath, targetPath) {
  const hashBefore = await hashFile(sourcePath);
  const sizeBefore = (await stat(sourcePath)).size;
  try {
    await stat(targetPath);
    throw new Error(`Target already exists: ${targetPath}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(targetPath), { recursive: true });
  await rename(sourcePath, targetPath);
  const hashAfter = await hashFile(targetPath);
  const sizeAfter = (await stat(targetPath)).size;
  if (hashBefore !== hashAfter || sizeBefore !== sizeAfter) {
    throw new Error(`Hash or size changed during move: ${sourcePath} -> ${targetPath}`);
  }
  return { hashBefore, hashAfter, sizeBefore, sizeAfter };
}
