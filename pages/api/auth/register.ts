// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';

export default async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    email, 
    password, 
    plan, 
    fullName, 
    address, 
    city, 
    state, 
    zip 
    // cardNumber, expDate, cvc -> we do NOT store 
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // membership is 'premium' if user chooses plan='premium'
    const membership = plan === 'premium' ? 'premium' : 'basic';

    const newUser = new User({
      email,
      passwordHash,
      membership,
      fullName,
      address,
      city,
      state,
      zip
    });

    await newUser.save();
    return res.status(201).json({ message: 'User created', membership });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
