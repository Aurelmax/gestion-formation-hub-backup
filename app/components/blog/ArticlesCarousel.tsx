"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Article {
  id: string;
  titre: string;
  extrait: string;
  auteur: string;
  datePublication: string;
  tempsLecture: string;
  categorie: string;
}

const ArticlesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Articles récents - 6 derniers articles du blog
  const articlesRecents: Article[] = [
    {
      id: "1",
      titre: "10 erreurs à éviter lors de la création de votre site WordPress",
      extrait: "Découvrez les pièges les plus courants que font les débutants sur WordPress et comment les éviter.",
      auteur: "Marie Dubois",
      datePublication: "15 mai 2024",
      tempsLecture: "5 min",
      categorie: "Débutant",
    },
    {
      id: "2",
      titre: "Comment optimiser la vitesse de votre site WordPress",
      extrait: "La vitesse de chargement est cruciale pour l'expérience utilisateur et le référencement.",
      auteur: "Pierre Martin",
      datePublication: "10 mai 2024",
      tempsLecture: "8 min",
      categorie: "Technique",
    },
    {
      id: "3",
      titre: "WooCommerce vs Shopify : quel choix pour votre e-commerce ?",
      extrait: "Comparaison détaillée entre WooCommerce et Shopify pour votre boutique en ligne.",
      auteur: "Sophie Leroy",
      datePublication: "5 mai 2024",
      tempsLecture: "6 min",
      categorie: "E-commerce",
    },
    {
      id: "4",
      titre: "Les tendances WordPress 2024 à ne pas manquer",
      extrait: "Découvrez les dernières tendances en matière de design et fonctionnalités WordPress.",
      auteur: "Thomas Rousseau",
      datePublication: "1er mai 2024",
      tempsLecture: "7 min",
      categorie: "Tendances",
    },
    {
      id: "5",
      titre: "Sécuriser son site WordPress : guide complet 2024",
      extrait: "La sécurité WordPress est essentielle. Toutes les bonnes pratiques pour protéger votre site.",
      auteur: "Marie Dubois",
      datePublication: "25 avril 2024",
      tempsLecture: "10 min",
      categorie: "Sécurité",
    },
    {
      id: "6",
      titre: "Gutenberg vs Elementor : quel éditeur choisir ?",
      extrait: "Comparaison approfondie entre l'éditeur natif Gutenberg et le page builder Elementor.",
      auteur: "Pierre Martin",
      datePublication: "20 avril 2024",
      tempsLecture: "9 min",
      categorie: "Outils",
    }
  ];

  const articlesPerView = 3;
  const maxIndex = Math.max(0, articlesRecents.length - articlesPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleArticles = articlesRecents.slice(currentIndex, currentIndex + articlesPerView);

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Articles Récents
            </h2>
            <p className="text-lg text-gray-600">
              Conseils et astuces WordPress par nos experts
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="h-10 w-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="h-10 w-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Articles carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / articlesPerView)}%)` }}
          >
            {articlesRecents.map((article) => (
              <div key={article.id} className="flex-shrink-0 w-full md:w-1/3">
                <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                  {/* Image placeholder avec gradient */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {article.categorie}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg text-blue-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {article.titre}
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {article.extrait}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{article.auteur}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.tempsLecture}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{article.datePublication}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="group/button">
                        Lire
                        <ArrowRight className="h-3 w-3 ml-1 group-hover/button:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Call to action */}
        <div className="text-center mt-8">
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Voir tous les articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesCarousel;