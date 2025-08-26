import { Header } from "@/components/layout/header"
import { BriefWizard } from "@/components/wizard/brief-wizard"

export default function BriefPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BriefWizard />
      </main>
    </div>
  )
}
