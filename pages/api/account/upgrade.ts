// pages/api/account/upgrade.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { getSession } from 'next-auth/react';

export default async function upgradeHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure user is signed in
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // We read 'newPlan' from the request body
    const { newPlan } = req.body;

    // If the frontend sends newPlan='cancel', we do nothing
    if (newPlan === 'cancel') {
      return res.status(200).json({
        message: 'User canceled upgrade – no changes made',
        membership: session.user.membership,
      });
    }

    // Connect to DB
    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user chooses premium, set membership to 'premium'
    // Otherwise, set membership to 'basic'
    if (newPlan === 'premium') {
      user.membership = 'premium';
      // In production, confirm payment with Stripe or another provider
    } else {
      user.membership = 'basic';
    }

    await user.save();

    return res.status(200).json({ membership: user.membership });
  } catch (error) {
    console.error('Upgrade error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
