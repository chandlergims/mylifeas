import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comic from '@/models/Comic';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userAddress = user.address;
    const comicId = params.id;
    
    const data = await req.json();
    const { action } = data; // 'like' or 'dislike'
    
    if (!action || (action !== 'like' && action !== 'dislike')) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "like" or "dislike"' },
        { status: 400 }
      );
    }
    
    const comic = await Comic.findById(comicId);
    if (!comic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }
    
    // Check if user has already liked or disliked
    const hasLiked = comic.likedBy.includes(userAddress);
    const hasDisliked = comic.dislikedBy.includes(userAddress);
    
    // Handle like action
    if (action === 'like') {
      if (hasLiked) {
        // User already liked, so remove the like (toggle off)
        comic.likes = Math.max(0, comic.likes - 1);
        comic.likedBy = comic.likedBy.filter((addr: string) => addr !== userAddress);
      } else {
        // Add like
        comic.likes += 1;
        comic.likedBy.push(userAddress);
        
        // If user previously disliked, remove the dislike
        if (hasDisliked) {
          comic.dislikes = Math.max(0, comic.dislikes - 1);
          comic.dislikedBy = comic.dislikedBy.filter((addr: string) => addr !== userAddress);
        }
      }
    }
    
    // Handle dislike action
    if (action === 'dislike') {
      if (hasDisliked) {
        // User already disliked, so remove the dislike (toggle off)
        comic.dislikes = Math.max(0, comic.dislikes - 1);
        comic.dislikedBy = comic.dislikedBy.filter((addr: string) => addr !== userAddress);
      } else {
        // Add dislike
        comic.dislikes += 1;
        comic.dislikedBy.push(userAddress);
        
        // If user previously liked, remove the like
        if (hasLiked) {
          comic.likes = Math.max(0, comic.likes - 1);
          comic.likedBy = comic.likedBy.filter((addr: string) => addr !== userAddress);
        }
      }
    }
    
    await comic.save();
    
    return NextResponse.json({
      success: true,
      likes: comic.likes,
      dislikes: comic.dislikes,
      hasLiked: comic.likedBy.includes(userAddress),
      hasDisliked: comic.dislikedBy.includes(userAddress),
    });
  } catch (error) {
    console.error('Error voting on comic:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
