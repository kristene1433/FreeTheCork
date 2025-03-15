import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const priceId = 'price_1R2H24G3CmMC7BS0Z0cst8Jy'; // your actual Price ID

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Where they go upon success
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Where they go if they cancel or close the checkout
      cancel_url: `${process.env.NEXTAUTH_URL}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe checkout session:', err);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
}

