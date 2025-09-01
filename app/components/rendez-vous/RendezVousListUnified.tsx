import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, CheckCircle, Calendar, FileText, BookOpen, X, Check, Video, Clock, AlertCircle, BarChart4, FileBarChart, Star, Award, LineChart, FileEdit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useRendezvous, Rendezvous, RendezvousFormData, ImpactEvaluationData } from "@/hooks/useRendezvous";
import WorkflowPositionnement from "./WorkflowPositionnement";

// Import des composants de formulaire
import RendezvousFormUnified from "@/components/rendez-vous/RendezvousFormUnified";
import ImpactEvaluationForm from "@/components/rendez-vous/ImpactEvaluationForm";
import CompteRenduAvanceModal from "@/components/rendez-vous/CompteRenduAvanceModal";
import { format, addMonths } from "date-fns";
import { fr } from "date-fns/locale";


const RendezVousListUnified = () => {
  const [showForm, setShowForm] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [selectedRendezvous, setSelectedRendezvous] = useState<Rendezvous | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [rdvToEdit, setRdvToEdit] = useState<Rendezvous | null>(null);
  
  // États pour la gestion des rendez-vous d'impact
  const [showImpactForm, setShowImpactForm] = useState(false);
  const [rdvImpact, setRdvImpact] = useState<Rendezvous | null>(null);
  const [activeTab, setActiveTab] = useState("tous");
  
  // États pour la modale de reprogrammation rapide
  const [showRescheduler, setShowRescheduler] = useState(false);
  const [rdvToReschedule, setRdvToReschedule] = useState<Rendezvous | null>(null);
  const [newDateRdv, setNewDateRdv] = useState<string>("");
  const [newFormatRdv, setNewFormatRdv] = useState<string>("visio");
  
  // États pour la génération de rapports
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportUrl, setReportUrl] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);
  
  // États pour le compte rendu
  const [showCompteRenduModal, setShowCompteRenduModal] = useState(false);
  const [rdvCompteRendu, setRdvCompteRendu] = useState<Rendezvous | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  // Utiliser notre hook unifié avec les nouvelles fonctions d'impact
  const { 
    rendezvous, 
    loading, 
    error, 
    fetchRendezvous,
    createRendezvous,
    updateRendezvous,
    updateRendezvousStatut,
    validerRendezvous,
    // Fonctions pour les rendez-vous d'impact
    planifierImpact,
    completerEvaluationImpact,
    terminerImpact,
    genererRapportImpact
  } = useRendezvous();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmitRdv = async (formData: RendezvousFormData) => {
    try {
      if (editMode && rdvToEdit) {
        await updateRendezvous(rdvToEdit.id, formData);
        toast({
          title: "Succès",
          description: "Le rendez-vous a été mis à jour.",
        });
      } else {
        await createRendezvous(formData);
        toast({
          title: "Succès",
          description: "Le rendez-vous a été créé.",
        });
      }
      
      setShowForm(false);
      setEditMode(false);
      setRdvToEdit(null);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour éditer un rendez-vous existant
  const handleEditRdv = (rdv: Rendezvous) => {
    setRdvToEdit(rdv);
    setEditMode(true);
    setShowForm(true);
  };

  // Fonction pour démarrer le workflow de positionnement
  const startWorkflow = (rdv: Rendezvous) => {
    setSelectedRendezvous(rdv);
    setShowWorkflow(true);
  };

  // Fonction pour éditer le compte rendu d'un rendez-vous
  const handleOpenCompteRendu = (rdv: Rendezvous) => {
    setRdvCompteRendu(rdv);
    setShowCompteRenduModal(true);
  };

  // Fonction pour rafraîchir la liste après l'édition d'un compte rendu
  const handleCompteRenduSuccess = () => {
    fetchRendezvous(activeTab === "tous" ? undefined : activeTab);
  };

  // Fonction pour créer une formation à partir d'un rendez-vous
  const creerFormation = (rdv: Rendezvous) => {
    // Stocker les données temporairement dans localStorage pour les récupérer sur la page de création
    if (typeof window !== 'undefined') {
      localStorage.setItem('formation_data', JSON.stringify({
        apprenantNom: `${rdv.prenomBeneficiaire} ${rdv.nomBeneficiaire}`,
        apprenantEmail: rdv.emailBeneficiaire,
        formationTitre: rdv.formationSelectionnee,
        rdvId: rdv.id
      }));
    }
    // Rediriger vers la création de formation
    router.push('/dashboard/formations/create');
  };

  // Fonction pour planifier un rendez-vous d'impact
  const handlePlanifierImpact = async (rdv: Rendezvous) => {
    try {
      // Date d'impact par défaut: 6 mois après la date du rendez-vous initial
      const dateRdv = rdv.dateRdv ? new Date(rdv.dateRdv) : new Date();
      const dateImpact = format(addMonths(dateRdv, 6), 'yyyy-MM-dd');
      
      const result = await planifierImpact(rdv.id, dateImpact);
      
      toast({
        title: "Rendez-vous d'impact planifié",
        description: `Un rendez-vous d'impact a été planifié pour le ${format(new Date(dateImpact), 'dd MMMM yyyy', { locale: fr })}.`,
      });
      
      await fetchRendezvous();
    } catch (error) {
      console.error('Erreur lors de la planification du rendez-vous d\'impact:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la planification du rendez-vous d'impact.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour ouvrir le formulaire d'évaluation d'impact
  const handleOpenImpactEvaluation = (rdv: Rendezvous) => {
    setRdvImpact(rdv);
    setShowImpactForm(true);
  };
  
  // Fonction pour soumettre l'évaluation d'impact
  const handleSubmitImpactEvaluation = async (data: ImpactEvaluationData) => {
    if (!rdvImpact) return;
    
    try {
      await completerEvaluationImpact(rdvImpact.id, data);
      toast({
        title: "Évaluation d'impact enregistrée",
        description: "L'évaluation d'impact a été enregistrée avec succès.",
      });
      
      setShowImpactForm(false);
      setRdvImpact(null);
      await fetchRendezvous();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'évaluation d\'impact:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'évaluation d'impact.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour terminer un rendez-vous d'impact
  const handleTerminerImpact = async (rdv: Rendezvous) => {
    try {
      await terminerImpact(rdv.id);
      toast({
        title: "Rendez-vous d'impact terminé",
        description: "Le rendez-vous d'impact a été marqué comme terminé.",
      });
      
      await fetchRendezvous();
    } catch (error) {
      console.error('Erreur lors de la clôture du rendez-vous d\'impact:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la clôture du rendez-vous d'impact.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour générer un rapport d'impact
  const handleGenererRapport = async (rdv: Rendezvous) => {
    try {
      setLoadingReport(true);
      const result = await genererRapportImpact(rdv.id);
      setReportUrl(result.rapportUrl);
      setShowReportModal(true);
      setLoadingReport(false);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport d\'impact:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du rapport d'impact.",
        variant: "destructive",
      });
      setLoadingReport(false);
    }
  };
  
  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status: string, type?: string) => {
    if (type === 'impact') {
      return <Badge variant="secondary" className="bg-purple-500 hover:bg-purple-700">Impact</Badge>;
    }
    
    switch (status) {
      case 'nouveau':
        return <Badge variant="outline">Nouveau</Badge>;
      case 'rdv_planifie':
        return <Badge variant="secondary">Rendez-vous planifié</Badge>;
      case 'termine':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Terminé</Badge>;
      case 'annule':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // États de chargement pour les actions
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  // Fonction pour reprogrammer rapidement un rendez-vous
  const handleFastReschedule = async () => {
    if (!rdvToReschedule) return;
    
    try {
      if (!newDateRdv) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une date et une heure",
          variant: "destructive",
        });
        return;
      }
      
      // Indiquer le chargement
      setLoadingActions(prev => ({ ...prev, [`reschedule-${rdvToReschedule.id}`]: true }));
      
      // Mise à jour du rendez-vous avec la nouvelle date et le format
      await updateRendezvous(rdvToReschedule.id, {
        dateRdv: newDateRdv,
        canal: newFormatRdv, // Format du RDV (visio, presentiel, etc.)
        statut: "planifie", // Assurer que le statut est bien planifié
      });
      
      toast({
        title: "Succès",
        description: `Rendez-vous reprogrammé pour le ${new Date(newDateRdv).toLocaleDateString('fr-FR')} à ${new Date(newDateRdv).toLocaleTimeString('fr-FR')}.`,
      });
      
      // Rafraîchir la liste pour montrer les changements
      await fetchRendezvous();
      
      // Fermer la modale et réinitialiser les états
      setShowRescheduler(false);
      setRdvToReschedule(null);
      setNewDateRdv("");
    } catch (error) {
      console.error('Erreur lors de la reprogrammation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de reprogrammer le rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [`reschedule-${rdvToReschedule?.id}`]: false }));
    }
  };
  
  // Fonction pour annuler rapidement un rendez-vous
  const handleFastCancel = async (rdv: Rendezvous) => {
    try {
      // Indiquer le chargement
      setLoadingActions(prev => ({ ...prev, [`cancel-${rdv.id}`]: true }));
      
      await updateRendezvousStatut(rdv.id, 'annule');
      toast({
        title: "Succès",
        description: "Le rendez-vous a été annulé.",
      });
      
      // Rafraîchir la liste pour montrer les changements
      await fetchRendezvous();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [`cancel-${rdv.id}`]: false }));
    }
  };

  // Fonction pour terminer le workflow
  const handleWorkflowComplete = async () => {
    if (selectedRendezvous) {
      await updateRendezvousStatut(selectedRendezvous.id, 'termine');
      
      toast({
        title: "Terminé",
        description: "Le workflow de positionnement est terminé et le dossier a été créé.",
      });
    }
    
    setShowWorkflow(false);
    setSelectedRendezvous(null);
  };

  // Fonction pour filtrer les rendez-vous selon l'onglet actif
  const getFilteredRendezvous = () => {
    if (activeTab === "impact") {
      return rendezvous.filter(rdv => rdv.type === "impact");
    } else if (activeTab !== "tous") {
      return rendezvous.filter(rdv => rdv.statut === activeTab && rdv.type !== "impact");
    }
    return rendezvous.filter(rdv => rdv.type !== "impact");
  };
  
  // Fonction pour charger les rendez-vous au changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Si on sélectionne l'onglet impact, on charge tous les rendez-vous d'impact
    if (value === "impact") {
      fetchRendezvous(undefined, "impact");
    } else if (value === "tous") {
      fetchRendezvous();
    } else {
      fetchRendezvous(value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl">
              {editMode ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => {
              setShowForm(false);
              setEditMode(false);
              setRdvToEdit(null);
            }}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <RendezvousFormUnified
              onSubmit={handleSubmitRdv}
              initialData={rdvToEdit || undefined}
              onClose={() => {
                setShowForm(false);
                setEditMode(false);
                setRdvToEdit(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {showWorkflow && selectedRendezvous && (
        <WorkflowPositionnement 
          positionnementRequest={{
            id: selectedRendezvous.id,
            nom_beneficiaire: selectedRendezvous.nomBeneficiaire,
            prenom_beneficiaire: selectedRendezvous.prenomBeneficiaire,
            email_beneficiaire: selectedRendezvous.emailBeneficiaire,
            telephone_beneficiaire: selectedRendezvous.telephoneBeneficiaire || '',
            objectifs: selectedRendezvous.objectifs?.join(', ') || '',
            format_souhaite: selectedRendezvous.modaliteFormation || '',
            disponibilites: selectedRendezvous.dateDispo || '',
            formation_selectionnee: selectedRendezvous.formationSelectionnee || ''
          }}
          onComplete={handleWorkflowComplete}
          onCancel={() => setShowWorkflow(false)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rendez-vous</h1>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      <Tabs 
        defaultValue="tous" 
        className="w-full mt-6"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="nouveau">Nouveaux</TabsTrigger>
          <TabsTrigger value="rdv_planifie">Planifiés</TabsTrigger>
          <TabsTrigger value="termine">Terminés</TabsTrigger>
          <TabsTrigger value="annule">Annulés</TabsTrigger>
          <TabsTrigger value="impact" className="bg-purple-100 hover:bg-purple-200">
            <BarChart4 className="h-4 w-4 mr-1" />
            Impact
          </TabsTrigger>
        </TabsList>

        {/* Contenu pour chaque onglet standard */}
        {['nouveau', 'rdv_planifie', 'termine', 'annule', 'tous'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue}>
            <div className="space-y-6">
              {loading ? (
                <p>Chargement en cours...</p>
              ) : error ? (
                <p className="text-red-500">Erreur: {error}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredRendezvous().length === 0 ? (
                    <p>Aucun rendez-vous trouvé.</p>
                  ) : (
                    getFilteredRendezvous().map((rdv) => (
                      <Card key={rdv.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {rdv.prenomBeneficiaire} {rdv.nomBeneficiaire}
                            </CardTitle>
                            {getStatusBadge(rdv.statut, rdv.type)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {rdv.formationSelectionnee || "Formation non spécifiée"}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-sm space-y-2">
                              <p>
                                <strong>Email:</strong> {rdv.emailBeneficiaire}
                              </p>
                              {rdv.telephoneBeneficiaire && (
                                <p>
                                  <strong>Téléphone:</strong> {rdv.telephoneBeneficiaire}
                                </p>
                              )}
                              {rdv.dateRdv && (
                                <p>
                                  <strong>Date:</strong> {new Date(rdv.dateRdv).toLocaleDateString('fr-FR')}
                                </p>
                              )}
                              {rdv.objectifs && (
                                <p>
                                  <strong>Objectifs:</strong> {
                                    Array.isArray(rdv.objectifs) 
                                      ? rdv.objectifs.join(', ')
                                      : rdv.objectifs
                                  }
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {rdv.statut === 'nouveau' && (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        // Indiquer le chargement
                                        setLoadingActions(prev => ({ ...prev, [`validate-${rdv.id}`]: true }));
                                        
                                        await validerRendezvous(rdv.id, 'visio');
                                        toast({
                                          title: "Rendez-vous validé", 
                                          description: "Le rendez-vous a été planifié automatiquement en visio."
                                        });
                                        
                                        // Rafraîchir la liste pour montrer les changements
                                        await fetchRendezvous();
                                      } catch (error) {
                                        toast({
                                          title: "Erreur",
                                          description: "Impossible de valider le rendez-vous.",
                                          variant: "destructive"
                                        });
                                      } finally {
                                        setLoadingActions(prev => ({ ...prev, [`validate-${rdv.id}`]: false }));
                                      }
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={loadingActions[`validate-${rdv.id}`]}
                                  >
                                    {loadingActions[`validate-${rdv.id}`] ? 
                                      "Traitement..." : 
                                      <><Check className="h-4 w-4 mr-1" />Valider en un clic</>
                                    }
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setRdvToReschedule(rdv);
                                      setShowRescheduler(true);
                                      setNewFormatRdv(rdv.canal || 'visio');
                                      // Initialiser la date avec la date actuelle si aucune n'est définie
                                      if (!rdv.dateRdv) {
                                        const now = new Date();
                                        // Format YYYY-MM-DDThh:mm nécessaire pour l'input datetime-local
                                        const formattedDate = now.toISOString().slice(0, 16);
                                        setNewDateRdv(formattedDate);
                                      } else {
                                        // Utiliser la date existante si disponible
                                        const existingDate = new Date(rdv.dateRdv);
                                        const formattedDate = existingDate.toISOString().slice(0, 16);
                                        setNewDateRdv(formattedDate);
                                      }
                                    }}
                                  >
                                    <Clock className="h-4 w-4 mr-1" />
                                    Reprogrammer
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateRendezvousStatut(rdv.id, 'rdv_planifie')}
                                  >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Planifier RDV
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => startWorkflow(rdv)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Traiter demande
                                  </Button>
                                </>
                              )}

                              {(rdv.statut === "termine" || rdv.statut === "en_cours") && (
                                <div className="flex space-x-2 items-center mt-4">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleOpenCompteRendu(rdv)}
                                    className="flex-1"
                                  >
                                    <FileEdit className="h-4 w-4 mr-2" />
                                    Compte rendu
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handlePlanifierImpact(rdv)}
                                    className="flex-1"
                                  >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Planifier impact
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startWorkflow(rdv)}
                                    className="flex-1"
                                  >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Documents
                                  </Button>
                                </div>
                              )}

                              {(rdv.statut === 'rdv_planifie' || rdv.statut === 'termine') && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateRendezvousStatut(rdv.id, 'termine')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Terminer
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => creerFormation(rdv)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    Créer formation
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      // Obtenir une date par défaut dans 6 mois
                                      const dateNow = new Date();
                                      dateNow.setMonth(dateNow.getMonth() + 6); // +6 mois par défaut
                                      const defaultDate = dateNow.toISOString().split('T')[0];
                                       
                                      // Demander la date à l'utilisateur
                                      const dateStr = window.prompt(
                                        "Date prévisionnelle du suivi d'impact (format YYYY-MM-DD)", 
                                        defaultDate
                                      );
                                       
                                      if (dateStr) {
                                        planifierImpact(rdv.id, dateStr)
                                          .then(() => {
                                            toast({
                                              title: "Suivi d'impact planifié",
                                              description: `Un rendez-vous de suivi d'impact a été créé pour le ${new Date(dateStr).toLocaleDateString('fr-FR')}`
                                            });
                                          })
                                          .catch(err => {
                                            toast({
                                              title: "Erreur",
                                              description: "Impossible de planifier le suivi d'impact.",
                                              variant: "destructive"
                                            });
                                          });
                                      }
                                    }}
                                  >
                                    <LineChart className="h-4 w-4 mr-1" />
                                    Planifier impact
                                  </Button>
                                </>
                              )}
                              
                              {/* Actions pour les rendez-vous d'impact */}
                              {rdv.type === "impact" && (
                                <>
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => handleOpenImpactEvaluation(rdv)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Évaluer impact
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleGenererRapport(rdv)}
                                    disabled={loadingReport}
                                  >
                                    <FileBarChart className="h-4 w-4 mr-1" />
                                    {loadingReport ? "Génération..." : "Rapport d'impact"}
                                  </Button>
                                  
                                  {rdv.statut !== "termine" && (
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => handleTerminerImpact(rdv)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Terminer
                                    </Button>
                                  )}
                                </>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditRdv(rdv)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              
                              {rdv.statut !== 'annule' && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleFastCancel(rdv)}
                                  disabled={loadingActions[`cancel-${rdv.id}`]}
                                >
                                  {loadingActions[`cancel-${rdv.id}`] ? 
                                    "Annulation..." : 
                                    <><AlertCircle className="h-4 w-4 mr-1" />Annuler RDV</>
                                  }
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
        
        {/* Contenu pour l'onglet impact */}
        <TabsContent value="impact">
          <div className="space-y-6">
            {loading ? (
              <p>Chargement en cours...</p>
            ) : error ? (
              <p className="text-red-500">Erreur: {error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRendezvous().length === 0 ? (
                  <p>Aucun rendez-vous d'impact trouvé.</p>
                ) : (
                  getFilteredRendezvous().map(rdv => (
                    <Card key={rdv.id} className="hover:shadow-lg transition-shadow bg-purple-50">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {rdv.prenomBeneficiaire} {rdv.nomBeneficiaire}
                          </CardTitle>
                          {getStatusBadge(rdv.statut, rdv.type)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {rdv.formationSelectionnee || "Formation non spécifiée"}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm space-y-2">
                            <p>
                              <strong>Email:</strong> {rdv.emailBeneficiaire}
                            </p>
                            {rdv.dateRdv && (
                              <p>
                                <strong>Date:</strong> {new Date(rdv.dateRdv).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleOpenImpactEvaluation(rdv)}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Évaluer impact
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenererRapport(rdv)}
                              disabled={loadingReport}
                            >
                              <FileBarChart className="h-4 w-4 mr-1" />
                              {loadingReport ? "Génération..." : "Rapport d'impact"}
                            </Button>
                            
                            {rdv.statut !== "termine" && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleTerminerImpact(rdv)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Terminer
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditRdv(rdv)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modale pour le formulaire d'évaluation d'impact */}
      <Dialog open={showImpactForm} onOpenChange={(open) => {
        if (!open) {
          setShowImpactForm(false);
          setRdvImpact(null);
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Évaluation d'impact</DialogTitle>
          </DialogHeader>
          <ImpactEvaluationForm 
            onSubmit={handleSubmitImpactEvaluation}
            initialData={rdvImpact || undefined}
            onClose={() => {
              setShowImpactForm(false);
              setRdvImpact(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale pour le rapport d'impact */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Rapport d'impact</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            {reportUrl && (
              <iframe 
                src={reportUrl} 
                className="w-full h-full border-0" 
                title="Rapport d'impact"
              />
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowReportModal(false)}
            >
              Fermer
            </Button>
            <Button 
              onClick={() => window.open(reportUrl, '_blank')}
            >
              Ouvrir dans un nouvel onglet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale de reprogrammation rapide */}
      <Dialog open={showRescheduler} onOpenChange={setShowRescheduler}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reprogrammer le rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="dateRdv" className="text-right col-span-1">
                Date et heure
              </label>
              <input
                id="dateRdv"
                type="datetime-local"
                className="col-span-3 p-2 border rounded"
                value={newDateRdv}
                onChange={(e) => setNewDateRdv(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="formatRdv" className="text-right col-span-1">
                Format
              </label>
              <select
                id="formatRdv"
                className="col-span-3 p-2 border rounded"
                value={newFormatRdv}
                onChange={(e) => setNewFormatRdv(e.target.value)}
              >
                <option value="visio">Visioconférence</option>
                <option value="presentiel">Présentiel</option>
                <option value="telephone">Téléphone</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowRescheduler(false)} disabled={loadingActions[`reschedule-${rdvToReschedule?.id}`]}>Annuler</Button>
            <Button 
              onClick={handleFastReschedule} 
              disabled={loadingActions[`reschedule-${rdvToReschedule?.id}`]}
            >
              {loadingActions[`reschedule-${rdvToReschedule?.id}`] ? "Traitement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale pour l'édition du compte rendu */}
      <CompteRenduAvanceModal 
        rendezvous={rdvCompteRendu}
        isOpen={showCompteRenduModal}
        onClose={() => {
          setShowCompteRenduModal(false);
          setRdvCompteRendu(null);
        }}
        onSuccess={handleCompteRenduSuccess}
      />
    </div>
  );
};

export default RendezVousListUnified;
