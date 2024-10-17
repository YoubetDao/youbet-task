import BaseLayout from './shared/BaseLayout'

export const description =
  'A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.'

export const iframeHeight = '800px'

export const containerClassName = 'w-full h-full'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>
}
