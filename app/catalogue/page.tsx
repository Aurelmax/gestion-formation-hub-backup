import { redirect } from 'next/navigation'

// Redirection 301 SEO-friendly vers la page d'accueil
export default function CataloguePage() {
  redirect('/')
}
