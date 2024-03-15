import { Avatar, AvatarImage } from './ui/avatar'

export const BotAvatar = () => {
  return (
    <Avatar className='h-9 w-9 bg-red-500/10'>
      <AvatarImage
        src='/logo.png'
        className='p-1'
      />
    </Avatar>
  )
}
