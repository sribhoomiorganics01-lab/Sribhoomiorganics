const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('order');

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE CATEGORY
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    // 🔥 check duplicate
    const existing = await Category.findOne({ name: req.body.name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description || '',
      image: req.file
        ? `/uploads/${req.file.filename}`
        : undefined
    });

    await category.save();

    res.json({ success: true, category });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE CATEGORY
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // 🔥 FIX duplicate issue
    if (req.body.name && req.body.name !== category.name) {
      const existing = await Category.findOne({ name: req.body.name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    await category.save(); // 🔥 important (triggers slug)

    res.json({ success: true, category });

  } catch (error) {
    console.error(error); // 🔥 VERY IMPORTANT
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE CATEGORY
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // 🔥 check products
    const productExists = await Product.exists({ category: categoryId });

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
