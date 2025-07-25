import React, { useState } from 'react';
import api from '../utils/api';

interface ImageManagerProps {
  images: Array<{
    id: number;
    image: string;
    alt_text?: string;
  }>;
  onImageDeleted: (imageId: number) => void;
  propertyId: number;
}

const ImageManager: React.FC<ImageManagerProps> = ({ images, onImageDeleted, propertyId }) => {
  const [deletingImage, setDeletingImage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    setDeletingImage(imageId);
    setError(null);

    try {
      await api.deletePropertyImage(propertyId, imageId);
      onImageDeleted(imageId);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'image');
    } finally {
      setDeletingImage(null);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.image}
              alt={`Image ${image.id}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleDeleteImage(image.id)}
              disabled={deletingImage === image.id}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {deletingImage === image.id ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;