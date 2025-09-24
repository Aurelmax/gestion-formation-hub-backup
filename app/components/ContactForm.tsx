import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  nom: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  formation_titre: z.string().optional(),
  message: z.string().min(10, { message: "Votre message doit comporter au moins 10 caractères" }),
  rgpd: z.boolean()
    .refine((val) => val === true, {
      message: "Vous devez accepter la politique de confidentialité",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  formationTitre?: string;
}

const ContactForm = ({ 
  formationTitre = "",
  onSuccess = () => {},
  onError = () => {}
}: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      entreprise: "",
      formation_titre: formationTitre,
      message: formationTitre 
        ? `Je souhaite obtenir des informations sur la formation "${formationTitre}".` 
        : "",
      rgpd: false,
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/rendezvous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'demande_contact',
          status: 'nouveau',
          prenom: data.prenom,
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          entreprise: data.entreprise,
          formation_titre: data.formation_titre,
          commentaires: data.message,
          dateContact: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du formulaire');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erreur:', error);
      onError(error instanceof Error ? error : new Error('Une erreur est survenue'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="votre@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Votre numéro de téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="entreprise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise (facultatif)</FormLabel>
              <FormControl>
                <Input placeholder="Votre entreprise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formationTitre && (
          <FormField
            control={form.control}
            name="formation_titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formation concernée</FormLabel>
                <FormControl>
                  <Input disabled value={formationTitre} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Votre message, questions ou besoins spécifiques" 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rgpd"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  J'accepte la politique de confidentialité et le traitement de mes données personnelles *
                </FormLabel>
                <p className="text-sm text-gray-500">
                  En soumettant ce formulaire, j'accepte que mes données personnelles soient utilisées pour me recontacter. 
                  Voir notre {" "}
                  <a href="/politique-confidentialite" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    politique de confidentialité
                  </a>.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma demande"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
