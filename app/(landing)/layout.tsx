const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='h-screen bg-[#111827] overflow-auto'>
      <div className='h-screen w-screen flex flex-col items-center justify-center'>
        {children}
      </div>
    </main>
  )
}

export default LandingLayout
