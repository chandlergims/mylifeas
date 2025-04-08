import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import { cookies } from 'next/headers';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import User from '@/models/User';
import dbConnect from './mongodb';

// Generate a random nonce
export function generateNonce(): string {
  return randomBytes(32).toString('hex');
}

// Verify Ethereum signature
export function verifySignature(address: string, nonce: string, signature: string): boolean {
  try {
    const signerAddress = ethers.utils.verifyMessage(
      `Sign this message to authenticate with our app: ${nonce}`,
      signature
    );
    
    return signerAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

// Get or create user
export async function getOrCreateUser(address: string): Promise<any> {
  await dbConnect();
  
  // Normalize the address
  const normalizedAddress = address.toLowerCase();
  
  // Find existing user or create a new one
  let user = await User.findOne({ address: normalizedAddress });
  
  if (!user) {
    // Create a new user with a fresh nonce
    user = await User.create({
      address: normalizedAddress,
      nonce: generateNonce(),
    });
  } else {
    // Update the nonce for existing user
    user.nonce = generateNonce();
    await user.save();
  }
  
  return user;
}

// Set auth cookie - this should be used in a Server Action or Route Handler
export async function setAuthCookie(response: Response, userId: string): Promise<Response> {
  response.headers.set('Set-Cookie', 
    `auth_token=${userId}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; ${
      process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
    }SameSite=Lax`
  );
  return response;
}

// Get current user from cookie
export async function getCurrentUser() {
  try {
    // In Next.js App Router, cookies() returns the cookies from the request
    // This function should be called in a Server Component or Route Handler
    const cookiesList = cookies();
    const authToken = cookiesList.get('auth_token')?.value;
    
    if (!authToken) {
      return null;
    }
    
    await dbConnect();
    const user = await User.findById(authToken);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Create a response with cleared auth cookie
export function createLogoutResponse(redirectUrl: string = '/'): Response {
  const response = Response.redirect(new URL(redirectUrl, 'http://localhost:3000'));
  response.headers.set('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0');
  return response;
}
