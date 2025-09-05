"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WordPressFAQ = () => {
  const faqs = [
    {
      question: "Qui peut suivre une formation WordPress ?",
      answer: "Nos formations WordPress sont accessibles à tous, que vous soyez débutant ou que vous ayez déjà des notions. Nous adaptons le contenu en fonction de votre niveau initial et de vos objectifs professionnels."
    },
    {
      question: "Faut-il avoir des connaissances techniques pour apprendre WordPress ?",
      answer: "Non, aucun prérequis technique n'est nécessaire pour nos formations WordPress débutant. Nous commençons par les bases et progressons à votre rythme. Pour les formations avancées, une connaissance de base de WordPress est recommandée."
    },
    {
      question: "Combien de temps faut-il pour maîtriser WordPress ?",
      answer: "La durée d'apprentissage dépend de vos objectifs. Notre formation débutant de 14h vous permet d'acquérir les bases pour créer et gérer un site simple. Pour une maîtrise plus approfondie, nos formations avancées de 21h vous permettent d'explorer les fonctionnalités plus complexes."
    },
    {
      question: "Les formations sont-elles éligibles au CPF ou à d'autres financements ?",
      answer: "Oui, nos formations WordPress sont éligibles à plusieurs dispositifs de financement, dont le CPF, le plan de développement des compétences et les financements Pôle Emploi. Notre équipe vous accompagne dans les démarches administratives."
    },
    {
      question: "Qu'est-ce qui différencie vos formations WordPress des autres ?",
      answer: "Notre approche pratique et personnalisée. Nous limitons nos groupes à 6 personnes maximum pour garantir un suivi individualisé. Nos formateurs sont des professionnels certifiés qui utilisent WordPress quotidiennement, et nous offrons un suivi post-formation de 3 mois."
    },
    {
      question: "Vais-je créer mon propre site pendant la formation ?",
      answer: "Absolument ! Nos formations sont basées sur la pratique. Vous travaillerez sur un projet concret qui correspond à vos besoins professionnels, et à la fin de la formation, vous repartirez avec un site WordPress fonctionnel que vous aurez créé."
    },
    {
      question: "Proposez-vous un support après la formation ?",
      answer: "Oui, nous offrons un suivi post-formation de 3 mois, incluant une assistance par email pour répondre à vos questions. Nous proposons également des modules complémentaires pour approfondir des aspects spécifiques de WordPress."
    }
  ];

  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900">
            Questions fréquentes sur nos formations WordPress
          </h2>
          <div className="flex justify-center mt-3 mb-6">
            <div className="h-1 w-24 bg-blue-600 rounded"></div>
          </div>
          <p className="text-lg text-blue-700 max-w-3xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes sur nos formations WordPress
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white mb-2 rounded-lg border border-blue-200">
                <AccordionTrigger className="text-left text-lg font-medium text-blue-800 px-4 py-2">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-blue-700 px-4 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default WordPressFAQ;
