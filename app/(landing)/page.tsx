import { Button } from '@/components/ui/button'
import Link from 'next/link'

const LandingPage = () => {
  return (
    <div>
      <h1 className='text-white'>Landing page not implemented yet</h1>
      <Link
        href='/dashboard'
        className='pr-10'
      >
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  )
}
export default LandingPage
