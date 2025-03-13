// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro'; // Requires npm install micro @types/micro
import Stripe from 'stripe';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

// Tell Next.js not to parse the body (Stripe needs raw bytes)
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export default async function webhookHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event: Stripe.Event;
  const sig = req.headers['stripe-signature'] as string;

  // Read the raw body from the request
  const buf = await buffer(req);

  try {
    // Construct the Stripe event
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    } else {
      console.error('Unknown webhook verification error:', err);
      return res.status(400).send('Webhook Error: unknown error');
    }
  }

  // Connect to MongoDB
  await dbConnect();

  // Handle the event type
  switch (event.type) {
    case 'checkout.session.completed':
      // The checkout session is complete, but subscription may not be fully active
      // Could store session ID or link to user here if needed
      break;

    case 'invoice.paid': {
      // Subscription is fully active
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      if (customerId) {
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.membership = 'premium';
          await user.save();
          console.log(`User ${user.email} is now premium.`);
        }
      }
      break;
    }

    case 'invoice.payment_failed':
      // Payment failed - you might downgrade or mark membership as 'basic'
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return res.json({ received: true });
}
