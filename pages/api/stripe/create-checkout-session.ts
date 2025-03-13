// pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Replace with your real Price ID from Stripe dashboard
    const priceId = 'prod_Rw9KVCnCUEfsuG';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/plan`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe checkout session:', err);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
}
