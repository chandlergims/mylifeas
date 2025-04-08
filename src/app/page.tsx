'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { showError, showSuccess } from '@/utils/toast';

interface Comic {
  _id: string;
  title: string;
  creatorAddress: string;
  imageUrl: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const [comics, setComics] = useState<Comic[]>([]);
  const [topComics, setTopComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Fetch comics with filters and pagination
  const fetchComics = async (page = 1, replace = true) => {
    try {
      setLoading(page === 1);
      setLoadingMore(page > 1);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('search', searchQuery); // Always send search parameter, even if empty
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('limit', '12');
      
      const response = await fetch(`/api/comics?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comics');
      }
      
      const data = await response.json();
      
      if (replace) {
        setComics(data.comics || []);
      } else {
        // Add new comics while avoiding duplicates
        setComics(prev => {
          const existingIds = new Set(prev.map(comic => comic._id));
          const newComics = (data.comics || []).filter((comic: Comic) => !existingIds.has(comic._id));
          return [...prev, ...newComics];
        });
      }
      
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load comics. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch top comics by likes
  const fetchTopComics = async () => {
    try {
      const params = new URLSearchParams();
      params.append('sortBy', 'likes');
      params.append('sortOrder', 'desc');
      params.append('limit', '3');
      
      const response = await fetch(`/api/comics?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top comics');
      }
      
      const data = await response.json();
      setTopComics(data.comics || []);
    } catch (err) {
      console.error('Error fetching top comics:', err);
    }
  };

  // Initial fetch on component mount and when sort options change
  useEffect(() => {
    fetchComics(1, true);
    fetchTopComics(); // Fetch top comics when component mounts
    console.log(`Sorting by: ${sortBy}, Order: ${sortOrder}`); // Debug log
  }, [sortBy, sortOrder]); // Removed searchQuery so it only searches on button click
  
  // Auto-search when search query is cleared
  useEffect(() => {
    if (searchQuery === '') {
      fetchComics(1, true);
    }
  }, [searchQuery]);

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

  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-0 my-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-[#f0b90b] py-6 sm:py-8 rounded-xl w-full max-w-full">
          {/* Dotted Pattern Background */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}></div>
          
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
                  My Life As
                </h1>
                <p className="text-lg md:text-xl text-white mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
                  Create and share your life stories in comic form!
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <Link 
                    href="/create" 
                    className="inline-flex items-center px-5 py-2 border border-white text-base font-medium rounded-md shadow-md text-[#f0b90b] bg-white hover:bg-white/90 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your My Life As
                  </Link>
                  <Link 
                    href="/rewards" 
                    className="inline-flex items-center px-5 py-2 border border-white text-base font-medium rounded-md shadow-md text-white bg-transparent hover:bg-white/10 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Rewards
                  </Link>
                </div>
              </div>
              
              {/* Podium with top comics */}
              <div className="hidden md:flex items-end mt-6 md:mt-0">
                <div className="flex items-end space-x-2">
                  {/* 3rd Place */}
                  <div className="flex flex-col items-center">
                    {topComics.length > 2 ? (
                      <Link href="/rewards" className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white cursor-pointer">
                        <img 
                          src={topComics[2].imageUrl} 
                          alt={topComics[2].title} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                        <div className="w-full h-full bg-[#3c3c3c]/20 flex items-center justify-center text-[#3c3c3c]">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ff8c38] w-16 h-20 flex items-center justify-center rounded-t-md">
                      <span className="text-white font-bold text-xl">#3</span>
                    </div>
                  </div>
                  
                  {/* 1st Place */}
                  <div className="flex flex-col items-center">
                    {topComics.length > 0 ? (
                      <Link href="/rewards" className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white cursor-pointer">
                        <img 
                          src={topComics[0].imageUrl} 
                          alt={topComics[0].title} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                        <div className="w-full h-full bg-[#3c3c3c]/20 flex items-center justify-center text-[#3c3c3c]">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffd700] w-20 h-32 flex items-center justify-center rounded-t-md">
                      <span className="text-[#3c3c3c] font-bold text-2xl">#1</span>
                    </div>
                  </div>
                  
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center">
                    {topComics.length > 1 ? (
                      <Link href="/rewards" className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white cursor-pointer">
                        <img 
                          src={topComics[1].imageUrl} 
                          alt={topComics[1].title} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white overflow-hidden mb-2 border-2 border-white">
                        <div className="w-full h-full bg-[#3c3c3c]/20 flex items-center justify-center text-[#3c3c3c]">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#4caf50] w-18 h-24 flex items-center justify-center rounded-t-md">
                      <span className="text-white font-bold text-xl">#2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="bg-[#e9e3d9] py-4 px-4 mt-8 rounded-xl border border-[#d0c3b1]">
          <h2 className="text-xl font-bold text-[#f0b90b] mb-3 px-2">Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={() => {
                setSortBy('likes');
                setSortOrder('desc');
              }}
              className="bg-gradient-to-br from-[#f8e8b0] to-[#f0b90b] text-[#222] rounded-lg overflow-hidden relative group h-24"
            >
              <div className="relative h-full">
                {/* Trending image on far right */}
                <img 
                  src="/trending.png" 
                  alt="Trending" 
                  className="absolute right-0 h-full w-1/2 object-contain object-right pr-0"
                />
                
                {/* Centered text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-white">Trending</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                setSortBy('createdAt');
                setSortOrder('desc');
              }}
              className="bg-gradient-to-br from-[#f8e8b0] to-[#f0b90b] text-[#222] rounded-lg overflow-hidden relative group h-24"
            >
              <div className="relative h-full">
                {/* New image on far right */}
                <img 
                  src="/new.png" 
                  alt="New" 
                  className="absolute right-0 h-full w-1/2 object-contain object-right pr-0"
                />
                
                {/* Centered text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-white">New</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                setSortBy('dislikes');
                setSortOrder('desc');
              }}
              className="bg-gradient-to-br from-[#f8e8b0] to-[#f0b90b] text-[#222] rounded-lg overflow-hidden relative group h-24"
            >
              <div className="relative h-full">
                {/* Dislikes image on far right */}
                <img 
                  src="/dislikes.png" 
                  alt="Most Disliked" 
                  className="absolute right-0 h-full w-1/2 object-contain object-right pr-0"
                />
                
                {/* Centered text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-white">Most Disliked</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                setSortBy('createdAt');
                setSortOrder('asc');
              }}
              className="bg-gradient-to-br from-[#f8e8b0] to-[#f0b90b] text-[#222] rounded-lg overflow-hidden relative group h-24"
            >
              <div className="relative h-full">
                {/* Oldest image on far right */}
                <img 
                  src="/oldest.png" 
                  alt="Oldest First" 
                  className="absolute right-0 h-full w-1/2 object-contain object-right pr-0"
                />
                
                {/* Centered text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-white">Oldest First</span>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Comics Gallery Section */}
        <div className="bg-[#e9e3d9] px-4 sm:px-6 lg:px-8 py-12 mt-8 rounded-xl border border-[#d0c3b1]">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#f0b90b] tracking-wide" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>Featured Comics</h2>
              <div className="hidden md:block h-1 flex-grow mx-4 bg-[#f0b90b] rounded-full"></div>
            </div>
          
            {/* Search and Filters */}
            <div className="mb-8 bg-[#e9e3d9] p-6 rounded-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search comics by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchComics(1, true);
                    }
                  }}
                  className="w-full px-5 py-3 border border-[#d0c3b1] rounded-lg focus:outline-none"
                />
                <button 
                  onClick={() => fetchComics(1, true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d0c3b1] hover:text-[#f0b90b] transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {loading && currentPage === 1 ? (
              <div className="text-center py-16">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
                <p className="mt-4 text-white text-lg">Loading comics...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-red-50 rounded-xl border border-red-100">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : comics.length === 0 ? (
              <div className="text-center py-16 bg-[#e9e3d9] rounded-xl shadow-md border border-gray-200 p-8">
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
                <h3 className="text-2xl font-bold text-[#3c3c3c] mb-2 tracking-wide" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>No Comics Yet!</h3>
                <p className="text-lg text-gray-600">Be the first to create and share your comic!</p>
                <div className="mt-8">
                  <Link 
                    href="/create" 
                    className="inline-flex items-center px-6 py-3 border border-[#d0c3b1] text-base font-medium rounded-md text-white bg-[#f0b90b] transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create My Life As
                  </Link>
                </div>
              </div>
            ) : comics.length > 0 ? (
              <>
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${comics.length > 12 ? 'max-h-[1200px] overflow-y-auto pr-2' : ''}`}>
                  {comics.map((comic) => (
                    <div 
                      key={comic._id} 
                      className="bg-[#e9e3d9] border border-[#d0c3b1] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="relative aspect-[1/1.1] overflow-hidden">
                        {/* Comic Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={comic.imageUrl} 
                          alt={comic.title} 
                          className="w-full h-full object-cover"
                        />
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
                
                {/* Load More Button */}
                {pagination?.hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => {
                        const nextPage = currentPage + 1;
                        setCurrentPage(nextPage);
                        fetchComics(nextPage, false);
                      }}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-[#f0b90b] text-white font-medium rounded-md border border-[#d0c3b1] disabled:opacity-70 transition-all duration-300"
                    >
                      {loadingMore ? (
                        <>
                          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                          Loading...
                        </>
                      ) : (
                        'Load More Comics'
                      )}
                    </button>
                  </div>
                )}
                
                {/* Pagination Info */}
                {pagination && (
                  <div className="mt-4 text-center text-sm text-[#f0b90b]">
                    Showing {comics.length} of {pagination.total} comics
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
