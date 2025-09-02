#!/usr/bin/env node
import fs from "fs";
import path from "path";

// Répertoire racine du projet
const rootDir = path.join(process.cwd(), "app"); // adapte si besoin

// Extensions à traiter
const exts = [".tsx", ".jsx"];

// Parcours récursif des fichiers
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (exts.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

// Traitement d’un fichier
function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Supprime legacyBehavior et passHref
  content = content
    .replace(/\s*legacyBehavior\s*/g, "")
    .replace(/\s*passHref\s*/g, "");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Modifié : ${filePath}`);
  }
}

// Exécution
const files = walk(rootDir);
files.forEach(processFile);

console.log("✅ Codemod terminé !");
