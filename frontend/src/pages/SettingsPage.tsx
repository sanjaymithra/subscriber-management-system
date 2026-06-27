import { getCurrentDemoUser } from '../api/authApi'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useDashboardData } from '../hooks/useDashboardData'
import { defaultPaymentFilters, usePaymentsData } from '../hooks/usePaymentsData'

function Toggle({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-outline-variant bg-surface-container-low px-3 py-2">
      <span className="text-sm text-on-surface">{label}</span>
      <span className={`h-5 w-10 rounded-full p-0.5 ${checked ? 'bg-primary' : 'bg-outline-variant'}`} aria-label={`${label} ${checked ? 'enabled' : 'disabled'}`} role="switch" aria-checked={checked}>
        <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`}></span>
      </span>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-outline uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
    </div>
  )
}

export function SettingsPage() {
  const user = getCurrentDemoUser()
  const { data: dashboardData, isError: isDashboardError } = useDashboardData()
  const { data: paymentData, isError: isPaymentError } = usePaymentsData(defaultPaymentFilters)

  return (
    <PageWrapper className="p-container-padding space-y-gutter">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Settings</h2>
        <p className="text-sm text-on-surface-variant">Office preferences and system information for the management portal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <section className="bg-white border border-outline-variant p-stack-md">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">General</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingRow label="Office Name" value="Telangana Today Circulation Office" />
            <SettingRow label="Contact Number" value="+91 98765 43210" />
            <SettingRow label="Office Address" value="Hyderabad, Telangana" />
            <SettingRow label="Default Currency" value="₹ Indian Rupee" />
            <SettingRow label="Time Zone" value="Asia/Kolkata" />
          </div>
        </section>

        <section className="bg-white border border-outline-variant p-stack-md">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Subscription Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingRow label="Default Duration" value="12 Months" />
            <SettingRow label="Grace Period" value="7 Days" />
            <SettingRow label="Default Payment Method" value="Cash" />
          </div>
        </section>

        <section className="bg-white border border-outline-variant p-stack-md">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <Toggle checked label="Renewal Reminders" />
            <Toggle checked label="Payment Alerts" />
            <Toggle checked label="System Notifications" />
          </div>
        </section>

        <section className="bg-white border border-outline-variant p-stack-md">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Appearance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingRow label="Application Version" value="1.0.0" />
            <SettingRow label="Current Role" value={user.role} />
            <SettingRow label="Build Information" value="React + Vite production build" />
          </div>
        </section>

        <section className="bg-white border border-outline-variant p-stack-md lg:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">System Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SettingRow label="Total Subscribers" value={(dashboardData?.stats.totalSubscribers ?? 0).toLocaleString()} />
            <SettingRow label="Total Payments" value={(paymentData?.meta.total ?? 0).toLocaleString()} />
            <SettingRow label="Database Status" value={isDashboardError || isPaymentError ? 'Needs Attention' : 'Connected'} />
            <SettingRow label="Server Status" value={isDashboardError || isPaymentError ? 'Unavailable' : 'Online'} />
          </div>
        </section>

        <section className="bg-white border border-outline-variant p-stack-md lg:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">About</h3>
          <p className="font-bold text-on-surface">Subscriber Database & Renewal Management System</p>
          <p className="mt-1 text-sm text-on-surface-variant">Version 1.0. Built using React, Express, TypeScript, Prisma, and PostgreSQL.</p>
          <p className="mt-3 text-sm text-on-surface-variant">Purpose: manage newspaper subscribers, payments, renewals, and reports.</p>
        </section>
      </div>
    </PageWrapper>
  )
}
