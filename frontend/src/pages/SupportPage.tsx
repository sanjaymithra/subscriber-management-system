import { toast } from 'sonner'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'

export function SupportPage() {
  return (
    <PageWrapper className="p-container-padding space-y-gutter">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Support</h2>
        <p className="text-sm text-on-surface-variant">Application support and project information.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <section className="bg-white border border-outline-variant p-stack-md">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Contact</h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-bold">Project:</span> Telangana Today Subscriber Management</p>
            <p><span className="font-bold">Version:</span> 1.0.0</p>
            <p><span className="font-bold">Developer:</span> Demo Frontend Team</p>
            <p><span className="font-bold">Email:</span> support@demo.com</p>
            <p><span className="font-bold">Phone:</span> +91 90000 00000</p>
            <p><span className="font-bold">Office Hours:</span> Monday to Saturday, 10:00 AM - 6:00 PM IST</p>
          </div>
          <Button className="mt-5 px-4 py-2 text-xs font-bold uppercase" icon="bug_report" onClick={() => toast.info('Issue report noted for demo review.')}>
            Report Issue
          </Button>
        </section>
        <section className="bg-white border border-outline-variant p-stack-md">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">About Application</h3>
          <p className="text-sm text-on-surface-variant leading-6">
            This internal system helps office staff manage newspaper subscribers, offline payments, subscription renewals, and reporting from one database-backed portal.
          </p>
          <h3 className="font-bold text-sm uppercase tracking-wider mt-6 mb-3">Privacy Notice</h3>
          <p className="text-sm text-on-surface-variant leading-6">
            Subscriber and payment records are intended for demonstration and office evaluation. Do not enter sensitive production customer data in demo environments.
          </p>
        </section>
      </div>
    </PageWrapper>
  )
}
