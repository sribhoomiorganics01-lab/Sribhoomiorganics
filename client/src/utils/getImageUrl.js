export const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/100';
  return `http://localhost:5000/uploads/${image}`;
};