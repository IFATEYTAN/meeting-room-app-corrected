"use client";
import { useState, useEffect } from 'react';
import { getAllUsers } from '@/lib/api';
import { User } from '@/lib/data';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

export default function CalendarIntegrationPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Integration state
  const [googleConnected, setGoogleConnected] = useState<Record<string, boolean>>({});
  const [outlookConnected, setOutlookConnected] = useState<Record<string, boolean>>({});
  const [syncEnabled, setSyncEnabled] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
      
      // Initialize connection states
      const initialGoogleConnected: Record<string, boolean> = {};
      const initialOutlookConnected: Record<string, boolean> = {};
      const initialSyncEnabled: Record<string, boolean> = {};
      
      usersData.forEach(user => {
        initialGoogleConnected[user.id] = false;
        initialOutlookConnected[user.id] = false;
        initialSyncEnabled[user.id] = true;
      });
      
      setGoogleConnected(initialGoogleConnected);
      setOutlookConnected(initialOutlookConnected);
      setSyncEnabled(initialSyncEnabled);
      
      setLoading(false);
    }
    
    fetchData();
  }, []);
  
  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
    
    setSaving(false);
  };
  
  const handleConnect = async (userId: string, service: 'google' | 'outlook') => {
    // Simulate connection process
    const connecting = service === 'google' 
      ? { ...googleConnected, [userId]: true }
      : { ...outlookConnected, [userId]: true };
      
    if (service === 'google') {
      setGoogleConnected(connecting);
    } else {
      setOutlookConnected(connecting);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update connection status
    if (service === 'google') {
      setGoogleConnected(prev => ({ ...prev, [userId]: true }));
    } else {
      setOutlookConnected(prev => ({ ...prev, [userId]: true }));
    }
  };
  
  const handleDisconnect = async (userId: string, service: 'google' | 'outlook') => {
    // Simulate disconnection process
    if (service === 'google') {
      setGoogleConnected(prev => ({ ...prev, [userId]: false }));
    } else {
      setOutlookConnected(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-800">אינטגרציה עם יומנים חיצוניים</h1>
          <Link 
            href="/dashboard" 
            className="py-2 px-4 bg-secondary-700 text-white rounded-md hover:bg-secondary-800 transition-colors"
          >
            חזרה לדשבורד
          </Link>
        </div>
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            הגדרות האינטגרציה נשמרו בהצלחה!
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-6">חיבור יומנים חיצוניים</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-right">משתמש</th>
                    <th className="py-3 text-center">Google Calendar</th>
                    <th className="py-3 text-center">Outlook Calendar</th>
                    <th className="py-3 text-center">סנכרון דו-כיווני</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="py-4">
                        <div className="flex items-center">
                          <Avatar user={user} size="sm" />
                          <div className="mr-3">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        {googleConnected[user.id] ? (
                          <div className="flex flex-col items-center">
                            <span className="text-green-600 font-medium mb-1">מחובר</span>
                            <button
                              className="text-sm text-red-600 hover:text-red-800"
                              onClick={() => handleDisconnect(user.id, 'google')}
                              disabled={saving}
                            >
                              נתק
                            </button>
                          </div>
                        ) : (
                          <button
                            className="py-1 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => handleConnect(user.id, 'google')}
                            disabled={saving}
                          >
                            חבר
                          </button>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {outlookConnected[user.id] ? (
                          <div className="flex flex-col items-center">
                            <span className="text-green-600 font-medium mb-1">מחובר</span>
                            <button
                              className="text-sm text-red-600 hover:text-red-800"
                              onClick={() => handleDisconnect(user.id, 'outlook')}
                              disabled={saving}
                            >
                              נתק
                            </button>
                          </div>
                        ) : (
                          <button
                            className="py-1 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => handleConnect(user.id, 'outlook')}
                            disabled={saving}
                          >
                            חבר
                          </button>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={syncEnabled[user.id] || false}
                            onChange={() => setSyncEnabled(prev => ({
                              ...prev,
                              [user.id]: !prev[user.id]
                            }))}
                            disabled={saving || (!googleConnected[user.id] && !outlookConnected[user.id])}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:bg-gray-100"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                className="py-2 px-6 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-400"
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? 'שומר...' : 'שמור הגדרות'}
              </button>
            </div>
          </div>
        )}
        
        {/* Integration features section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">תכונות אינטגרציה</h2>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mt-1 ml-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>סנכרון אוטומטי של פגישות מחדר הישיבות ליומן האישי</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mt-1 ml-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>בדיקת התנגשויות אוטומטית עם אירועים ביומן האישי</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mt-1 ml-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>עדכון אוטומטי של שינויים בפגישות (ביטול, שינוי שעה)</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mt-1 ml-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>הצגת זמינות בזמן אמת בעת הזמנת פגישה</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mt-1 ml-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>הוספת קישור לפגישת וידאו אוטומטית (Google Meet או Teams)</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">הרשאות נדרשות</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-lg">Google Calendar</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 mr-4 mt-2 space-y-1">
                <li>קריאת אירועים מהיומן</li>
                <li>יצירת ועריכת אירועים ביומן</li>
                <li>קבלת פרטי זמינות</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Outlook Calendar</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 mr-4 mt-2 space-y-1">
                <li>קריאת אירועים מהיומן</li>
                <li>יצירת ועריכת אירועים ביומן</li>
                <li>קבלת פרטי זמינות</li>
                <li>שליחת הזמנות לפגישות</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
