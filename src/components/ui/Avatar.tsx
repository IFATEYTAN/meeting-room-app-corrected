"use client";

import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  fallback?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'User avatar', size = 40, fallback }) => {
  const fallbackContent = fallback || alt?.charAt(0).toUpperCase() || 'U';

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontSize: `${size / 2}px`,
        color: '#333',
        fontWeight: 'bold',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            // In case of image load error, show fallback
            (e.target as HTMLImageElement).style.display = 'none';
            // This is a simple way to trigger showing the fallback, 
            // a more robust solution might involve state.
          }}
        />
      ) : (
        fallbackContent
      )}
      {!src && <span style={{ display: src ? 'none' : 'block' }}>{fallbackContent}</span>}
    </div>
  );
};

export default Avatar;

