"use client";
import { useState, useEffect } from 'react';
import { getAllUsers, getAllResources, createMeeting } from '@/lib/api';
import { User, Resource } from '@/lib/data';
import Avatar from '@/components/ui/Avatar';
import { generateTimeOptions, calculateDuration, isTimeSlotAvailable } from '@/lib/utils';
import Link from 'next/link';

export default function BookingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [organizerId, setOrganizerId] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  
  // Time options
  const timeOptions = generateTimeOptions();
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [usersData, resourcesData] = await Promise.all([
        getAllUsers(),
        getAllResources()
      ]);
      
      setUsers(usersData);
      setResources(resourcesData);
      setLoading(false);
    }
    
    fetchData();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!organizerId || !topic || !date || !startTime || !endTime) {
      setError('יש למלא את כל השדות החובה');
      return;
    }
    
    // Validate time range
    if (startTime >= endTime) {
      setError('שעת הסיום חייבת להיות מאוחרת משעת ההתחלה');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Create meeting
      const meeting = await createMeeting({
        organizer_id: organizerId,
        topic,
        date,
        start_time: startTime,
        end_time: endTime
      });
      
      if (!meeting) {
        throw new Error('שגיאה ביצירת הפגישה');
      }
      
      // Add resources to meeting
      if (selectedResources.length > 0) {
        // This would be implemented to add resources to the meeting
        console.log('Adding resources:', selectedResources);
      }
      
      // Reset form
      setOrganizerId('');
      setTopic('');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
      setSelectedResources([]);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת הפגישה');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Toggle resource selection
  const toggleResource = (resourceId: string) => {
    if (selectedResources.includes(resourceId)) {
      setSelectedResources(selectedResources.filter(id => id !== resourceId));
    } else {
      setSelectedResources([...selectedResources, resourceId]);
    }
  };
  
  // Get icon class for resource
  const getIconClass = (icon: string) => {
    switch (icon) {
      case 'projector': return 'fas fa-projector';
      case 'monitor': return 'fas fa-desktop';
      case 'speaker': return 'fas fa-volume-up';
      case 'board': return 'fas fa-chalkboard';
      case 'laptop': return 'fas fa-laptop';
      case 'video': return 'fas fa-video';
      default: return 'fas fa-cube';
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-800">הזמנת פגישה</h1>
          <Link 
            href="/calendar" 
            className="py-2 px-4 bg-secondary-700 text-white rounded-md hover:bg-secondary-800 transition-colors"
          >
            חזרה ללוח הפגישות
          </Link>
        </div>
        
        {/* Booking form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
              הפגישה נוצרה בהצלחה! מייל אישור נשלח למארגן.
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Organizer */}
                <div>
                  <label className="block text-gray-700 mb-2">מארגן הפגישה *</label>
                  <div className="relative">
                    <select 
                      className="w-full p-2 pr-10 border border-gray-300 rounded-md appearance-none"
                      value={organizerId}
                      onChange={(e) => setOrganizerId(e.target.value)}
                      disabled={submitting}
                      required
                    >
                      <option value="">בחר מארגן</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    
                    {organizerId && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <Avatar 
                          user={users.find(u => u.id === organizerId)} 
                          size="xs" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Topic */}
                <div>
                  <label className="block text-gray-700 mb-2">נושא הפגישה *</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={submitting}
                    required
                    placeholder="הזן נושא לפגישה"
                  />
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-gray-700 mb-2">תאריך *</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded-md" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={submitting}
                    required
                  />
                </div>
                
                {/* Time range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">שעת התחלה *</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={startTime}
                      onChange={(e) => {
                        const newStartTime = e.target.value;
                        setStartTime(newStartTime);
                        
                        // Automatically set end time to be 1 hour after start time if current end time is before new start time
                        if (newStartTime >= endTime) {
                          const startHour = parseInt(newStartTime.split(':')[0]);
                          const startMinute = parseInt(newStartTime.split(':')[1]);
                          let endHour = startHour + 1;
                          if (endHour > 18) endHour = 18;
                          setEndTime(`${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`);
                        }
                      }}
                      disabled={submitting}
                      required
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">שעת סיום *</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={submitting}
                      required
                    >
                      {timeOptions
                        .filter(option => option.value > startTime)
                        .map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Resources */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">משאבים נדרשים</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {resources.map(resource => (
                    <div 
                      key={resource.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        submitting ? 'opacity-50 cursor-not-allowed' :
                        selectedResources.includes(resource.id) 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => !submitting && toggleResource(resource.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 ml-2`}>
                          <i className={getIconClass(resource.icon)}></i>
                        </div>
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-xs text-gray-500">{resource.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Submit button */}
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="py-2 px-6 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-400"
                  disabled={submitting}
                >
                  {submitting ? 'מעבד...' : 'הזמן פגישה'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
