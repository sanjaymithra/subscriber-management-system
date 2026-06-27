import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PaymentHistory } from '../features/payments/PaymentHistory'
import { RenewalModal } from '../features/payments/RenewalModal'
import { useSubscriberData } from '../hooks/useSubscribersData'
import { formatDate, getStatusClassName, getStatusDotClassName } from '../utils/subscriberFormat'

export function SubscriberDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: subscriber, isError, isLoading } = useSubscriberData(id)
  const [isRenewalOpen, setIsRenewalOpen] = useState(false)

  if (isLoading) {
    return (
      <PageWrapper className="flex-1 p-container-padding">
        <div className="max-w-5xl mx-auto bg-surface-container-lowest border border-outline-variant p-8">
          <p className="text-sm text-on-surface-variant">Loading subscriber profile...</p>
        </div>
      </PageWrapper>
    )
  }

  if (isError || !subscriber) {
    return (
      <PageWrapper className="flex-1 p-container-padding">
        <div className="max-w-5xl mx-auto bg-surface-container-lowest border border-outline-variant p-8">
          <h2 className="text-2xl font-bold text-on-surface">Subscriber not found</h2>
          <p className="text-sm text-on-surface-variant mt-2">The requested subscriber record could not be loaded.</p>
          <Button className="mt-5 px-4 py-2 text-xs font-bold uppercase" onClick={() => navigate('/subscribers')} variant="secondary">
            Back to Subscribers
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="flex-1 p-container-padding">
      <div className="max-w-5xl mx-auto space-y-gutter">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase mb-1">
              <Link className="hover:text-primary" to="/subscribers">Subscribers</Link>
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">chevron_right</span>
              <span className="text-primary">{subscriber.subscriberId}</span>
            </nav>
            <h2 className="text-2xl font-bold text-on-background">{subscriber.fullName}</h2>
            <p className="text-sm text-on-surface-variant">
              Subscription profile overview from the subscriber database.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="h-9 px-4 text-xs font-bold uppercase"
              icon="autorenew"
              onClick={() => setIsRenewalOpen(true)}
              variant="secondary"
            >
              Renew Subscription
            </Button>
            <Button
              className="h-9 px-4 text-xs font-bold uppercase"
              icon="edit"
              onClick={() => navigate(`/subscribers/${subscriber.subscriberId}/edit`)}
            >
              Edit Subscriber
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <Card className="p-stack-md lg:col-span-2">
            <div className="flex items-center gap-2 mb-stack-md text-primary">
              <span className="material-symbols-outlined" aria-hidden="true">badge</span>
              <h3 className="font-bold uppercase text-xs">Subscriber Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md text-sm">
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Subscriber ID</p>
                <p className="font-bold text-on-surface">{subscriber.subscriberId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Email</p>
                <p className="text-on-surface-variant">{subscriber.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Active Plan</p>
                <p className="font-bold text-primary">{subscriber.subscriptionPlan}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Renewal</p>
                <p className="text-on-surface">{formatDate(subscriber.expiryDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Phone</p>
                <p className="text-on-surface">{subscriber.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Newspaper Type</p>
                <p className="text-on-surface">{subscriber.newspaperType}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Address</p>
                <p className="text-on-surface">{subscriber.address}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">City / Pincode</p>
                <p className="text-on-surface">{subscriber.city} {subscriber.pincode}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Delivery Boy</p>
                <p className="text-on-surface">{subscriber.deliveryBoy}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase">Payment Status</p>
                <p className="text-on-surface">{subscriber.paymentStatus}</p>
              </div>
            </div>
          </Card>
          <Card className="p-stack-md">
            <div className="flex items-center gap-2 mb-stack-md text-primary">
              <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
              <h3 className="font-bold uppercase text-xs">Status</h3>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusClassName(subscriber.subscriptionStatus)}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotClassName(subscriber.subscriptionStatus)}`}></span>
              {subscriber.subscriptionStatus}
            </span>
            <p className="text-xs text-on-surface-variant mt-4">
              Started {formatDate(subscriber.startDate)}. Last updated {formatDate(subscriber.updatedAt)}.
            </p>
            {subscriber.notes && (
              <p className="text-xs text-on-surface-variant mt-4">{subscriber.notes}</p>
            )}
          </Card>
        </div>
        <PaymentHistory subscriber={subscriber} />
      </div>
      <RenewalModal isOpen={isRenewalOpen} onClose={() => setIsRenewalOpen(false)} subscriber={subscriber} />
    </PageWrapper>
  )
}
