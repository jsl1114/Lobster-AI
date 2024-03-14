export default function Page({ params }: { params: { post: string } }) {
  return (
    <>
      <div className='h-screen justify-center items-center flex flex-col'>
        <h1 className='text-8xl text-yellow-500 '>/{params.post}</h1>
        <p>is not implemented yet</p>
      </div>
    </>
  )
}
