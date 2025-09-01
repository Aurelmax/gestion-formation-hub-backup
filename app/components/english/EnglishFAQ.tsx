import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EnglishFAQ = () => {
  const faqs = [
    {
      question: "Quel niveau d'anglais est nécessaire pour commencer une formation ?",
      answer: "Nos formations s'adaptent à tous les niveaux, du débutant (A1) au confirmé (C1). Un test de positionnement initial nous permet de vous orienter vers la formation la plus adaptée à votre niveau actuel et à vos objectifs."
    },
    {
      question: "Les cours sont-ils dispensés uniquement en anglais ?",
      answer: "Nos formateurs adaptent la langue d'enseignement selon votre niveau. Pour les débutants, les explications sont données en français avec une immersion progressive en anglais. Pour les niveaux intermédiaires et avancés, les cours sont principalement en anglais."
    },
    {
      question: "Combien de temps faut-il pour progresser d'un niveau en anglais ?",
      answer: "En moyenne, 60 à 80 heures de formation sont nécessaires pour progresser d'un niveau sur l'échelle européenne (par exemple, passer de A2 à B1). Ce temps peut varier selon votre implication personnelle, votre pratique en dehors des cours et votre facilité d'apprentissage."
    },
    {
      question: "Les formations sont-elles adaptées aux besoins professionnels spécifiques ?",
      answer: "Absolument ! Nos formations d'anglais professionnel sont personnalisables selon votre secteur d'activité. Nous intégrons du vocabulaire spécifique et des mises en situation professionnelles adaptées à votre métier."
    },
    {
      question: "Comment se déroulent les certifications en fin de formation ?",
      answer: "Toutes nos formations peuvent être validées par des certifications reconnues (TOEIC, LINGUASKILL, BRIGHT). L'examen se déroule dans notre centre ou à distance selon votre préférence. Nous vous préparons spécifiquement au format de l'examen choisi."
    },
    {
      question: "Proposez-vous des formules intensives ou des cours du soir ?",
      answer: "Oui, nous proposons différents formats : sessions intensives sur quelques jours, cours hebdomadaires, cours du soir ou du week-end. Notre objectif est de nous adapter à vos contraintes professionnelles et personnelles."
    }
  ];

  return (
    <section className="py-12 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-900">
            Questions fréquentes sur nos formations d'anglais
          </h2>
          <div className="flex justify-center mt-3 mb-6">
            <div className="h-1 w-24 bg-indigo-600 rounded"></div>
          </div>
          <p className="text-lg text-indigo-700 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur nos formations d'anglais professionnel
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white mb-2 rounded-lg">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-800 px-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 px-4 pb-4">
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

export default EnglishFAQ;
