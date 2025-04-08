import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comic from '@/models/Comic';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const comicId = params.id;
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Find the comic
    const comic = await Comic.findById(comicId);
    
    if (!comic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the creator of the comic
    if (comic.creatorAddress !== user.address) {
      return NextResponse.json(
        { error: 'Not authorized to delete this comic' },
        { status: 403 }
      );
    }
    
    // Delete the comic
    await Comic.findByIdAndDelete(comicId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comic:', error);
    return NextResponse.json(
      { error: 'Failed to delete comic' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const comicId = params.id;
    
    // Get user session to check if they've voted
    const user = await getCurrentUser();
    const userAddress = user?.address;
    
    // Find the comic by ID
    const comic = await Comic.findById(comicId);
    
    if (!comic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }
    
    // Check if user has voted on this comic
    let userVote = null;
    if (userAddress) {
      if (comic.likedBy.includes(userAddress)) {
        userVote = 'like';
      } else if (comic.dislikedBy.includes(userAddress)) {
        userVote = 'dislike';
      }
    }
    
    return NextResponse.json({
      comic,
      userVote
    });
  } catch (error) {
    console.error('Error fetching comic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comic' },
      { status: 500 }
    );
  }
}
