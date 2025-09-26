import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useProgrammesFormation } from '@/hooks/useProgrammesFormation';
import { ProgrammeFormation } from '@/types/programmes';

// Définition du schéma de validation
const formSchema = z.object({
  code: z.string().min(3, 'Le code doit contenir au moins 3 caractères'),
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  type: z.enum(['catalogue', 'personnalise']),
  typeProgramme: z.string().optional(),
  version: z.coerce.number().default(1),
  estActif: z.boolean().default(true),
  estVisible: z.boolean().default(false),
  categorieId: z.string().optional().nullable(),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  duree: z.string().min(1, 'La durée est requise'),
  prix: z.coerce.number().min(0, 'Le prix doit être positif'),
  niveau: z.string().optional(),
  participants: z.string().optional(),
  publicConcerne: z.string().optional(),
  prerequis: z.string().optional(),
  objectifsPedagogiques: z.string().optional(),
  objectifsSpecifiques: z.string().optional(),
  programme: z.string().min(10, 'Le contenu du programme est requis'),
  modalites: z.string().optional(),
  moyensPedagogiques: z.string().optional(),
  modalitesEvaluation: z.string().optional(),
  accessibiliteHandicap: z.string().optional(),
  sanctionFormation: z.string().optional(),
  delaiAcceptation: z.string().optional(),
  pictogramme: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface ProgrammeFormEnhancedProps {
  programme?: ProgrammeFormation | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ProgrammeFormEnhanced({ programme, onSubmit, onCancel }: ProgrammeFormEnhancedProps) {
  const [activeTab, setActiveTab] = useState('infos');
  const { categories } = useProgrammesFormation();

  // Initialisation du formulaire avec les valeurs par défaut ou les valeurs du programme existant
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: programme?.code || '',
      titre: programme?.titre || '',
      type: programme?.type as 'catalogue' | 'personnalise' || 'catalogue',
      typeProgramme: programme?.typeProgramme || '',
      version: programme?.version ? Number(programme.version) : 1,
      estActif: programme?.estActif ?? true,
      // estVisible n'existe pas dans le type ProgrammeFormation
      categorieId: programme?.categorieId || null,
      description: programme?.description || '',
      duree: programme?.duree || '',
      prix: programme?.prix ? parseFloat(programme.prix.toString()) : 0,
      niveau: programme?.niveau || '',
      participants: programme?.participants || '',
      publicConcerne: programme?.publicConcerne || '',
      prerequis: programme?.prerequis || '',
      objectifsPedagogiques: Array.isArray(programme?.objectifs) ? programme?.objectifs.join('\n') : '',
      objectifsSpecifiques: programme?.objectifsSpecifiques || '',
      programme: programme?.programme || '',
      modalites: programme?.modalites || '',
      moyensPedagogiques: programme?.ressourcesDisposition || '',
      modalitesEvaluation: programme?.modalitesEvaluation || '',
      accessibiliteHandicap: programme?.accessibiliteHandicap || '',
      sanctionFormation: programme?.sanctionFormation || '',
      delaiAcceptation: programme?.delaiAcceptation || '',
      pictogramme: programme?.pictogramme || '📚',
    },
  });

  const handleSubmit = (data: FormSchema) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h2 className="text-2xl font-bold">
              {programme ? 'Modifier le programme' : 'Nouveau programme'}
            </h2>
          </div>
          <Button type="submit" className="ml-auto">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Informations de base du programme de formation
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code du programme*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: A001-WP-SEO" {...field} />
                  </FormControl>
                  <FormDescription>
                    Format recommandé: A[numéro]-[technologie1]-[technologie2]
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre*</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du programme" {...field} />
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
                  <FormLabel>Type de programme*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="catalogue">Catalogue</SelectItem>
                      <SelectItem value="personnalise">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Les programmes catalogue sont visibles publiquement, les programmes personnalisés sont adaptés aux besoins spécifiques
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categorieId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="_null">Aucune catégorie</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.titre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Catégorie pour regrouper les programmes dans le catalogue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pictogramme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pictogramme</FormLabel>
                  <FormControl>
                    <Input placeholder="Emoji ou caractère spécial" {...field} />
                  </FormControl>
                  <FormDescription>
                    Emoji représentatif pour l'affichage visuel (ex: 📚, 🖥️, 📱)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="infos">Informations</TabsTrigger>
            <TabsTrigger value="programme">Programme</TabsTrigger>
            <TabsTrigger value="modalites">Modalités</TabsTrigger>
            <TabsTrigger value="reglementaire">Réglementaire</TabsTrigger>
            <TabsTrigger value="visibilite">Visibilité</TabsTrigger>
          </TabsList>

          <TabsContent value="infos" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails du programme</CardTitle>
                <CardDescription>
                  Informations détaillées sur le programme de formation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description détaillée du programme"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="duree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 21 heures (3 jours)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (€)*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="niveau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Débutant, Intermédiaire, Avancé" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="participants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Participants</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1 à 3 personnes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Public et prérequis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="publicConcerne"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public concerné</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Artisans, commerçants et TPE souhaitant..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prerequis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prérequis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Connaissances de base en informatique..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programme" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs et programme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="objectifsPedagogiques"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectifs pédagogiques</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Objectifs généraux de la formation"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objectifsSpecifiques"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectifs spécifiques</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Objectifs spécifiques et mesurables"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu du programme*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Détail complet du programme de formation"
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Format recommandé : utilisez des titres et sous-titres avec des puces pour structurer le contenu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modalites" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modalités et moyens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="modalites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalités d'organisation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Formation en présentiel, distanciel..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="moyensPedagogiques"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moyens pédagogiques</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Supports de cours, exercices pratiques..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modalitesEvaluation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalités d'évaluation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: QCM, mises en situation, évaluation continue..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reglementaire" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations réglementaires</CardTitle>
                <CardDescription>
                  Informations requises pour la conformité Qualiopi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sanctionFormation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sanction de la formation</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Attestation de formation, certification..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delaiAcceptation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai d'acceptation</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 15 jours avant le début de la formation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accessibiliteHandicap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibilité handicap</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visibilite" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de visibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="estActif"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Programme actif</FormLabel>
                        <FormDescription>
                          Le programme est disponible dans le système
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Programme visible</FormLabel>
                        <FormDescription>
                          Le programme est visible dans le catalogue public
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="typeProgramme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type spécifique du programme</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type spécifique" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="_null">Non spécifié</SelectItem>
                          <SelectItem value="wordpress">WordPress</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="marketing">Marketing digital</SelectItem>
                          <SelectItem value="seo">SEO</SelectItem>
                          <SelectItem value="design">Web design</SelectItem>
                          <SelectItem value="developpement">Développement web</SelectItem>
                          <SelectItem value="reseaux-sociaux">Réseaux sociaux</SelectItem>
                          <SelectItem value="analytique">Analytique web</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Utilisé pour le filtrage et le classement des programmes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {programme ? 'Mettre à jour' : 'Créer le programme'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
