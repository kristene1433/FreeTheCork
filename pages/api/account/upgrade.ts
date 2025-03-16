// pages/api/account/upgrade.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function upgradeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  const email = session?.user?.email; // Use optional chaining

  if (!email) {
    return res.status(401).json({ error: 'Not authenticated or missing email' });
  }

  try {
    await dbConnect();

    // find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { newPlan } = req.body;

    // 1) Downgrade/Stay on Basic
    if (newPlan === 'basic') {
      user.membership = 'basic';
      await user.save();
      return res.status(200).json({
        membership: 'basic',
        message: 'Membership updated to Basic',
      });
    }

    // 2) Upgrade to Premium
    if (newPlan === 'premium') {
      // In a real app, you'd typically rely on your Stripe webhook
      // or a completed Stripe checkout session. Here, we do it directly:
      user.membership = 'premium';
      await user.save();
      return res.status(200).json({
        membership: 'premium',
        message: 'Membership updated to Premium',
      });
    }

    // 3) If the newPlan is neither 'basic' nor 'premium'
    return res.status(400).json({
      error: 'Invalid plan choice. Must be "basic" or "premium".',
    });
  } catch (err) {
    console.error('Upgrade Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
