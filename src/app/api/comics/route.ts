import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comic from '@/models/Comic';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '9', 10);
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { isPublic: true };
    
    // Add search functionality
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }
    
    // Count total documents for pagination info
    const total = await Comic.countDocuments(query);
    
    // Build sort object
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Get comics with pagination, sorting, and filtering
    const comics = await Comic.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('creator', 'address')
      .lean();
    
    return NextResponse.json({ 
      comics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comics' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const data = await req.json();
    const { title, creator, creatorAddress, imageUrl, settings, isPublic } = data;
    
    if (!title || !creator || !creatorAddress || !imageUrl || !settings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const comic = await Comic.create({
      title,
      creator: new mongoose.Types.ObjectId(creator),
      creatorAddress,
      imageUrl,
      settings,
      isPublic: isPublic !== undefined ? isPublic : true,
    });
    
    return NextResponse.json({ comic }, { status: 201 });
  } catch (error) {
    console.error('Error creating comic:', error);
    return NextResponse.json(
      { error: 'Failed to create comic' },
      { status: 500 }
    );
  }
}
