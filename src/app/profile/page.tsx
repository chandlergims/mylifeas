'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { showError, showSuccess } from '@/utils/toast';

interface MyLifeAs {
  _id: string;
  title: string;
  creatorAddress: string;
  imageUrl: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [comics, setComics] = useState<MyLifeAs[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9);
  const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});

  // Handle comic deletion
  const handleDelete = async (comicId: string) => {
    if (!user) {
      showError('Please connect your wallet to delete My Life As');
      return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this My Life As?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comics/${comicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      // Remove the comic from the state
      setComics(prevComics => prevComics.filter(comic => comic._id !== comicId));
      showSuccess('My Life As deleted successfully');
    } catch (err) {
      console.error('Error deleting comic:', err);
      showError('Failed to delete. Please try again.');
    }
  };

  // Handle voting (like/dislike)
  const handleVote = async (comicId: string, action: 'like' | 'dislike') => {
    if (!user) {
      showError('Please connect your wallet to vote on comics');
      return;
    }

    try {
      const response = await fetch(`/api/comics/${comicId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      
      // Update the comics state with new vote counts
      setComics(prevComics => 
        prevComics.map(comic => 
          comic._id === comicId 
            ? { ...comic, likes: data.likes, dislikes: data.dislikes } 
            : comic
        )
      );

      // Update user votes state
      setUserVotes(prev => ({
        ...prev,
        [comicId]: data.hasLiked ? 'like' : data.hasDisliked ? 'dislike' : null
      }));
    } catch (err) {
      console.error('Error voting:', err);
      showError('Failed to register your vote. Please try again.');
    }
  };

  // Fetch user's comics
  useEffect(() => {
    const fetchUserComics = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch comics created by the current user (set a high limit to get all comics)
        const response = await fetch(`/api/comics?creatorAddress=${user.address}&limit=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch your comics');
        }
        
        const data = await response.json();
        setComics(data.comics || []);
      } catch (err) {
        console.error('Error fetching user comics:', err);
        showError('Failed to load your comics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserComics();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#f0b90b] border-r-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-[#e9e3d9] p-8 rounded-xl border border-[#d0c3b1] max-w-md w-full text-center">
          <svg className="w-16 h-16 text-[#f0b90b] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-[#3c3c3c] mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your profile and comics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#e9e3d9] rounded-xl overflow-hidden border border-[#d0c3b1] mb-8">
          {/* Profile Header */}
          <div className="bg-[#f0b90b] p-6">
            <div className="flex items-center">
              <div className="bg-[#e9e3d9] w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-[#f0b90b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#3c3c3c]" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>Your Profile</h1>
            </div>
          </div>
          
          {/* Wallet Address */}
          <div className="p-6">
            <div className="flex items-center space-x-2 text-[#f0b90b] mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="font-mono text-sm">{user.address}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(user.address);
                  import('@/utils/toast').then(({ showSuccess }) => {
                    showSuccess('Address copied to clipboard!');
                  });
                }}
                className="text-[#f0b90b] hover:text-[#f0b90b]/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            
            <div className="border-t border-[#d0c3b1] my-6"></div>
            
            <div className="flex justify-center gap-16">
              <div className="text-center">
                <div className="text-sm text-[#3c3c3c]/70 mb-1">Total My Life As</div>
                <div className="text-xl font-bold text-[#3c3c3c]">{comics.length}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-[#3c3c3c]/70 mb-1">Member Since</div>
                <div className="text-xl font-bold text-[#3c3c3c]">Apr 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#e9e3d9] rounded-xl shadow-md overflow-hidden border border-[#d0c3b1]">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3c3c3c]" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>Your My Life As</h2>
              <Link 
                href="/create" 
                className="inline-flex items-center px-4 py-2 border border-[#f0b90b]/20 text-sm font-medium rounded-md text-[#f0b90b] bg-[#f0b90b]/10 hover:bg-[#f0b90b]/20 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New My Life As
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#f0b90b] border-r-transparent"></div>
                <p className="mt-4 text-[#3c3c3c] text-lg">Loading your My Life As...</p>
              </div>
            ) : comics.length === 0 ? (
              <div className="text-center py-16 bg-[#e9e3d9] rounded-xl shadow-sm border border-[#d0c3b1] p-8">
                <div className="bg-[#fff8e1] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg 
                    className="w-16 h-16 text-[#f0b90b]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#3c3c3c] mb-2">No My Life As Yet!</h3>
                <p className="text-lg text-gray-600 mb-6">You haven't created any My Life As yet.</p>
                <Link 
                  href="/create" 
                  className="inline-flex items-center px-6 py-3 border border-[#d0c3b1] text-base font-medium rounded-full text-white bg-[#f0b90b] transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First My Life As
                </Link>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${displayCount > 9 ? 'max-h-[800px] overflow-y-auto pr-2' : ''}`}>
                  {comics.slice(0, displayCount).map((comic) => (
                    <div 
                      key={comic._id} 
                      className="bg-[#e9e3d9] border border-[#d0c3b1] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="relative aspect-[1/1.1] overflow-hidden group">
                        {/* Comic Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={comic.imageUrl} 
                          alt={comic.title} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Delete Button Overlay */}
                        <button
                          onClick={() => handleDelete(comic._id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          title="Delete My Life As"
                        >
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                            />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="p-3 bg-[#e9e3d9]">
                        {/* Title */}
                        <h3 className="text-sm font-medium text-[#3c3c3c] mb-2 truncate">
                          {comic.title}
                        </h3>
                        
                        {/* Creation Time in EST */}
                        <div className="text-xs text-gray-500 mb-2">
                          {new Date(comic.createdAt).toLocaleString('en-US', {
                            timeZone: 'America/New_York',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })} EST
                        </div>
                        
                        <div className="flex justify-between items-center">
                          {/* Like/Dislike Buttons */}
                          <div className="flex space-x-3">
                            {/* Like Button */}
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVote(comic._id, 'like');
                              }}
                              className={`flex items-center space-x-1 ${
                                userVotes[comic._id] === 'like' 
                                  ? 'text-[#3b82f6]' 
                                  : 'text-gray-500 hover:text-[#3b82f6]'
                              } transition-all duration-200 cursor-pointer`}
                              disabled={isLoading}
                            >
                              <svg 
                                className="w-4 h-4" 
                                fill={userVotes[comic._id] === 'like' ? 'currentColor' : 'none'} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={1.5} 
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                                />
                              </svg>
                              <span className="text-xs">{comic.likes}</span>
                            </button>
                            
                            {/* Dislike Button */}
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVote(comic._id, 'dislike');
                              }}
                              className={`flex items-center space-x-1 ${
                                userVotes[comic._id] === 'dislike' 
                                  ? 'text-[#ef4444]' 
                                  : 'text-gray-500 hover:text-[#ef4444]'
                              } transition-all duration-200 cursor-pointer`}
                              disabled={isLoading}
                            >
                              <svg 
                                className="w-4 h-4" 
                                fill={userVotes[comic._id] === 'dislike' ? 'currentColor' : 'none'} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={1.5} 
                                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" 
                                />
                              </svg>
                              <span className="text-xs">{comic.dislikes}</span>
                            </button>
                          </div>
                          
                          {/* Creator Address */}
                          <span className="text-xs text-[#f0b90b]">
                            {comic.creatorAddress.substring(0, 4)}...{comic.creatorAddress.substring(comic.creatorAddress.length - 4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {comics.length > displayCount && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setDisplayCount(prev => prev + 9)}
                      className="px-6 py-2 bg-[#f0b90b]/10 text-[#f0b90b] border border-[#f0b90b]/20 rounded-md hover:bg-[#f0b90b]/20 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
