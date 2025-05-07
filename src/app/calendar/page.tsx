"use client";
import { useState, useEffect } from 'react';
import { getMeetingsByDate, getAllUsers } from '@/lib/api';
import { Meeting, User } from '@/lib/data';
import MeetingCard from '@/components/calendar/MeetingCard';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function CalendarPage() {
  const [meetings, setMeetings] = useState<(Meeting & { organizer: User })[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true);
      const meetingsData = await getMeetingsByDate(selectedDate);
      setMeetings(meetingsData);
      setLoading(false);
    }
    
    fetchMeetings();
  }, [selectedDate]);

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-800">לוח פגישות</h1>
          <Link 
            href="/booking" 
            className="py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            הזמנת פגישה חדשה
          </Link>
        </div>
        
        {/* Date selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 overflow-x-auto">
          <div className="flex space-x-2 space-x-reverse">
            {dates.map(date => (
              <button
                key={date}
                className={`px-4 py-2 rounded-md min-w-[120px] ${
                  selectedDate === date 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Meetings list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-6">
            פגישות ל{formatDate(selectedDate)}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : meetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">אין פגישות מתוכננות ליום זה</p>
              <Link 
                href="/booking" 
                className="py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                הזמנת פגישה חדשה
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
