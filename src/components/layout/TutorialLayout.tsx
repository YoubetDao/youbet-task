import React from 'react'
import BaseLayout from './shared/BaseLayout'

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout mode="tutorial">{children}</BaseLayout>
}
