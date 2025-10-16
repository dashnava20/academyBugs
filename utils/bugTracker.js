// utils/bugTracker.js
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('bugsFound.json');

// 🧼 Resetea el archivo (lo usaremos en beforeAll)
export function resetFile() {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// 📝 Agrega un bug al JSON (sin duplicados)
export function saveBug(bugName) {
  let bugs = [];
  try {
    bugs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    // Si no existe o está corrupto, lo inicializamos vacío
    bugs = [];
  }

  if (!bugs.includes(bugName)) {
    bugs.push(bugName);
    fs.writeFileSync(filePath, JSON.stringify(bugs, null, 2));
  }
}

// 📖 Lee los bugs encontrados
export function callBugs() {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}
