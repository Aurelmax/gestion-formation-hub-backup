import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Accessibilite = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Accessibilité & Personnes en situation de handicap</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-sm mb-8">
          <p className="text-blue-800 font-medium mb-2">GESTIONMAX s'engage à rendre ses formations accessibles à toutes et tous, y compris aux personnes en situation de handicap, qu'il soit temporaire ou permanent, visible ou invisible.</p>
        </div>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Référent handicap</h2>
          <div className="mb-4 bg-gray-50 p-4 rounded border-l-4 border-blue-400">
            <p className="flex items-center font-medium mb-2">
              <span className="text-gray-700 mr-2">Nom :</span> 
              <span className="text-blue-800">Aurélien Lavayssiere</span>
            </p>
            <p className="flex items-center font-medium mb-2">
              <span className="text-gray-700 mr-2">Fonction :</span> 
              <span className="text-blue-800">Formateur indépendant, référent handicap</span>
            </p>
            <p className="flex items-center font-medium">
              <span className="text-gray-700 mr-2">Contact :</span> 
              <span className="text-blue-800">aurelien@gestionmax.fr / 06 46 02 24 68</span>
            </p>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Nos engagements</h2>
          <ul className="space-y-2 ml-5 list-disc">
            <li>Recueillir les besoins spécifiques des participants en amont</li>
            <li>Étudier les possibilités d'aménagement (supports, rythme, outils, etc.)</li>
            <li>Mobiliser si besoin notre réseau de partenaires spécialisés</li>
          </ul>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Exemples d'adaptations possibles</h2>
          <ul className="space-y-2 ml-5 list-disc">
            <li>Supports de formation adaptés (PDF lisibles, contraste renforcé)</li>
            <li>Enregistrement audio ou vidéo des séances (sur demande)</li>
            <li>Adaptation du rythme ou des horaires</li>
            <li>Formation à distance avec assistance technique dédiée</li>
          </ul>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Réseau de partenaires</h2>
          <p className="mb-3">En cas de besoin, nous pouvons nous appuyer sur :</p>
          <ul className="space-y-2 ml-5 list-disc">
            <li><strong>Cap Emploi 06</strong> - accompagnement à l'insertion professionnelle</li>
            <li><strong>Ressources Handicap Formation (RHF)</strong> - Conseil en accessibilité des formations</li>
            <li><strong>MDPH 06</strong> - pour l'évaluation des situations de handicap</li>
            <li><strong>Associations locales</strong> d'insertion et d'accompagnement</li>
          </ul>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Ce que nous demandons</h2>
          <p className="mb-2 text-gray-700">
            Lors de votre inscription, vous pourrez alors signaler dans le formulaire de prérequis toute situation particulière
            nécessitant une adaptation. Cela nous permettra de prévoir des aménagements adaptés à votre situation dans les
            meilleures conditions.
          </p>
          <div className="mt-4 text-center">
            <a href="/contact" className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Nous contacter pour plus d'informations
            </a>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Engagement d'accessibilité de Gestionmax</h2>
          <p className="mb-4">
            Nous nous engageons à rendre notre site web accessible à tous, y compris aux personnes en situation de handicap, 
            en garantissant l'accès à l'information et à nos services sans discrimination. Nous nous efforçons d'améliorer 
            en permanence l'accessibilité de notre site pour tous les internautes, quelles que soient leurs capacités ou 
            les technologies qu'ils utilisent.
          </p>
          <p>
            Cette déclaration d'accessibilité s'applique au site : GestionMax Formation.
          </p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">1. Normes de référence</h2>
          <p className="mb-3">
            Le design et le développement de ce site web s'appuient sur les référentiels internationaux et nationaux 
            en matière d'accessibilité numérique :
          </p>
          <ul className="list-disc ml-8 mb-3 space-y-1">
            <li>WCAG 2.1 (Web Content Accessibility Guidelines) niveau AA.</li>
            <li>RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité).</li>
          </ul>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">2. État de conformité</h2>
          <p className="mb-3">
            Le site GestionMax Formation est en cours de développement et d'amélioration continue. 
            À ce stade, nous estimons que le site est partiellement conforme au RGAA 4.1.
          </p>
          <p>
            Nous sommes conscients que certaines sections ou fonctionnalités peuvent encore présenter des difficultés 
            d'accès pour certains utilisateurs. Nous travaillons activement pour identifier et corriger ces problèmes.
          </p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">3. Fonctionnalités d'accessibilité mises en œuvre</h2>
          <p className="mb-3">
            Voici les actions concrètes que nous avons mises en place pour améliorer l'accessibilité :
          </p>
          
          <div className="space-y-3 ml-4">
            <div>
              <p className="font-medium text-blue-700">Navigation au clavier :</p>
              <p className="ml-2">L'ensemble du site est navigable au clavier sans l'utilisation d'une souris. La zone de focus est visible pour aider l'utilisateur à se repérer.</p>
            </div>
            
            <div>
              <p className="font-medium text-blue-700">Sémantique HTML :</p>
              <p className="ml-2">Le contenu est structuré avec des balises HTML sémantiques (&lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;button&gt;) pour que les lecteurs d'écran puissent en comprendre la hiérarchie et la fonction.</p>
            </div>
            
            <div>
              <p className="font-medium text-blue-700">Texte alternatif pour les images :</p>
              <p className="ml-2">Toutes les images porteuses de sens ont une description textuelle alternative (alt) qui peut être lue par les lecteurs d'écran.</p>
            </div>
            
            <div>
              <p className="font-medium text-blue-700">Contraste des couleurs :</p>
              <p className="ml-2">Les contrastes de couleurs entre le texte et les fonds ont été testés pour assurer une lisibilité optimale.</p>
            </div>
            
            <div>
              <p className="font-medium text-blue-700">Utilisation d'attributs ARIA :</p>
              <p className="ml-2">Nous avons utilisé les attributs ARIA pour fournir une sémantique supplémentaire aux composants complexes qui ne sont pas nativement accessibles, comme les menus interactifs ou les fenêtres modales.</p>
            </div>
            
            <div>
              <p className="font-medium text-blue-700">Redimensionnement du texte :</p>
              <p className="ml-2">Les utilisateurs peuvent ajuster la taille de la police via les fonctionnalités de leur navigateur sans que cela n'entraîne une perte d'informations ou une dégradation du design.</p>
            </div>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">4. Retour d'information et contact</h2>
          <p className="mb-3">
            Malgré nos efforts, si vous rencontrez une difficulté pour accéder à un contenu ou à un service sur notre site, 
            nous vous encourageons à nous en faire part. Votre retour est précieux pour nous aider à améliorer l'accessibilité.
          </p>
          <p className="mb-3">Pour nous signaler un problème ou pour toute question, veuillez nous contacter :</p>
          
          <div className="ml-4">
            <p className="mb-1">E-mail : [à compléter]</p>
            <p>Formulaire de contact : <a href="/contact" className="text-blue-600 hover:underline">Contactez-nous</a></p>
          </div>
          
          <p className="mt-3">
            Nous nous engageons à prendre en compte votre signalement et à vous répondre dans les meilleurs délais. 
            Si le problème ne peut être résolu, nous nous efforcerons de vous proposer une solution alternative.
          </p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">5. Recours</h2>
          <p>
            Si vous estimez que nous n'avons pas répondu de manière satisfaisante à votre signalement, 
            vous pouvez adresser une plainte au Défenseur des droits.
          </p>
        </section>
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Dernière mise à jour de cette déclaration : 04/08/2025</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Accessibilite;
