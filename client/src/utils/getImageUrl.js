export const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/300';

  // ✅ If already full URL (Cloudinary)
  if (image.startsWith('http')) {
    return image;
  }

  // ❌ If old /uploads path → ignore
  if (image.startsWith('/uploads')) {
    return 'https://via.placeholder.com/300';
  }

  return image;
};