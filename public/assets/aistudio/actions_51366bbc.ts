'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export type WishResult = {
  ok: boolean
  message: string
  fieldErrors?: Partial<Record<'recipient' | 'sender' | 'message' | 'tone', string>>
}

const cleanText = (value: FormDataEntryValue | null, max: number) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''

export async function submitFestivalWish(
  _previous: WishResult,
  formData: FormData,
): Promise<WishResult> {
  const recipient = cleanText(formData.get('recipient'), 80)
  const sender = cleanText(formData.get('sender'), 80)
  const message = cleanText(formData.get('message'), 500)
  const rawTone = cleanText(formData.get('tone'), 20)
  const tone = ['warm', 'joyful', 'traditional'].includes(rawTone)
    ? (rawTone as 'warm' | 'joyful' | 'traditional')
    : null

  const fieldErrors: WishResult['fieldErrors'] = {}
  if (recipient.length < 2) fieldErrors.recipient = 'Enter a recipient name.'
  if (sender.length < 2) fieldErrors.sender = 'Enter your name.'
  if (message.length < 12) fieldErrors.message = 'Write a wish of at least 12 characters.'
  if (!tone) fieldErrors.tone = 'Choose a greeting mood.'

  if (Object.keys(fieldErrors).length) {
    return { ok: false, message: 'Please review the highlighted details.', fieldErrors }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'festival-wishes',
      data: { recipient, sender, message, tone: tone! },
      draft: false,
      overrideAccess: false,
    })
    return { ok: true, message: 'Your wish is glowing on our digital wall of light.' }
  } catch {
    return { ok: false, message: 'Your wish could not be saved. Please try again.' }
  }
}
