import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateNonce } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Ethereum address is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    
    // Normalize the address
    const normalizedAddress = address.toLowerCase();
    
    // Find or create user
    let user = await User.findOne({ address: normalizedAddress });
    
    if (!user) {
      // Create a new user with a nonce
      const nonce = generateNonce();
      user = await User.create({
        address: normalizedAddress,
        nonce,
      });
    } else {
      // Update existing user with a new nonce
      user.nonce = generateNonce();
      await user.save();
    }
    
    return NextResponse.json({ nonce: user.nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}
