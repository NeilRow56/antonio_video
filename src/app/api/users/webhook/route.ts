import { db } from '@/db'
import { users } from '@/db/schema'
import { WebhookEvent } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env'
    )
  }
  // Create a new Svix instance with secret

  const wh = new Webhook(SIGNING_SECRET)

  //Get Headers

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  // If there arte no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get Body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error occurred', {
      status: 400
    })
  }
  // Do Something with payload

  // This may need tweaking for email and password users - you can set Clerk so that a user must enter first name and last name.
  //e.g  const name = `${event.data.first_name} ${event.data.last_name}`.trim()
  //    if (email == null) return new Response('No email', { status: 400 })
  //      if (name === '') return new Response('No name', { status: 400 })
  // See wed_dev_course

  const eventType = event.type

  if (eventType === 'user.created') {
    const { data } = event
    await db.insert(users).values({
      clerkId: data.id,
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url
    })
  }

  if (eventType === 'user.deleted') {
    const { data } = event

    if (!data.id) {
      return new Response('Missing user id', { status: 400 })
    }

    await db.delete(users).where(eq(users.clerkId, data.id))
  }

  if (eventType === 'user.updated') {
    const { data } = event
    await db
      .update(users)
      .set({
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url
      })
      .where(eq(users.clerkId, data.id))
  }

  return new Response('Webhook Received', { status: 200 })
}
