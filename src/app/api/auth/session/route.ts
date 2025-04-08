import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ user: null });
    }
    
    await dbConnect();
    
    const user = await User.findById(authToken);
    
    if (!user) {
      // Clear the invalid cookie
      const response = NextResponse.json({ user: null });
      response.cookies.delete('auth_token');
      return response;
    }
    
    return NextResponse.json({
      user: {
        id: user._id,
        address: user.address,
      }
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}
