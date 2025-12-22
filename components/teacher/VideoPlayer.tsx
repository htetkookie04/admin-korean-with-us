'use client';

import { X, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export function VideoPlayer({ videoUrl, title, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900/95 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white truncate pr-4">
            {title}
          </h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

