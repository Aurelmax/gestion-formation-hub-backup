// check-endpoints.js
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

const endpoints = [
  "/api/auth/session",
  "/api/programmes-formation/par-categorie/groupes?page=1&limit=6",
  "/api/categories-programme",
  "/catalogue"
];

async function checkEndpoint(url) {
  try {
    const res = await fetch(`${BASE_URL}${url}`);
    const text = await res.text();
    console.log(`✅ ${url} -> ${res.status}`);
    // Optionnel : afficher la réponse si ce n'est pas JSON
    // console.log(text);
  } catch (err) {
    console.log(`❌ ${url} -> Erreur : ${err.message}`);
  }
}

(async () => {
  console.log("=== Test des endpoints essentiels ===\n");
  for (const endpoint of endpoints) {
    await checkEndpoint(endpoint);
  }
  console.log("\n=== Fin du test ===");
})();
