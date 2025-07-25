'use client'

import dynamic from 'next/dynamic'
import { use } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar' // Check this import

interface ComponentPageProps {
  params: { slug: string }
}

export default function Page({ params }: ComponentPageProps) {
  const { slug } = params
  const pathname = slug

  const { toggleSidebar } = useSidebar()

  // Dynamically import the preview component
  const PreviewComponent = dynamic(
    () => import(`@/components/components/${pathname}`),
    {
      loading: () => <p>Loading preview...</p>,
      // Handle import errors gracefully
      ssr: true,
    },
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => toggleSidebar()}
                className="cursor-pointer"
              >
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {pathname.replace(/-/g, ' ')} Component
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PreviewComponent />
      </div>
    </div>
  )
}
