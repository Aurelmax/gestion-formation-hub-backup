'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}