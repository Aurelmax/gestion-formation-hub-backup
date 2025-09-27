import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Politique de Confidentialité</h1>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <p className="mb-4">
            La présente politique de confidentialité a pour but de vous informer sur la manière dont Gestionmax, représentée par Aurélien Lavessière, traite les données à caractère personnel que vous pourriez nous communiquer lors de l'utilisation de notre site web.
          </p>
          <p className="mb-4">
            Nous nous engageons à respecter la vie privée des utilisateurs et à traiter leurs données de manière strictement confidentielle, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi française "Informatique et Libertés".
          </p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">1. Identité du responsable de traitement</h2>
          <p className="mb-3">Le responsable du traitement des données personnelles collectées sur le site est :</p>
          <div className="ml-4">
            <p className="mb-1">Gestionmax – Aurélien Lavessière</p>
            <p className="mb-1">SIRET : 483 797 213 00061</p>
            <p className="mb-1">Adresse : [à compléter avec votre adresse professionnelle]</p>
            <p className="mb-1">E-mail : [à compléter]</p>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">2. Données collectées et finalités du traitement</h2>
          <p className="mb-3">Nous collectons les données suivantes :</p>
          
          <div className="ml-4 mb-4">
            <p className="font-medium text-blue-700 mb-2">Données de contact :</p>
            <p className="mb-3">Lorsque vous utilisez un formulaire de contact sur notre site, nous collectons les informations que vous nous fournissez (nom, prénom, adresse e-mail, etc.) afin de pouvoir répondre à votre demande et de vous contacter si nécessaire. Le traitement de ces données est basé sur votre consentement et l'intérêt légitime de répondre à votre sollicitation.</p>
            
            <p className="font-medium text-blue-700 mb-2">Données de connexion et d'utilisation :</p>
            <p className="mb-3">Nous pouvons collecter des informations techniques sur votre navigation (adresse IP, pages visitées, temps de connexion) à des fins de mesure d'audience et d'amélioration de l'expérience utilisateur. Ces données sont anonymisées dans la mesure du possible. Le traitement est fondé sur l'intérêt légitime de l'éditeur du site à en mesurer l'audience.</p>
            
            <p className="font-medium text-blue-700 mb-2">Cookies :</p>
            <p>Pour plus d'informations sur les cookies et leur utilisation, veuillez consulter la section dédiée ci-dessous.</p>
          </div>
          
          <p className="mb-3">Nous ne collectons aucune donnée sensible (origine raciale ou ethnique, opinions politiques, croyances religieuses, etc.).</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">3. Destinataires des données</h2>
          <p className="mb-3">Les données collectées sont destinées exclusivement à Gestionmax – Aurélien Lavessière.</p>
          <p>Vos données personnelles ne sont en aucun cas cédées, louées ou vendues à des tiers.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">4. Durée de conservation des données</h2>
          <p className="mb-3">Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités pour lesquelles elles ont été collectées, soit :</p>
          
          <div className="ml-4">
            <p className="mb-2"><span className="font-medium">Données de formulaire :</span> Elles sont conservées pendant la durée de la correspondance et jusqu'à un maximum de 3 ans après notre dernier contact, sauf obligation légale de conservation plus longue.</p>
            <p><span className="font-medium">Données de connexion et d'utilisation :</span> Elles sont conservées pour une durée ne dépassant pas 13 mois.</p>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">5. Sécurité des données</h2>
          <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre la destruction, la perte, l'altération, l'accès non autorisé ou la divulgation illégale. L'hébergement du site, géré de manière autonome sur une infrastructure sécurisée, participe à cette protection.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">6. Vos droits</h2>
          <p className="mb-3">Conformément à la réglementation applicable, vous disposez des droits suivants concernant vos données personnelles :</p>
          
          <ul className="list-disc ml-8 mb-4 space-y-1">
            <li><span className="font-medium">Droit d'accès :</span> obtenir une copie des données que nous détenons à votre sujet.</li>
            <li><span className="font-medium">Droit de rectification :</span> demander la correction d'informations inexactes.</li>
            <li><span className="font-medium">Droit d'opposition :</span> vous opposer au traitement de vos données pour des motifs légitimes.</li>
            <li><span className="font-medium">Droit à l'effacement ("droit à l'oubli") :</span> demander la suppression de vos données.</li>
            <li><span className="font-medium">Droit à la portabilité :</span> récupérer vos données dans un format structuré et lisible pour les transférer à un autre responsable de traitement.</li>
            <li><span className="font-medium">Droit à la limitation du traitement :</span> demander la suspension du traitement de vos données.</li>
          </ul>
          
          <p>Pour exercer ces droits, vous pouvez nous contacter par e-mail ou par courrier à l'adresse indiquée en section 1. Nous nous engageons à répondre à votre demande dans les meilleurs délais.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">7. Politique en matière de cookies</h2>
          <p className="mb-3">Les cookies sont de petits fichiers texte qui sont placés sur votre appareil lorsque vous visitez un site web. Nous pouvons utiliser des cookies pour :</p>
          
          <ul className="list-disc ml-8 mb-4 space-y-1">
            <li>Améliorer la navigation et l'expérience utilisateur.</li>
            <li>Mesurer l'audience et le trafic du site.</li>
          </ul>
          
          <p>Vous avez la possibilité de gérer les cookies directement depuis les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge...). Vous pouvez refuser l'enregistrement de cookies, les supprimer ou être alerté de leur présence.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">8. Contact</h2>
          <p>Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter à l'adresse e-mail ou postale mentionnée au début de ce document.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">9. Mise à jour de la politique de confidentialité</h2>
          <p className="mb-3">La présente politique de confidentialité est susceptible d'être modifiée ou complétée. Nous vous invitons à la consulter régulièrement.</p>
        </section>
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Dernière mise à jour : 04/08/2025</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
