"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useReclamations } from "@/hooks/useReclamations";
import Header from "@/components/Header";
import MapLocation from "@/components/MapLocation";
import { Mail, Phone, MapPin, FileText, Shield, Scale } from "lucide-react";

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  sujet: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  type: z.enum(["question", "reclamation", "suggestion"]),
  message: z.string().min(20, "Le message doit contenir au moins 20 caractères"),
  priorite: z.enum(["basse", "normale", "haute", "urgente"]).optional(),
});

const ContactPage = () => {
  const { toast } = useToast();
  const { createReclamation } = useReclamations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      sujet: "",
      type: "question",
      message: "",
      priorite: "normale",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (values.type === "reclamation") {
        // Traitement spécial pour les réclamations
        const success = await createReclamation({
          nom: values.nom,
          email: values.email,
          telephone: values.telephone,
          sujet: values.sujet,
          message: values.message,
          priorite: values.priorite as any,
        });
        
        if (success) {
          form.reset();
        }
      } else {
        // Simulation d'envoi pour les autres types
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Formulaire soumis:", values);
        
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        });
        
        form.reset();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeValue = form.watch("type");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600">
            Une question ? Une réclamation ? Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
                <CardDescription>
                  N'hésitez pas à nous contacter par les moyens suivants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">aurelien@gestionmax.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-600">06 46 02 24 68</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">
                      300 chemin de la suquette<br />
                      06600 Antibes , France
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heures d'ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 12h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet *</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom complet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          <Input placeholder="06 46 02 24 68" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de demande *</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="question">Question générale</option>
                            <option value="reclamation">Réclamation</option>
                            <option value="suggestion">Suggestion</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {typeValue === "reclamation" && (
                    <FormField
                      control={form.control}
                      name="priorite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priorité *</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="basse">Basse</option>
                              <option value="normale">Normale</option>
                              <option value="haute">Haute</option>
                              <option value="urgente">Urgente</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="sujet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet *</FormLabel>
                        <FormControl>
                          <Input placeholder="Sujet de votre message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre demande en détail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Carte Leaflet pour le SEO local */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Nous situer à Antibes
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              GestionMax Formation - Formations WordPress Professionnelles à Antibes
            </p>
            <MapLocation 
              latitude={43.5853}
              longitude={7.1232}
              zoom={14}
              popupText="GestionMax Formation - Formations WordPress professionnelles à Antibes"
              height="450px"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mentions légales et conformité Qualiopi
            </h2>
            <p className="text-lg text-gray-600">
              Informations obligatoires et conditions de nos formations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Contrat de formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Une convention ou un contrat de formation professionnelle est établi entre l'organisme et le bénéficiaire avant l'entrée en formation.
                </p>
                <p>
                  Ce document précise les objectifs, les modalités, le programme, les délais, les conditions financières, ainsi que les droits de rétractation.
                </p>
                <p>
                  <strong>Délai d'accès :</strong> Formation accessible à réception de l'accord de financement.
                </p>
                <p>
                  <strong>Personnalisation :</strong> Un entretien de positionnement est réalisé en amont de la formation pour adapter les contenus et objectifs au profil et aux attentes du stagiaire.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-orange-600" />
                  Procédure de réclamation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  En cas d'insatisfaction, une procédure de réclamation est mise à disposition de l'apprenant via le formulaire de contact ci-dessus en sélectionnant "Réclamation".
                </p>
                <p>
                  <strong>Délai de traitement :</strong> Les réclamations sont étudiées dans un délai de 10 jours ouvrés maximum.
                </p>
                <p>
                  <strong>Suivi :</strong> Un retour personnalisé est apporté à chaque stagiaire concernant sa réclamation.
                </p>
                <p>
                  <strong>Contact direct :</strong> reclamation@gestionmax-formation.fr
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Protection des données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Les données personnelles recueillies dans le cadre de cette formation sont traitées conformément au RGPD.
                </p>
                <p>
                  <strong>Utilisation :</strong> Elles sont utilisées uniquement à des fins pédagogiques, administratives ou réglementaires.
                </p>
                <p>
                  <strong>Droits :</strong> Chaque apprenant dispose d'un droit d'accès, de rectification ou de suppression.
                </p>
                <p>
                  <strong>Contact DPO :</strong> dpo@gestionmax-formation.fr
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer est maintenant inclus dans le layout global */}
    </div>
  );
};

export default ContactPage;
