import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getCurrentDemoUser } from '../api/authApi'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'

export function ProfilePage() {
  const navigate = useNavigate()
  const user = getCurrentDemoUser()
  const fullName = user.role === 'Staff' ? 'Staff User' : 'Admin User'

  return (
    <PageWrapper className="p-container-padding space-y-gutter">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Profile</h2>
        <p className="text-sm text-on-surface-variant">Read-only demo account information.</p>
      </div>
      <section className="bg-white border border-outline-variant p-stack-md">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-24 h-24 rounded-full bg-primary-container border border-outline-variant flex items-center justify-center text-primary text-3xl font-bold">
            {user.role.slice(0, 1)}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><p className="text-[10px] font-bold text-outline uppercase">Full Name</p><p className="font-bold">{fullName}</p></div>
            <div><p className="text-[10px] font-bold text-outline uppercase">Email</p><p>{user.email}</p></div>
            <div><p className="text-[10px] font-bold text-outline uppercase">Role</p><p>{user.role}</p></div>
            <div><p className="text-[10px] font-bold text-outline uppercase">Status</p><p className="text-green-600 font-bold">Active</p></div>
            <div><p className="text-[10px] font-bold text-outline uppercase">Last Login</p><p>{new Date().toLocaleString()}</p></div>
            <div><p className="text-[10px] font-bold text-outline uppercase">Account Created</p><p>Demo seed account</p></div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="px-4 py-2 text-xs font-bold uppercase" icon="edit" onClick={() => toast.info('Profile editing is read-only in this demo.')} variant="secondary">Edit Profile</Button>
          <Button className="px-4 py-2 text-xs font-bold uppercase" icon="lock_reset" onClick={() => toast.info('Password changes are disabled for seeded demo accounts.')} variant="secondary">Change Password</Button>
          <Button className="px-4 py-2 text-xs font-bold uppercase" icon="logout" onClick={() => {
            window.sessionStorage.removeItem('demoUser')
            navigate('/login')
          }}>Logout</Button>
        </div>
      </section>
    </PageWrapper>
  )
}
