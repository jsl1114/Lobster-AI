'use client'

import axios from 'axios'
import * as z from 'zod'
import { Heading } from '@/components/heading'
import { Music4 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'
import Image from 'next/image'
import { useProModal } from '@/hooks/use-pro-modal'
import toast from 'react-hot-toast'

const MusicPage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [music, setMusic] = useState<string>()
  const [spectrogram, setSpectrogram] = useState<string>()
  const [prompt, setPrompt] = useState<string>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined)
      setSpectrogram(undefined)
      setPrompt(undefined)

      const response = await axios.post('/api/music', values)

      setMusic(response.data.audio)
      setSpectrogram(response.data.spectrogram)
      setPrompt(values.prompt)
      form.reset()
    } catch (err: any) {
      if (err?.response?.status === 403) {
        proModal.onOpen()
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        title='Music Generation'
        description='Let Lobster compose some music for you'
        icon={Music4}
        iconColor='text-emerald-400'
        bgColor='bg-emerald-400/10'
      />
      <div className='px-4 lg:px-8'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
          >
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='col-span-12 lg:col-span-10'>
                  <FormControl className='m-0 p-0'>
                    <Input
                      className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                      disabled={isLoading}
                      placeholder='Write a piano solo'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className='col-span-12 lg:col-span-2 w-full'
              disabled={isLoading}
            >
              Send
            </Button>
          </form>
        </Form>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader message='note: music generation usually takes 1-2 minutes... hang on!' />
            </div>
          )}
          {!music && !isLoading && <Empty label='No music generated' />}
          {music && spectrogram && (
            <div className='relative flex flex-col mt-8 w-full items-center justify-center'>
              <em className='text-sm'>{prompt}</em>
              <Image
                src={spectrogram}
                alt='spectrogram'
                width={200}
                height={200}
                className='mb-5'
              />
              <audio
                className='w-full'
                controls
              >
                <source src={music} />
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default MusicPage
