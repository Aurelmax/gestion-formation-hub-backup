import ProgrammesPersonnalises from '@/components/programmes/ProgrammesPersonnalises'

export default function ProgrammesPersonnalisesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programmes personnalisés</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos programmes de formation sur-mesure
        </p>
      </div>

      <ProgrammesPersonnalises />
    </div>
  )
}