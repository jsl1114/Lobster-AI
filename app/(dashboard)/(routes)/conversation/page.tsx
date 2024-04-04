'use client'

import axios from 'axios'
import * as z from 'zod'
import { Heading } from '@/components/heading'
import { Divide, MessagesSquare } from 'lucide-react'
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
import { useProModal } from '@/hooks/use-pro-modal'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const ConversationPage = () => {
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

      const res = await axios.post('/api/conversation', {
        messages: newMessages,
      })

      setMessages((current) => [...current, userMessage, res.data])

      form.reset()
    } catch (err: any) {
      if (err?.response?.status === 403) {
        proModal.onOpen()
      }
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        title='Conversation'
        description='Our most advanced conversation model'
        icon={MessagesSquare}
        iconColor='text-violet-500'
        bgColor='bg-violet-500/10'
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
                      placeholder='How to pass AIT?'
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
                {/* <p className='text-sm'>{m.content}</p> */}
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h3: ({ node, ...props }) => (
                      <h3
                        className='text-red-600 text-2xl font-mono font-semibold'
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className='text-blue-500 bg-cyan-500/10'
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className='border-2 border-dotted border-[#FA7878] rounded-lg'
                        {...props}
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className='border-2 border-dotted border-[#FA7878] rounded-lg'
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
                  className='overflow-hidden leading-7'
                >
                  {m.content}
                </Markdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ConversationPage
