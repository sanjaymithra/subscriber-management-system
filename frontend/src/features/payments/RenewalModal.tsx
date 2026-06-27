import { type FormEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useRenewSubscription } from '../../hooks/usePaymentsData'
import type { PaymentMethod, PaymentStatus } from '../../types/payment'
import type { Subscriber } from '../../types/subscriber'
import { formatDate } from '../../utils/subscriberFormat'

const durationOptions = [1, 3, 6, 12]
const paymentMethods: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer']
const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending']
const demoRemarks = ['Office counter renewal', 'Monthly route collection', 'Customer paid after reminder', 'Renewed during weekend billing']

function generateDemoPaymentValues() {
  const methods: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer']
  const durations = [1, 3, 6, 12]
  const selectedMethod = methods[Math.floor(Math.random() * methods.length)]
  const selectedDuration = durations[Math.floor(Math.random() * durations.length)]
  const baseAmount = selectedDuration === 1 ? 499 : selectedDuration === 3 ? 1299 : selectedDuration === 6 ? 2499 : 4999

  return {
    amount: String(baseAmount + Math.floor(Math.random() * 200)),
    durationMonths: selectedDuration,
    paymentMethod: selectedMethod,
    paymentStatus: Math.random() > 0.15 ? 'Paid' as const : 'Pending' as const,
    remarks: demoRemarks[Math.floor(Math.random() * demoRemarks.length)],
    transactionReference: createTransactionReference(selectedMethod),
  }
}

type RenewalModalProps = {
  autoFillOnOpen?: boolean
  isOpen: boolean
  onClose: () => void
  subscriber: Subscriber | null
}

function createTransactionReference(method: PaymentMethod) {
  const prefix = method === 'Cash' ? 'CASH' : method.toUpperCase().replace(' ', '')
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`
}

export function RenewalModal({ autoFillOnOpen = false, isOpen, onClose, subscriber }: RenewalModalProps) {
  const renewMutation = useRenewSubscription()
  const initialValues = autoFillOnOpen ? generateDemoPaymentValues() : null
  const [amount, setAmount] = useState(initialValues?.amount ?? '1299')
  const [durationMonths, setDurationMonths] = useState(initialValues?.durationMonths ?? 3)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialValues?.paymentMethod ?? 'Cash')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initialValues?.paymentStatus ?? 'Paid')
  const [remarks, setRemarks] = useState(initialValues?.remarks ?? '')
  const [transactionReference, setTransactionReference] = useState(initialValues?.transactionReference ?? '')

  const newExpiryPreview = useMemo(() => {
    if (!subscriber) {
      return ''
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const currentExpiry = new Date(subscriber.expiryDate)
    const expiryDay = new Date(currentExpiry)
    expiryDay.setHours(0, 0, 0, 0)
    const baseDate = expiryDay < today ? today : currentExpiry
    const nextExpiry = new Date(baseDate)
    nextExpiry.setMonth(nextExpiry.getMonth() + durationMonths)

    return nextExpiry.toISOString()
  }, [durationMonths, subscriber])

  const fillDemoPayment = () => {
    const demoValues = generateDemoPaymentValues()

    setAmount(demoValues.amount)
    setDurationMonths(demoValues.durationMonths)
    setPaymentMethod(demoValues.paymentMethod)
    setPaymentStatus(demoValues.paymentStatus)
    setTransactionReference(demoValues.transactionReference)
    setRemarks(demoValues.remarks)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!subscriber) {
      return
    }

    renewMutation.mutate({
      amount: Number(amount),
      durationMonths,
      paymentMethod,
      paymentStatus,
      remarks,
      subscriberId: subscriber.subscriberId,
      transactionReference,
    }, {
      onError: () => toast.error('Failed to record renewal payment'),
      onSuccess: () => {
        toast.success('Renewal payment recorded')
        onClose()
      },
    })
  }

  if (!subscriber) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renew Subscription">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 text-xs bg-surface-container-low border border-outline-variant p-3">
          <div>
            <p className="text-[10px] font-bold text-outline uppercase">Subscriber</p>
            <p className="font-bold text-on-surface">{subscriber.fullName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase">Subscriber ID</p>
            <p className="font-mono text-on-surface">{subscriber.subscriberId}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase">Current Plan</p>
            <p className="text-primary font-bold">{subscriber.subscriptionPlan}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase">Current Status</p>
            <p className="text-on-surface">{subscriber.subscriptionStatus}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase">Current Expiry</p>
            <p className="text-on-surface">{formatDate(subscriber.expiryDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase">New Expiry</p>
            <p className="font-bold text-on-surface">{formatDate(newExpiryPreview)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="h-8 px-3 text-[10px] font-bold uppercase" onClick={fillDemoPayment} variant="secondary">
            Generate Demo Payment
          </Button>
          <p className="text-[10px] text-on-surface-variant">Demo helper - optional. Keep it if useful, remove anytime.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-on-surface-variant">
            Subscription Duration
            <select className="mt-1 w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" onChange={(event) => setDurationMonths(Number(event.target.value))} value={durationMonths}>
              {durationOptions.map((duration) => (
                <option key={duration} value={duration}>{duration} Month{duration > 1 ? 's' : ''}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-on-surface-variant">
            Amount
            <input className="mt-1 w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" min="1" onChange={(event) => setAmount(event.target.value)} required type="number" value={amount} />
          </label>
          <label className="text-xs font-bold text-on-surface-variant">
            Payment Method
            <select className="mt-1 w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} value={paymentMethod}>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-on-surface-variant">
            Payment Status
            <select className="mt-1 w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)} value={paymentStatus}>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-on-surface-variant sm:col-span-2">
            Transaction Reference
            <input className="mt-1 w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" onChange={(event) => setTransactionReference(event.target.value)} type="text" value={transactionReference} />
          </label>
          <label className="text-xs font-bold text-on-surface-variant sm:col-span-2">
            Remarks
            <textarea className="mt-1 w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm" onChange={(event) => setRemarks(event.target.value)} rows={3} value={remarks} />
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Button className="px-4 py-2 text-xs font-bold uppercase" onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button className="px-4 py-2 text-xs font-bold uppercase" disabled={renewMutation.isPending} type="submit">
            {renewMutation.isPending ? 'Saving...' : 'Save Renewal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
