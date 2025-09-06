// Script de test pour voir quelles icônes seront affichées pour chaque formation
const formations = [
  "Créer et gérer un site WordPress & Stratégie de contenu Inbound Marketing",
  "Création de son site internet (WordPress) + Stratégie de développement digital", 
  "Maîtriser Facebook Ads et LinkedIn Ads pour une stratégie publicitaire efficace",
  "Maîtriser Canva pour le web, les réseaux sociaux et la vente en ligne",
  "SEO + WooCommerce (SEOPress & WooCommerce)",
  "SEO les fondamentaux (SEOPress)",
  "Marketing Digital Brevo + Techniques de Vente en Ligne (WooCommerce)",
  "Génération de contenu avec ChatGPT + Automatisation Marketing",
  "Gestion de la sécurité (WordPress) + Techniques d'analyse statistique Web avec Matomo"
];

const getFormationIcon = (titre: string) => {
  const t = titre.toLowerCase();
  
  // IA / ChatGPT (priorité haute car spécifique)
  if (t.includes('chatgpt') || t.includes('intelligence artificielle') || t.includes('génération de contenu')) {
    return '🤖 Bot (IA)';
  }
  // Design / Canva (priorité haute car spécifique)
  else if (t.includes('canva') || t.includes('design')) {
    return '🎨 Palette (Design)';
  }
  // Réseaux sociaux / Facebook / LinkedIn (priorité haute car spécifique)
  else if (t.includes('facebook') || t.includes('linkedin') || t.includes('ads')) {
    return '📤 Share2 (Réseaux sociaux)';
  }
  // SEO (priorité haute car spécifique)
  else if (t.includes('seo') || t.includes('seopress') || t.includes('référencement')) {
    return '🔍 Search (SEO)';
  }
  // Analyse / Matomo (priorité haute car spécifique)
  else if (t.includes('matomo') || t.includes('analyse') || t.includes('statistique')) {
    return '📊 BarChart (Analyse)';
  }
  // Sécurité (priorité haute car spécifique)
  else if (t.includes('sécurité') || t.includes('maintenance')) {
    return '🛡️ Shield (Sécurité)';
  }
  // E-commerce / WooCommerce
  else if (t.includes('woocommerce') || t.includes('e-commerce') || t.includes('vente en ligne')) {
    return '🛒 ShoppingBag (E-commerce)';
  }
  // WordPress
  else if (t.includes('wordpress') || t.includes('site internet')) {
    return '🌐 Globe (WordPress)';
  }
  // Marketing / Publicité
  else if (t.includes('marketing') || t.includes('publicitaire') || t.includes('brevo')) {
    return '📈 TrendingUp (Marketing)';
  }
  // Stratégie / Inbound Marketing
  else if (t.includes('stratégie') || t.includes('inbound') || t.includes('développement digital')) {
    return '💡 Lightbulb (Stratégie)';
  }
  // Développement
  else if (t.includes('développement') || t.includes('code')) {
    return '💻 Code (Développement)';
  }
  
  return '📚 BookOpen (Défaut)';
};

console.log('=== TEST DES ICÔNES POUR LES FORMATIONS ===\n');

formations.forEach((titre, index) => {
  const icon = getFormationIcon(titre);
  console.log(`${index + 1}. ${titre}`);
  console.log(`   → ${icon}\n`);
});

console.log('✅ Test terminé - Les icônes appropriées seront affichées sur chaque carte !');