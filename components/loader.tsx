import Image from 'next/image'

interface LoaderProps {
  message?: string
}

export const Loader = ({ message }: LoaderProps) => {
  return (
    <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
      <div className='w-10 h-10 relative animate-bounce'>
        <Image
          alt='logo'
          fill
          src='/logo.png'
        />
      </div>
      <p className='text-sm text-muted-foreground'>Lobster is thinking...</p>
      <em className='text-sm text-muted-foreground'>{message}</em>
    </div>
  )
}
