import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'

const Navbar = async () => {
  const isPro = await checkSubscription()
  return (
    <div className='flex items-center p-4'>
      <MobileSidebar
        isPro={isPro}
        apiLimitCount={await getApiLimitCount()}
      />
      <div className='flex w-full justify-end'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  )
}
export default Navbar
