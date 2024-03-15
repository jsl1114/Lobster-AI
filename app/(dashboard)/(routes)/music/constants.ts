import * as z from 'zod'

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Prompt is required',
  }),
})

export const sampleMusicRes = {
  audio:
    'https://replicate.delivery/pbxt/2aTOnjVQoEbeDCtriN8g2xfoO14Wwz6B4DyuvTW2v93qLXgSA/gen_sound.wav',
  spectrogram:
    'https://replicate.delivery/pbxt/Opkj8ufeD7gAj0lZdkYWAP6WHOfnYKmj4jpvHtyf0WJuucBKB/spectrogram.jpg',
}
