import { Heading } from '@/components/heading'
import SettingsPanel from '@/components/settings-panel'
import { Settings } from 'lucide-react'

const SettingsPage = () => {
  return (
    <div>
      <Heading
        title='Settings'
        description='Customize your own experience'
        icon={Settings}
        iconColor='text-gray-700'
        bgColor='bg-gray-700/10'
      />
      <SettingsPanel />
    </div>
  )
}
export default SettingsPage
