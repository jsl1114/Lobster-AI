import { checkSubscription } from '@/lib/subscription'
import { SubscriptionButton } from './subscription_button'

const SettingsPanel = async () => {
  const isPro = await checkSubscription()

  return (
    <div className='px-4 lg:px-8 space-y-4'>
      <div className='text-muted-foreground text-sm'>
        {isPro
          ? 'You are subscribed to Lobster Pro'
          : 'You are currently on a free plan'}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  )
}
export default SettingsPanel
