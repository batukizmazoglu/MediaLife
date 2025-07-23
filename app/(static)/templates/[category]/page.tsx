import { redirect } from 'next/navigation'

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  // You could add logic here to handle different categories
  // For now, we'll redirect all category roots to login
  redirect('/templates/authentication/login')
}