import React, { useState, useEffect, useCallback } from 'react';

interface PropertyImage {
  id: number;
  image: string;
  alt_text?: string;
}

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        if (event.key === 'ArrowLeft') {
          goToPrevious();
        } else if (event.key === 'ArrowRight') {
          goToNext();
        } else if (event.key === 'Escape') {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative">
        <div 
          className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={images[currentIndex].image}
            alt={images[currentIndex].alt_text || title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Boutons de navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`aspect-w-16 aspect-h-9 rounded cursor-pointer transition-all ${
                index === currentIndex ? 'ring-2 ring-indigo-500' : 'opacity-75 hover:opacity-100'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image.image}
                alt={image.alt_text || title}
                className="w-full h-16 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}

      {/* Mode plein écran */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full">
            <img
              src={images[currentIndex].image}
              alt={images[currentIndex].alt_text || title}
              className="max-w-full max-h-screen object-contain"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;