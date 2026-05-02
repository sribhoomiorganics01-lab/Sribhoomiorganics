import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default Skeleton;
