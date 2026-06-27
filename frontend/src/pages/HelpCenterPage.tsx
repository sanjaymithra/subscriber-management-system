import { PageWrapper } from '../components/layout/PageWrapper'

const sections = [
  ['Getting Started', 'Use the sidebar to open Dashboard, Subscribers, Payments & Renewals, Reports, and Settings. Start by reviewing dashboard counts and recent payment activity.'],
  ['Managing Subscribers', 'Add subscribers from the Subscribers page, validate contact details, choose a plan, and keep profile information accurate for delivery teams.'],
  ['Recording Payments', 'Open Payments & Renewals, choose a subscriber, record the offline payment amount, method, status, reference, and remarks.'],
  ['Renewing Subscriptions', 'Use Renew Subscription from a subscriber row or profile. The system calculates the new expiry date and stores the payment history.'],
  ['Reports', 'Open Reports to review subscriber counts, revenue totals, payment methods, status distribution, and searchable report tables.'],
  ['Frequently Asked Questions', 'Demo accounts are seeded automatically. Paid subscribers have initial payment records. Renewals append to the same payment timeline.'],
] as const

export function HelpCenterPage() {
  return (
    <PageWrapper className="p-container-padding space-y-gutter">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Help Center</h2>
        <p className="text-sm text-on-surface-variant">Concise operating guide for office staff.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {sections.map(([title, body]) => (
          <section className="bg-white border border-outline-variant p-stack-md" key={title}>
            <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface">{title}</h3>
            <p className="mt-3 text-sm text-on-surface-variant leading-6">{body}</p>
          </section>
        ))}
      </div>
    </PageWrapper>
  )
}
