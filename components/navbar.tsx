import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'
import { getApiLimitCount } from '@/lib/api-limit'

const Navbar = async () => {
  return (
    <div className='flex items-center p-4'>
      <MobileSidebar apiLimitCount={await getApiLimitCount()} />
      <div className='flex w-full justify-end'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  )
}
export default Navbar
