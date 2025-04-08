import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateNonce } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Ethereum address is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Normalize the address
    const normalizedAddress = address.toLowerCase();
    
    // Find or create the user
    let user = await User.findOne({ address: normalizedAddress });
    
    if (!user) {
      // Create a new user
      user = await User.create({
        address: normalizedAddress,
        nonce: generateNonce(), // Still generate a nonce for future use if needed
      });
    }
    
    // Create a response with the auth cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        address: user.address,
      }
    });
    
    // Set the auth cookie
    response.cookies.set('auth_token', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Failed to verify signature' },
      { status: 500 }
    );
  }
}
