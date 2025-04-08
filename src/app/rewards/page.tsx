'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Comic {
  _id: string;
  title: string;
  creatorAddress: string;
  imageUrl: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export default function RewardsPage() {
  const [topComics, setTopComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchTopComics = async () => {
      try {
        setLoading(true);
        
        // Build query parameters to get top comics by likes
        const params = new URLSearchParams();
        params.append('sortBy', 'likes');
        params.append('sortOrder', 'desc');
        params.append('limit', '3');
        
        const response = await fetch(`/api/comics?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch comics');

        const data = await response.json();
        setTopComics(data.comics || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopComics();
  }, []);

  useEffect(() => {
    const targetDate = new Date('April 30, 2025 23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) =>
    address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

  const prizes = [
    { place: '1st', amount: '$3,000 USD' },
    { place: '2nd', amount: '$1,500 USD' },
    { place: '3rd', amount: '$750 USD' }
  ];

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Countdown Timer with border */}
        <div className="bg-[#e9e3d9] rounded-xl p-8 mb-12 text-center border border-[#d0c3b1]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-['Poppins']">Contest Ends In</h2>
          <div className="flex justify-center gap-8 md:gap-12">
            {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
              <div key={unit} className="text-center w-20 md:w-24">
                <div className="text-4xl md:text-5xl font-bold text-[#f0b90b]">{timeRemaining[unit]}</div>
                <div className="text-sm text-gray-600 mt-2">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600 font-['Poppins']">
            Winners will be announced on May 1, 2025
          </p>
        </div>

        {/* Prize Pool and Leaderboard Section with border */}
        <div className="bg-[#e9e3d9] rounded-xl p-8 border border-[#d0c3b1]">
          {/* Prize Pool Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-['Poppins']">Prize Pool</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prizes.map((prize, index) => {
                const color =
                  index === 0
                    ? 'text-[#f0b90b]'
                    : index === 1
                    ? 'text-gray-600'
                    : 'text-amber-800';

                return (
                  <div key={prize.place} className="p-6 text-center">
                    <div className={`text-2xl font-bold mb-2 font-['Poppins'] ${color}`}>
                      {prize.place} Place
                    </div>
                    <div className={`text-3xl font-bold mb-4 font-['Poppins'] ${color}`}>
                      {prize.amount}
                    </div>
                    <p className="text-sm text-gray-600 font-['Poppins']">
                      {index === 0 ? 'Grand Prize Winner' : index === 1 ? 'Runner Up' : 'Third Place'}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-['Poppins']">
                Prizes will be distributed to the creators of the top 3 most liked comics at the end of the month.
              </p>
              
            </div>
          </div>

          <div className="mt-12"></div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-['Poppins']">
              Current Leaderboard
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#f0b90b] border-r-transparent"></div>
                <p className="mt-4 text-gray-600 font-['Poppins']">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 font-['Poppins']">{error}</p>
              </div>
            ) : topComics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 font-['Poppins']">No comics have been created yet.</p>
                <p className="mt-2 text-gray-500 font-['Poppins']">Be the first to create and share your comic!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topComics.map((comic, index) => (
                  <div
                    key={comic._id}
                    className="flex items-center p-6 rounded-lg border-b border-[#d0c3b1] last:border-b-0"
                  >
                    <div className="flex-shrink-0 mr-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                          index === 0
                            ? 'bg-[#f0b90b]'
                            : index === 1
                            ? 'bg-gray-500'
                            : 'bg-amber-800'
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 font-['Poppins']">{comic.title}</h3>
                          <p className="text-sm text-gray-600 font-['Poppins']">
                            Creator: {formatAddress(comic.creatorAddress)}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <div className="flex items-center text-[#f0b90b] mr-4">
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span className="font-bold font-['Poppins']">{comic.likes}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-500 font-['Poppins']">
                            {new Date(comic.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="h-2 bg-[#d0c3b1]/30 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              index === 0
                                ? 'bg-[#f0b90b]'
                                : index === 1
                                ? 'bg-gray-500'
                                : 'bg-amber-800'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (comic.likes / (topComics[0]?.likes || 1)) * 100
                              )}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-['Poppins']">Vote for your favorite comics to help them win!</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 mt-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#f0b90b] hover:bg-[#d9a70a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f0b90b] font-['Poppins']"
              >
                Browse Comics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
