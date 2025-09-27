import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Calendar, BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre centre de formation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Formations catalogue
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Apprenants actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              RDV cette semaine
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              3 aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux satisfaction
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2% ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/dashboard/formations/catalogue">
                <Button className="w-full h-20 flex-col gap-2" variant="outline">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Catalogue</span>
                </Button>
              </Link>

              <Link href="/dashboard/formations/personnalises">
                <Button className="w-full h-20 flex-col gap-2" variant="outline">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Programmes</span>
                </Button>
              </Link>

              <Link href="/dashboard/rendezvous">
                <Button className="w-full h-20 flex-col gap-2" variant="outline">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Rendez-vous</span>
                </Button>
              </Link>

              <Link href="/dashboard/apprenants">
                <Button className="w-full h-20 flex-col gap-2" variant="outline">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Apprenants</span>
                </Button>
              </Link>

              <Link href="/dashboard/veille">
                <Button className="w-full h-20 flex-col gap-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Veille</span>
                </Button>
              </Link>

              <Link href="/dashboard/qualite/reclamations">
                <Button className="w-full h-20 flex-col gap-2" variant="outline">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="text-sm">Qualité</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Statuts */}
        <Card>
          <CardHeader>
            <CardTitle>Statuts rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Programmes validés</span>
              </div>
              <span className="font-semibold">12</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-sm">En attente</span>
              </div>
              <span className="font-semibold">3</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm">Réclamations</span>
              </div>
              <span className="font-semibold">2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouvelle formation ajoutée</p>
                <p className="text-xs text-muted-foreground">Formation WordPress avancée - il y a 2h</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Programme personnalisé validé</p>
                <p className="text-xs text-muted-foreground">Formation SEO - Marie Martin - il y a 4h</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Rendez-vous de positionnement</p>
                <p className="text-xs text-muted-foreground">Jean Dupont - demain 14h00</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau dossier apprenant</p>
                <p className="text-xs text-muted-foreground">Sophie Martin - il y a 1 jour</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}