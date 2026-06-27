import { usePaymentHistory } from '../../hooks/usePaymentsData'
import type { Subscriber } from '../../types/subscriber'
import { formatDate } from '../../utils/subscriberFormat'

type PaymentHistoryProps = {
  subscriber: Subscriber
}

export function PaymentHistory({ subscriber }: PaymentHistoryProps) {
  const { data: payments = [], isLoading } = usePaymentHistory(subscriber.subscriberId)

  return (
    <div className="bg-surface-container-lowest border border-outline-variant">
      <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
        <h3 className="font-bold uppercase text-xs">Payment History</h3>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-[10px] font-bold text-outline uppercase">
            <tr>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Previous Expiry</th>
              <th className="p-3">New Expiry</th>
              <th className="p-3">Status</th>
              <th className="p-3">Recorded By</th>
              <th className="p-3">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 text-xs">
            {isLoading && (
              <tr>
                <td className="p-4 text-center text-on-surface-variant" colSpan={9}>Loading payment history...</td>
              </tr>
            )}
            {!isLoading && payments.length === 0 && (
              <tr>
                <td className="p-4 text-center text-on-surface-variant" colSpan={9}>No payment history recorded.</td>
              </tr>
            )}
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="p-3">{formatDate(payment.paymentDate)}</td>
                <td className="p-3 font-bold">₹{payment.amount.toLocaleString()}</td>
                <td className="p-3">{payment.paymentMethod}</td>
                <td className="p-3">{payment.durationMonths} Month{payment.durationMonths > 1 ? 's' : ''}</td>
                <td className="p-3">{formatDate(payment.previousExpiryDate)}</td>
                <td className="p-3">{formatDate(payment.newExpiryDate)}</td>
                <td className="p-3">{payment.paymentStatus}</td>
                <td className="p-3">{payment.recorder.email}</td>
                <td className="p-3">{payment.transactionReference || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
