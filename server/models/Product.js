const mongoose = require('mongoose');
const slugify = require('slugify');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
variants: [
  {
    quantity: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    }
  }
],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x400/e8f5e9/2e7d32?text=Product'
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: 'Sri Bhoomi Organics'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  organic: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ "variants.price": 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestSeller: 1 });

productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true }) + '-' + Date.now();
  next();
});
module.exports = mongoose.model('Product', productSchema);
