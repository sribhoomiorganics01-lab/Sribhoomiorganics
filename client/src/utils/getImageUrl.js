export const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/300';

  // ✅ Cloudinary or full URL
  if (image.startsWith('http')) {
    return image;
  }

  // ❌ Old broken local upload → fallback
  return 'https://via.placeholder.com/300';
};