'use client'

import axios from 'axios'
import * as z from 'zod'
import { Heading } from '@/components/heading'
import { MessageSquareCode } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { Empty } from '@/components/empty'
import { Loader } from '@/components/loader'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/user-avatar'
import { BotAvatar } from '@/components/bot-avatar'

import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

import { useProModal } from '@/hooks/use-pro-modal'
import toast from 'react-hot-toast'

const CodePage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      }
      const newMessages = [...messages, userMessage]

      const res = await axios.post('/api/code', {
        messages: newMessages,
      })

      setMessages((current) => [...current, userMessage, res.data])

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
        title='Code Generation'
        description='Let Lobster code for you!'
        icon={MessageSquareCode}
        iconColor='text-red-500'
        bgColor='bg-red-500/10'
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
                      placeholder='Simple toggle button using react hooks.'
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
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label='start typing to ask the magic lobster!' />
          )}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((m) => (
              <div
                key={m.content}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  m.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}
              >
                {m.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className='overflow-auto w-full my-2 bg-orange-500/10 p-2 rounded-lg'>
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className='bg-red-500/10 rounded-lg p-1 text-red-500'
                        {...props}
                      />
                    ),
                    span: ({ node, className, ...props }) => {
                      const match = /katex/.exec(className || '')
                      return match ? (
                        <span
                          {...props}
                          className={className + ' text-[#6F63F1]'}
                        />
                      ) : (
                        <span
                          {...props}
                          className={className}
                        />
                      )
                    },
                  }}
                  className='text-sm overflow-hidden leading-7'
                >
                  {m.content.startsWith('```markdown')
                    ? m.content.trim.endsWith('```')
                      ? m.content.slice(11, -5)
                      : m.content.slice(11)
                    : m.content}
                </Markdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default CodePage
