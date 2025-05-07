"use client";
import { useState, useEffect } from 'react';
import { getAllUsers, getAllMeetings } from '@/lib/api';
import { User, Meeting } from '@/lib/data';
import Avatar from '@/components/ui/Avatar';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meetings, setMeetings] = useState<(Meeting & { organizer: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [usersData, meetingsData] = await Promise.all([
        getAllUsers(),
        getAllMeetings()
      ]);
      
      // Get only upcoming meetings (today and future)
      const today = new Date().toISOString().split('T')[0];
      const upcomingMeetings = meetingsData.filter(
        meeting => meeting.date >= today
      ).slice(0, 5); // Get only 5 upcoming meetings
      
      setUsers(usersData);
      setMeetings(upcomingMeetings);
      setLoading(false);
    }
    
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-secondary-800 mb-8">דשבורד</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming meetings */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-secondary-800 mb-6">פגישות קרובות</h2>
                
                {meetings.length > 0 ? (
                  <div className="space-y-4">
                    {meetings.map(meeting => (
                      <div 
                        key={meeting.id}
                        className="border-r-4 border-primary-500 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-secondary-800">{meeting.topic}</h3>
                            <div className="text-sm text-gray-500 mb-2">
                              {formatDate(meeting.date)} | {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Avatar user={meeting.organizer} size="sm" />
                            <span className="text-sm text-gray-600 mr-2">{meeting.organizer.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">אין פגישות קרובות</p>
                )}
                
                <div className="mt-6">
                  <Link 
                    href="/calendar" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    צפייה בכל הפגישות &larr;
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Users list */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-secondary-800 mb-6">משתמשים</h2>
                
                <div className="space-y-4">
                  {users.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center p-3 border border-gray-200 rounded-md hover:border-primary-300 transition-colors"
                    >
                      <Avatar user={user} size="md" />
                      <div className="mr-3">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link 
                    href="/booking" 
                    className="block w-full text-center py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    הזמנת פגישה חדשה
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
