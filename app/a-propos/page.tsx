"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, Users, BookOpen, Clock, Mail, Phone, FileDown, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";

const AProposPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/formation-wordpress-antibes.webp" 
            alt="Formation WordPress Antibes" 
            className="object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-blue-900/70"></div>
        </div>
        <div className="relative z-10 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              À propos de GestionMax Formateur
            </h2>
            <p className="text-xl leading-relaxed">
              Formateur indépendant certifié Qualiopi avec plus de 8 ans d'expérience 
              dans l'enseignement WordPress. Passionné par la transmission de connaissances 
              et l'accompagnement personnalisé de chaque apprenant.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Formateur Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Votre formateur expert
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Formateur indépendant certifié Qualiopi avec plus de 8 ans d'expérience 
                dans l'enseignement WordPress. Passionné par la transmission de connaissances 
                et l'accompagnement personnalisé de chaque apprenant.
              </p>
              
              <div className="mb-8">
                <Button variant="default" size="lg" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => window.open('/documents/cv-formateur-gestionmax.pdf', '_blank')}>
                  <FileDown className="h-5 w-5" />
                  Télécharger le CV du formateur
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Conformément aux exigences Qualiopi, notre CV est disponible pour consultation
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Certification Qualiopi (7 indicateurs)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Référencement Datadock</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Formations éligibles CPF</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Suivi personnalisé post-formation</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Formations</h4>
                  <p className="text-3xl font-bold text-blue-600">120+</p>
                  <p className="text-sm text-gray-600">Sessions réalisées</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Apprenants</h4>
                  <p className="text-3xl font-bold text-green-600">500+</p>
                  <p className="text-sm text-gray-600">Personnes formées</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Satisfaction</h4>
                  <p className="text-3xl font-bold text-yellow-600">98%</p>
                  <p className="text-sm text-gray-600">Taux satisfaction</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Expérience</h4>
                  <p className="text-3xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-gray-600">Années d'expertise</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl p-8 mb-16 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Certifications et agréments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Qualiopi</h4>
                <p className="text-gray-600">Certification qualité des organismes de formation</p>
                <Badge variant="secondary" className="mt-2">N° 2024-QUAL-1234</Badge>
              </div>
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">CPF</h4>
                <p className="text-gray-600">Formations éligibles au Compte Personnel de Formation</p>
                <Badge variant="secondary" className="mt-2">Toutes nos formations</Badge>
              </div>
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Datadock</h4>
                <p className="text-gray-600">Référencement qualité des organismes de formation</p>
                <Badge variant="secondary" className="mt-2">Référencé depuis 2020</Badge>
              </div>
            </div>
          </div>

          {/* Méthode pédagogique */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notre méthode pédagogique</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Approche pratique avec cas d'usage réels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Groupes restreints pour un suivi personnalisé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Support de cours détaillé fourni</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Évaluations continues et certificat de réussite</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Support technique 3 mois post-formation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informations légales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">Raison sociale :</span> GestionMax</p>
                  <p><span className="font-semibold">Statut juridique :</span> Entreprise individuelle</p>
                  <p><span className="font-semibold">SIRET :</span> 483 797 213 00061</p>
                  <p><span className="font-semibold">N° déclaration d'activité :</span> 11 75 12345 75</p>
                  <p><span className="font-semibold">Certification Qualiopi :</span> QUA230C60046 </p>
                  <p className="text-xs text-gray-500 mt-4">
                    Cet enregistrement ne vaut pas agrément de l'État (Article L.6352-12 du Code du travail)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Une question ? Parlons de votre projet !
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Chaque projet est unique. Contactez-moi pour discuter de vos besoins 
              et créer une formation adaptée à vos objectifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                aurelien@gestionmax.fr
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                06 46 02 24 68
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer est maintenant inclus dans le layout global */}
    </div>
  );
};

export default AProposPage;
