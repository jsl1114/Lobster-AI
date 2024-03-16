import { useUser } from '@clerk/nextjs'

const SettingsPanel = () => {
  const user = useUser().user
  return (
    <div className='px-4 lg:px-8 flex flex-col items-start gap-x-3 mb-8'>
      <h1 className='text-3xl'>
        Welcome, {user?.firstName} {user?.lastName}.
      </h1>
      <pre>email: {user?.emailAddresses[0].emailAddress}</pre>
    </div>
  )
}
export default SettingsPanel
