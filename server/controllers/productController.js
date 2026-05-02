const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (req.query.category) {
      const categoryDoc = await Category.findOne({ slug: req.query.category });

      if (categoryDoc) {
       query.category = categoryDoc._id;
      }  
      else {
         return res.json({
           success: true,
           products: [],
           page: 1,
           pages: 0,
           total: 0
          });
        }
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

   if (req.query.minPrice || req.query.maxPrice) {
  query['variants.price'] = {};

  if (req.query.minPrice) {
    query['variants.price'].$gte = parseFloat(req.query.minPrice);
  }

  if (req.query.maxPrice) {
    query['variants.price'].$lte = parseFloat(req.query.maxPrice);
  }
}

    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    if (req.query.bestSeller) {
      query.bestSeller = req.query.bestSeller === 'true';
    }

    if (req.query.organic) {
      query.organic = req.query.organic === 'true';
    }

    

    let sortField = req.query.sortField || 'createdAt';

    if (sortField === 'price') {
     sortField = 'variants.price';
    }
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page < Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, bestSeller: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug description')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: parseInt(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      variants,
      featured,
      bestSeller,
      organic
    } = req.body;

    const product = new Product({
      name,
      description,
      category,
      variants: JSON.parse(variants),
      featured,
      bestSeller,
      organic,
      image: req.file ? req.file.path : ''
    });

    await product.save();

    res.status(201).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.variants = JSON.parse(req.body.variants);
    product.featured = req.body.featured;
    product.bestSeller = req.body.bestSeller;
    product.organic = req.body.organic;

    // 🔥 IMAGE FIX
    if (req.file) {
       image: req.file ? req.file.path : ''
    }

    await product.save();

    res.json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};