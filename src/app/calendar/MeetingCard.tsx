// src/components/calendar/MeetingCard.tsx
"use client";
import React from 'react';
import { Meeting, User } from '@/lib/data';
import Avatar from '@/components/ui/Avatar';
import { formatTime } from '@/lib/utils';

interface MeetingCardProps {
  meeting: Meeting & { organizer: User };
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const { topic, start_time, end_time, organizer } = meeting;
  
  return (
    <div className="bg-white rounded-lg border-r-4 border-primary-500 shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="mb-2">
        <h3 className="font-semibold text-lg">{topic}</h3>
        <p className="text-sm text-gray-500">{formatTime(start_time)} - {formatTime(end_time)}</p>
      </div>
      
      <div className="flex items-center mt-4">
        <Avatar 
          src={organizer.avatar_url} 
          alt={organizer.name} 
          size={32}
          fallback={organizer.name.charAt(0)}
        />
        <span className="text-sm text-gray-600 mr-2">{organizer.name}</span>
      </div>
    </div>
  );
};

export default MeetingCard;