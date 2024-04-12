const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='h-screen bg-[#1A1A20] overflow-auto'>
      <div className='mx-auto max-w-screen-xl h-full w-full'>{children}</div>
    </main>
  )
}

export default LandingLayout
