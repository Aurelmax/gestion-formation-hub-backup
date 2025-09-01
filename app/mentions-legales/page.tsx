import Header from "@/components/Header";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GestionMax Formation Hub - Mentions Légales',
  description: 'Mentions légales et informations juridiques de GestionMax Formation Hub',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Mentions légales</h1>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Éditeur du site</h2>
          <p className="mb-3">Le présent site est édité par :</p>
          <div className="ml-4">
            <p className="mb-1">Aurélien Lavessière (L-A-V-E-R-Y-2-S-I-E-R-E)</p>
            <p className="mb-1">Entreprise individuelle – Nom commercial : Gestionmax</p>
            <p className="mb-1">SIRET : 483 797 213 00061</p>
            <p className="mb-1">Adresse : [à compléter avec votre adresse professionnelle]</p>
            <p className="mb-1">E-mail : [à compléter]</p>
            <p className="mb-1">Téléphone : [à compléter]</p>
          </div>
          <p className="mt-3 font-medium">Directeur de la publication : Aurélien Lavessière</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Hébergement du site</h2>
          <p className="mb-3">Le site est hébergé par l'éditeur lui-même, sur une instance Coolify déployée sur un serveur dédié fourni par Hetzner Online GmbH, société d'hébergement allemande.</p>
          <p className="mb-4">L'hébergement est géré et sécurisé de manière autonome, dans une logique de cloud souverain, garantissant la maîtrise totale des données et des infrastructures.</p>
          
          <h3 className="font-medium text-blue-700 mb-2">Fournisseur du serveur :</h3>
          <div className="ml-4 mb-4">
            <p className="mb-1">Hetzner Online GmbH</p>
            <p className="mb-1">Industriestr. 25</p>
            <p className="mb-1">91710 Gunzenhausen, Allemagne</p>
            <p className="mb-1">Site web : <a href="https://www.hetzner.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.hetzner.com</a></p>
          </div>
          
          <p className="font-medium">Plateforme de gestion d'infrastructure :</p>
          <p>Coolify (instance autogérée)</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Nom de domaine</h2>
          <p className="mb-3">Le nom de domaine est enregistré auprès du registrar :</p>
          <div className="ml-4">
            <p className="mb-1">LWS (Ligne Web Services)</p>
            <p className="mb-1">10 Rue Penthièvre, 75008 Paris, France</p>
            <p className="mb-1">Site web : <a href="https://www.lws.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.lws.fr</a></p>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Propriété intellectuelle</h2>
          <p className="mb-3">L'ensemble des éléments présents sur ce site (textes, images, graphismes, logo, structure, code source, etc.) sont la propriété exclusive de Gestionmax – Aurélien Lavessière, sauf mention contraire explicite.</p>
          <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Données personnelles</h2>
          <p className="mb-3">Le site peut collecter certaines données personnelles (formulaires, cookies, etc.) dans le cadre de son fonctionnement. Ces données sont traitées de manière confidentielle et ne sont en aucun cas cédées à des tiers.</p>
          <p>Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d'un droit d'accès, de rectification, d'opposition, de suppression ou de portabilité de vos données. Pour exercer vos droits, vous pouvez contacter l'éditeur via les coordonnées fournies ci-dessus.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Cookies</h2>
          <p>Le site peut utiliser des cookies afin d'améliorer l'expérience utilisateur et mesurer l'audience. Vous pouvez paramétrer votre navigateur pour refuser les cookies ou être alerté de leur présence.</p>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Droit applicable</h2>
          <p>Le présent site est régi par le droit français. En cas de litige, les juridictions françaises seront seules compétentes.</p>
        </section>
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Dernière mise à jour : 04/08/2025</p>
        </div>
      </main>
      
      {/* Footer est maintenant inclus dans le layout global */}
    </div>
  );
}
