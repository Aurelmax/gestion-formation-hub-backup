"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SecureForm from '@/components/ui/SecureForm';
import { useToast } from "@/hooks/use-toast";

interface ContactFormData {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  type: 'question' | 'reclamation' | 'suggestion';
  message: string;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
}

interface ContactFormSecureProps {
  onSuccess?: (data: ContactFormData) => void;
  className?: string;
}

/**
 * Formulaire de contact sécurisé avec toutes les protections
 */
export function ContactFormSecure({ onSuccess, className = "" }: ContactFormSecureProps) {
  const { toast } = useToast();

  const handleSuccess = (data: ContactFormData) => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
    });

    if (onSuccess) {
      onSuccess(data);
    }
  };

  const handleError = (error: string) => {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contactez-nous</h2>
        <p className="text-gray-600">
          Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
        </p>
      </div>

      <SecureForm
        endpoint="/api/reclamations"
        onSuccess={handleSuccess}
        onError={handleError}
        submitButtonText="Envoyer le message"
        loadingText="Envoi sécurisé en cours..."
        rateLimitInfo={{
          maxAttempts: 5,
          windowMinutes: 60
        }}
        className="space-y-6"
      >
        {/* Nom complet */}
        <div className="space-y-2">
          <Label htmlFor="nom">Nom complet *</Label>
          <Input
            id="nom"
            name="nom"
            type="text"
            placeholder="Votre nom complet"
            required
            maxLength={100}
            className="w-full"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            required
            maxLength={255}
            className="w-full"
          />
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            placeholder="06 46 02 24 68"
            maxLength={20}
            className="w-full"
          />
        </div>

        {/* Type de demande */}
        <div className="space-y-2">
          <Label htmlFor="type">Type de demande *</Label>
          <select
            id="type"
            name="type"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sélectionnez un type</option>
            <option value="question">Question générale</option>
            <option value="reclamation">Réclamation</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </div>

        {/* Priorité (conditionnel pour réclamations) */}
        <div className="space-y-2">
          <Label htmlFor="priorite">Priorité</Label>
          <select
            id="priorite"
            name="priorite"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="normale">Normale</option>
            <option value="basse">Basse</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* Sujet */}
        <div className="space-y-2">
          <Label htmlFor="sujet">Sujet *</Label>
          <Input
            id="sujet"
            name="sujet"
            type="text"
            placeholder="Sujet de votre message"
            required
            maxLength={200}
            className="w-full"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Décrivez votre demande en détail..."
            required
            maxLength={2000}
            rows={6}
            className="w-full resize-none"
          />
          <div className="text-xs text-gray-500 text-right">
            Maximum 2000 caractères
          </div>
        </div>

        {/* Informations de confidentialité */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            🔒 Confidentialité et Sécurité
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Vos données sont protégées et ne seront jamais partagées</p>
            <p>• Formulaire sécurisé avec protection anti-spam</p>
            <p>• Réponse sous 48h ouvrées maximum</p>
            <p>• Pour les réclamations, traitement sous 10 jours ouvrés</p>
          </div>
        </div>

        {/* Note sur la protection */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p>
            <strong>Protection anti-spam :</strong> Ce formulaire est protégé contre le spam.
            Maximum 5 messages par heure. En cas de contenu suspect détecté, votre message
            sera automatiquement bloqué.
          </p>
        </div>
      </SecureForm>
    </div>
  );
}

export default ContactFormSecure;