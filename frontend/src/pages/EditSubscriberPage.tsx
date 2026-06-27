import { type FormEvent, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { FormField, SelectInput, TextArea, TextInput } from '../components/ui/FormField'
import { paymentStatuses, subscriptionDurations } from '../features/subscribers/subscribersData'
import { useCreateSubscriber, useSubscriberData, useSubscriptionPlans, useUpdateSubscriber } from '../hooks/useSubscribersData'
import type { Subscriber, SubscriberFormInput } from '../types/subscriber'

type SubscriberFormState = SubscriberFormInput & {
  subscriptionDurationMonths: string
}

type ValidationErrors = Partial<Record<'email' | 'phone' | 'pincode' | 'startDate', string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\d{10}$/
const pincodePattern = /^\d{6}$/

const emptySubscriberForm: SubscriberFormState = {
  address: '',
  city: '',
  deliveryBoy: '',
  email: '',
  expiryDate: '',
  fullName: '',
  newspaperType: 'Print',
  notes: '',
  paymentStatus: 'Pending',
  phone: '',
  pincode: '',
  startDate: '',
  subscriberId: '',
  subscriptionDurationMonths: '12',
  subscriptionPlan: 'Premium Print',
}

const demoFirstNames = ['Arjun', 'Kavya', 'Rohit', 'Ananya', 'Vikram', 'Sravani', 'Nikhil', 'Meera']
const demoLastNames = ['Reddy', 'Kumar', 'Sharma', 'Naidu', 'Rao', 'Varma', 'Iyer', 'Patel']
const demoStreets = ['MG Road', 'Banjara Hills', 'Hitech City', 'Kukatpally', 'Ameerpet', 'Madhapur']
const demoCities = ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Secunderabad']
const demoDeliveryBoys = ['Ravi Kumar', 'Suresh Yadav', 'Mahesh Reddy', 'Imran Khan', 'Kiran Rao']
const planBenefits: Record<string, string[]> = {
  'Digital Only': ['Unlimited e-paper', 'Mobile & desktop access', 'Daily digital edition'],
  'Premium Print': ['Daily printed newspaper', 'Complete digital access', 'Sunday magazine included'],
  'Weekend Only': ['Saturday & Sunday newspaper', 'Weekend magazine', 'Budget-friendly subscription'],
}
const planNewspaperTypes: Record<string, string> = {
  'Digital Only': 'Digital',
  'Premium Print': 'Print + Digital',
  'Weekend Only': 'Print',
}

function pickRandom<TValue>(values: TValue[]) {
  return values[Math.floor(Math.random() * values.length)]
}

function addMonths(dateValue: string, months: number) {
  if (!dateValue) {
    return ''
  }

  const date = new Date(`${dateValue}T00:00:00.000Z`)
  date.setUTCMonth(date.getUTCMonth() + months)
  return date.toISOString().slice(0, 10)
}

function calculateDurationMonths(startDate: string, expiryDate: string) {
  if (!startDate || !expiryDate) {
    return '12'
  }

  const start = new Date(`${startDate}T00:00:00.000Z`)
  const expiry = new Date(`${expiryDate}T00:00:00.000Z`)
  const months = (expiry.getUTCFullYear() - start.getUTCFullYear()) * 12 + expiry.getUTCMonth() - start.getUTCMonth()
  const closestDuration = subscriptionDurations.find((duration) => duration >= months) ?? 12
  return String(closestDuration)
}

function calculateStatusPreview(startDate: string, expiryDate: string) {
  if (!startDate || !expiryDate) {
    return 'Calculated'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(`${startDate}T00:00:00.000Z`)
  const expiry = new Date(`${expiryDate}T00:00:00.000Z`)

  if (today < start) {
    return 'Pending'
  }

  if (today > expiry) {
    return 'Expired'
  }

  return 'Active'
}

function getStatusBadgeClassName(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'Expired':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'Pending':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    default:
      return 'bg-secondary-container text-on-secondary-container border-outline-variant'
  }
}

function getPlanNewspaperType(planName: string) {
  return planNewspaperTypes[planName] ?? 'Print'
}

function getValidationErrors(formData: SubscriberFormState) {
  const errors: ValidationErrors = {}

  if (!formData.email) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(formData.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!formData.phone) {
    errors.phone = 'Phone number is required.'
  } else if (!phonePattern.test(formData.phone)) {
    errors.phone = 'Phone must be exactly 10 digits.'
  }

  if (!formData.pincode) {
    errors.pincode = 'Pincode is required.'
  } else if (!pincodePattern.test(formData.pincode)) {
    errors.pincode = 'Pincode must be exactly 6 digits.'
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date is required.'
  }

  return errors
}

function createDemoSubscriber(): SubscriberFormState {
  const firstName = pickRandom(demoFirstNames)
  const lastName = pickRandom(demoLastNames)
  const uniqueNumber = Math.floor(100000 + Math.random() * 900000)
  const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`.slice(0, 10)
  const pincode = String(Math.floor(500000 + Math.random() * 9999)).padEnd(6, '0')
  const duration = String(pickRandom(subscriptionDurations))
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 14))
  const startDateValue = startDate.toISOString().slice(0, 10)

  return {
    address: `${Math.floor(10 + Math.random() * 190)}, ${pickRandom(demoStreets)}`,
    city: pickRandom(demoCities),
    deliveryBoy: pickRandom(demoDeliveryBoys),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueNumber}@gmail.com`,
    expiryDate: addMonths(startDateValue, Number(duration)),
    fullName: `${firstName} ${lastName}`,
    newspaperType: getPlanNewspaperType('Premium Print'),
    notes: 'Demo subscriber generated for testing.',
    paymentStatus: pickRandom(paymentStatuses),
    phone,
    pincode,
    startDate: startDateValue,
    subscriberId: `TT-${uniqueNumber}`,
    subscriptionDurationMonths: duration,
    subscriptionPlan: pickRandom(['Premium Print', 'Digital Only', 'Weekend Only']),
  }
}

function toDateInputValue(value: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : ''
}

function toFormInput(subscriber: Subscriber): SubscriberFormState {
  const startDate = toDateInputValue(subscriber.startDate)
  const expiryDate = toDateInputValue(subscriber.expiryDate)

  return {
    address: subscriber.address,
    city: subscriber.city,
    deliveryBoy: subscriber.deliveryBoy,
    email: subscriber.email,
    expiryDate,
    fullName: subscriber.fullName,
    newspaperType: subscriber.newspaperType,
    notes: subscriber.notes ?? '',
    paymentStatus: subscriber.paymentStatus,
    phone: subscriber.phone,
    pincode: subscriber.pincode,
    startDate,
    subscriberId: subscriber.subscriberId,
    subscriptionDurationMonths: calculateDurationMonths(startDate, expiryDate),
    subscriptionPlan: subscriber.subscriptionPlan,
  }
}

export function EditSubscriberPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isCreateMode = !id
  const { data: subscriber, isError, isLoading } = useSubscriberData(id)
  const { data: subscriptionPlans } = useSubscriptionPlans()
  const createMutation = useCreateSubscriber()
  const updateMutation = useUpdateSubscriber(id ?? '')
  const formRef = useRef<HTMLFormElement>(null)
  const [draftFormData, setDraftFormData] = useState<Partial<SubscriberFormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const baseFormData = subscriber && !isCreateMode ? toFormInput(subscriber) : emptySubscriberForm
  const mergedFormData: SubscriberFormState = { ...baseFormData, ...draftFormData }
  const formData: SubscriberFormState = {
    ...mergedFormData,
    expiryDate: addMonths(mergedFormData.startDate, Number(mergedFormData.subscriptionDurationMonths)),
  }
  const validationErrors = getValidationErrors(formData)
  const hasValidationErrors = Object.keys(validationErrors).length > 0
  const statusPreview = calculateStatusPreview(formData.startDate, formData.expiryDate)

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const updateField = (field: keyof SubscriberFormState, value: string) => {
    setDraftFormData((current) => ({ ...current, [field]: value }))
  }

  const updateDigitsOnlyField = (field: 'phone' | 'pincode', value: string, maxLength: number) => {
    updateField(field, value.replace(/\D/g, '').slice(0, maxLength))
  }

  const updateSubscriptionPlan = (planName: string) => {
    setDraftFormData((current) => ({
      ...current,
      newspaperType: getPlanNewspaperType(planName),
      subscriptionPlan: planName,
    }))
  }

  const createPayload = (): SubscriberFormInput => {
    return {
      address: formData.address,
      city: formData.city,
      deliveryBoy: formData.deliveryBoy,
      email: formData.email,
      expiryDate: formData.expiryDate,
      fullName: formData.fullName,
      newspaperType: getPlanNewspaperType(formData.subscriptionPlan),
      notes: formData.notes,
      paymentStatus: formData.paymentStatus,
      phone: formData.phone,
      pincode: formData.pincode,
      startDate: formData.startDate,
      subscriberId: formData.subscriberId,
      subscriptionPlan: formData.subscriptionPlan,
    }
  }

  const submitSubscriber = () => {
    setSubmitted(true)

    if (hasValidationErrors) {
      toast.error('Please fix the highlighted subscriber fields.')
      return
    }

    const mutation = isCreateMode ? createMutation : updateMutation

    mutation.mutate(createPayload(), {
      onError: () => {
        toast.error(isCreateMode ? 'Failed to create subscriber' : 'Failed to update subscriber')
      },
      onSuccess: (savedSubscriber) => {
        toast.success(isCreateMode ? 'Subscriber created' : 'Subscriber updated')
        navigate(`/subscribers/${savedSubscriber.subscriberId}`)
      },
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitSubscriber()
  }

  const handleFooterSubmit = () => {
    if (formRef.current?.reportValidity() === false) {
      setSubmitted(true)
      return
    }

    submitSubscriber()
  }

  const handleFillDemoData = () => {
    const demoSubscriber = createDemoSubscriber()

    setSubmitted(false)
    setDraftFormData({
      ...demoSubscriber,
      newspaperType: getPlanNewspaperType(demoSubscriber.subscriptionPlan),
    })
  }

  if (isError) {
    return (
      <PageWrapper className="flex-1 p-container-padding">
        <div className="bg-surface-container-lowest border border-outline-variant p-8">
          <h2 className="text-2xl font-bold text-on-surface">Subscriber not found</h2>
          <p className="text-sm text-on-surface-variant mt-2">The requested subscriber record could not be loaded.</p>
        </div>
      </PageWrapper>
    )
  }

  if (!isCreateMode && isLoading) {
    return (
      <PageWrapper className="flex-1 p-container-padding">
        <div className="bg-surface-container-lowest border border-outline-variant p-8">
          <p className="text-sm text-on-surface-variant">Loading subscriber profile...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <>
      <PageWrapper className="flex-1 p-container-padding pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-gutter flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-on-background">Edit Subscriber Profile</h2>
              <p className="text-sm text-on-surface-variant">
                Manage professional credentials and subscription lifecycle.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-primary-container/10 text-primary font-bold text-[10px] uppercase rounded-full border border-primary/20">ID: {formData.subscriberId || 'New'}</span>
              <span className={`px-3 py-1 font-bold text-[10px] uppercase rounded-full border ${getStatusBadgeClassName(statusPreview)}`}>Status: {statusPreview}</span>
            </div>
          </div>

          <form className="space-y-gutter" id="subscriber-form" onSubmit={handleSubmit} ref={formRef}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant p-stack-md rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-stack-md text-primary">
                  <span className="material-symbols-outlined" aria-hidden="true">person</span>
                  <h3 className="font-bold uppercase text-xs">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
                  <FormField id="subscriber-id" label="Subscriber ID">
                    <TextInput id="subscriber-id" onChange={(event) => updateField('subscriberId', event.target.value)} required value={formData.subscriberId} />
                  </FormField>
                  <FormField id="full-name" label="Full Name">
                    <TextInput id="full-name" onChange={(event) => updateField('fullName', event.target.value)} required value={formData.fullName} />
                  </FormField>
                  <FormField id="address" label="Address">
                    <TextInput id="address" onChange={(event) => updateField('address', event.target.value)} required value={formData.address} />
                  </FormField>
                  <FormField id="city" label="City">
                    <TextInput id="city" onChange={(event) => updateField('city', event.target.value)} required value={formData.city} />
                  </FormField>
                  <FormField id="pincode" label="Pincode">
                    <TextInput id="pincode" inputMode="numeric" maxLength={6} onChange={(event) => updateDigitsOnlyField('pincode', event.target.value, 6)} pattern="\d{6}" required value={formData.pincode} />
                    {(submitted || formData.pincode) && validationErrors.pincode && <p className="text-[10px] text-error">{validationErrors.pincode}</p>}
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField id="professional-notes" label="Professional Notes">
                      <TextArea id="professional-notes" onChange={(event) => updateField('notes', event.target.value)} rows={2} value={formData.notes} />
                    </FormField>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant p-stack-md rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-stack-md text-primary">
                  <span className="material-symbols-outlined" aria-hidden="true">contact_page</span>
                  <h3 className="font-bold uppercase text-xs">Contact</h3>
                </div>
                <div className="space-y-4">
                  <FormField id="subscriber-email" label="Email">
                    <TextInput id="subscriber-email" onChange={(event) => updateField('email', event.target.value)} required type="email" value={formData.email} />
                    {(submitted || formData.email) && validationErrors.email && <p className="text-[10px] text-error">{validationErrors.email}</p>}
                  </FormField>
                  <FormField id="subscriber-phone" label="Phone">
                    <TextInput id="subscriber-phone" inputMode="numeric" maxLength={10} onChange={(event) => updateDigitsOnlyField('phone', event.target.value, 10)} pattern="\d{10}" required type="tel" value={formData.phone} />
                    {(submitted || formData.phone) && validationErrors.phone && <p className="text-[10px] text-error">{validationErrors.phone}</p>}
                  </FormField>
                  <FormField id="delivery-boy" label="Delivery Boy">
                    <TextInput id="delivery-boy" onChange={(event) => updateField('deliveryBoy', event.target.value)} required value={formData.deliveryBoy} />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant p-stack-md rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-stack-md text-primary">
                <span className="material-symbols-outlined" aria-hidden="true">calendar_today</span>
                <h3 className="font-bold uppercase text-xs">Subscription Plan</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                {subscriptionPlans.map((plan) => (
                  <button
                    key={plan.name}
                    className={`p-3 bg-surface border rounded-lg cursor-pointer transition-all ${formData.subscriptionPlan === plan.name ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant hover:border-primary'}`}
                    onClick={() => updateSubscriptionPlan(plan.name)}
                    type="button"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`material-symbols-outlined ${formData.subscriptionPlan === plan.name ? 'text-primary' : 'text-outline'}`} aria-hidden="true">{plan.icon}</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.subscriptionPlan === plan.name ? 'border-primary' : 'border-outline-variant'}`}>
                        {formData.subscriptionPlan === plan.name && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-left">{plan.name}</h4>
                    <p className="text-xs text-primary font-bold mt-1 text-left">{plan.price}</p>
                    <ul className="mt-3 space-y-1 text-left text-[11px] text-on-surface-variant">
                      {(planBenefits[plan.name] ?? []).map((benefit) => (
                        <li className="flex gap-1.5" key={benefit}>
                          <span className="text-primary font-bold">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="mt-stack-md max-w-2xl space-y-stack-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
                  <FormField id="start-date" label="Start Date">
                    <TextInput id="start-date" onChange={(event) => updateField('startDate', event.target.value)} required type="date" value={formData.startDate} />
                    {submitted && validationErrors.startDate && <p className="text-[10px] text-error">{validationErrors.startDate}</p>}
                  </FormField>
                  <FormField id="subscription-duration" label="Subscription Duration">
                    <SelectInput id="subscription-duration" onChange={(event) => updateField('subscriptionDurationMonths', event.target.value)} value={formData.subscriptionDurationMonths}>
                      {subscriptionDurations.map((duration) => (
                        <option key={duration} value={duration}>{duration} {duration === 1 ? 'Month' : 'Months'}</option>
                    ))}
                  </SelectInput>
                </FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md items-end">
                  <div>
                    <p className="text-[10px] font-bold text-outline uppercase mb-1">Calculated Expiry</p>
                    <div className="inline-flex min-h-8 items-center rounded border border-outline-variant bg-surface px-3 py-1.5">
                      <span className="text-xs font-bold text-on-surface">{formData.expiryDate || 'Select a start date'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-outline uppercase mb-1">Status</p>
                    <span className={`inline-flex min-h-8 items-center px-3 py-1.5 font-bold text-[10px] uppercase rounded border ${getStatusBadgeClassName(statusPreview)}`}>
                      {statusPreview}
                    </span>
                  </div>
                </div>
                <div className="max-w-xs">
                  <FormField id="payment-status" label="Payment Status">
                    <SelectInput id="payment-status" onChange={(event) => updateField('paymentStatus', event.target.value)} value={formData.paymentStatus}>
                      {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </SelectInput>
                  </FormField>
                </div>
              </div>
            </div>
            <button className="sr-only" type="submit">Submit subscriber</button>
          </form>
        </div>
      </PageWrapper>
      <footer className="fixed bottom-0 left-0 md:left-60 right-0 min-h-16 bg-surface border-t border-outline-variant px-container-padding py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between z-40">
        <p className="text-[10px] text-on-surface-variant font-bold uppercase italic">Last modified: Oct 24, 2023</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-on-surface-variant">Demo helper - optional. Keep it if useful, remove anytime.</span>
          <Button className="px-4 py-2 font-bold text-xs uppercase" onClick={handleFillDemoData} variant="secondary">
            Fill Demo Data
          </Button>
          <Button className="px-6 py-2 font-bold text-xs uppercase" onClick={() => navigate('/subscribers')} variant="secondary">
            Cancel
          </Button>
          <Button className="px-8 py-2 font-bold text-xs uppercase" disabled={isLoading || isSubmitting} onClick={handleFooterSubmit}>
            {isCreateMode ? 'Create Subscriber' : 'Save Subscriber'}
          </Button>
        </div>
      </footer>
    </>
  )
}
