import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

const Blog = () => {
  const articles = [
    {
      id: "1",
      titre: "10 erreurs à éviter lors de la création de votre site WordPress",
      extrait: "Découvrez les pièges les plus courants que font les débutants sur WordPress et comment les éviter pour créer un site professionnel dès le premier coup.",
      contenu: "WordPress est un outil puissant, mais certaines erreurs peuvent compromettre votre site...",
      auteur: "Marie Dubois",
      datePublication: "15 mai 2024",
      tempsLecture: "5 min",
      categorie: "Débutant",
      image: "/placeholder.svg"
    },
    {
      id: "2",
      titre: "Comment optimiser la vitesse de votre site WordPress",
      extrait: "La vitesse de chargement est cruciale pour l'expérience utilisateur et le référencement. Voici nos conseils d'experts pour accélérer votre site.",
      contenu: "Un site lent peut faire fuir vos visiteurs en quelques secondes...",
      auteur: "Pierre Martin",
      datePublication: "10 mai 2024",
      tempsLecture: "8 min",
      categorie: "Technique",
      image: "/placeholder.svg"
    },
    {
      id: "3",
      titre: "WooCommerce vs Shopify : quel choix pour votre e-commerce ?",
      extrait: "Comparaison détaillée entre WooCommerce et Shopify pour vous aider à choisir la meilleure solution e-commerce selon vos besoins.",
      contenu: "Le choix de la plateforme e-commerce est crucial pour le succès de votre boutique en ligne...",
      auteur: "Sophie Leroy",
      datePublication: "5 mai 2024",
      tempsLecture: "6 min",
      categorie: "E-commerce",
      image: "/placeholder.svg"
    },
    {
      id: "4",
      titre: "Les tendances WordPress 2024 à ne pas manquer",
      extrait: "Découvrez les dernières tendances en matière de design, fonctionnalités et développement WordPress pour rester à la pointe.",
      contenu: "L'écosystème WordPress évolue constamment avec de nouvelles tendances...",
      auteur: "Thomas Rousseau",
      datePublication: "1er mai 2024",
      tempsLecture: "7 min",
      categorie: "Tendances",
      image: "/placeholder.svg"
    },
    {
      id: "5",
      titre: "Sécuriser son site WordPress : guide complet 2024",
      extrait: "La sécurité WordPress est essentielle. Découvrez toutes les bonnes pratiques pour protéger efficacement votre site contre les cybermenaces.",
      contenu: "La sécurité de votre site WordPress ne doit jamais être négligée...",
      auteur: "Marie Dubois",
      datePublication: "25 avril 2024",
      tempsLecture: "10 min",
      categorie: "Sécurité",
      image: "/placeholder.svg"
    },
    {
      id: "6",
      titre: "Gutenberg vs Elementor : quel éditeur choisir ?",
      extrait: "Comparaison approfondie entre l'éditeur natif Gutenberg et le page builder Elementor pour créer vos pages WordPress.",
      contenu: "Le choix de l'éditeur de contenu impacte directement votre productivité...",
      auteur: "Pierre Martin",
      datePublication: "20 avril 2024",
      tempsLecture: "9 min",
      categorie: "Outils",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["Tous", "Débutant", "Technique", "E-commerce", "Tendances", "Sécurité", "Outils"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/formation-wordpress-antibes.webp"
            alt="Formation WordPress Antibes"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-blue-900/70"></div>
        </div>
        <div className="relative z-10 text-white py-12 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Blog WordPress
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Conseils, tutoriels et actualités pour maîtriser WordPress. 
              Restez à jour avec les dernières tendances et bonnes pratiques.
            </p>
          </div>
        </div>
      </section>

      {/* Notification de mise à jour */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-amber-800 mb-2">
            Blog en cours de mise à jour
          </h3>
          <p className="text-amber-700">
            Nous sommes en train d'améliorer notre blog pour vous offrir un contenu de meilleure qualité. Merci de votre patience.
          </p>
        </div>
      </section>
      
      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((categorie) => (
              <Button
                key={categorie}
                variant={categorie === "Tous" ? "default" : "outline"}
                size="sm"
              >
                {categorie}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="mb-2">{article.categorie}</Badge>
                  </div>
                  <CardTitle className="text-lg text-blue-900 line-clamp-2 mb-2">
                    {article.titre}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {article.extrait}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{article.auteur}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.datePublication}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.tempsLecture}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Lire l'article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Restez informé
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Recevez nos derniers articles et conseils WordPress directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button size="lg">
              S'abonner
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blog;
