const { Product } = require('../models');

/**
 * Fetch all available generator products.
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['kw_capacity', 'ASC']]
    });
    return res.json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return res.status(500).json({ message: 'Failed to retrieve generator products.' });
  }
};

/**
 * Fetch a single product by primary key ID.
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Generator model not found.' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Fetch Product Details Error:', error);
    return res.status(500).json({ message: 'Failed to retrieve product details.' });
  }
};

/**
 * Add a new generator product (Admin-only).
 */
const createProduct = async (req, res) => {
  try {
    const { name, kw_capacity, price, specifications, benefits, availability_status } = req.body;

    if (!name || !kw_capacity || !price) {
      return res.status(400).json({ message: 'Name, KW capacity, and Price are required.' });
    }

    let parsedSpecs = specifications;
    if (typeof specifications === 'string' && specifications.trim()) {
      try { parsedSpecs = JSON.parse(specifications); } catch (e) { return res.status(400).json({ message: 'Invalid JSON format in specifications.' }); }
    } else {
      parsedSpecs = {};
    }

    let parsedBenefits = benefits;
    if (typeof benefits === 'string' && benefits.trim()) {
      try { parsedBenefits = JSON.parse(benefits); } catch (e) { return res.status(400).json({ message: 'Invalid JSON format in benefits.' }); }
    } else {
      parsedBenefits = [];
    }

    // Capture uploaded file url or set default futuristic graphic url
    let image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop';
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const newProduct = await Product.create({
      name,
      kw_capacity: parseInt(kw_capacity),
      price: parseFloat(price),
      specifications: parsedSpecs || {},
      benefits: parsedBenefits || [],
      image_url,
      availability_status: availability_status || 'available'
    });

    return res.status(201).json({
      message: 'New magnetic generator product created successfully.',
      product: newProduct
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    return res.status(500).json({ message: 'Failed to create generator product.' });
  }
};

/**
 * Update an existing generator product details (Admin-only).
 */
const updateProduct = async (req, res) => {
  try {
    const { name, kw_capacity, price, specifications, benefits, availability_status } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Generator model not found.' });
    }

    let parsedSpecs = specifications;
    if (typeof specifications === 'string' && specifications.trim()) {
      try { parsedSpecs = JSON.parse(specifications); } catch (e) { return res.status(400).json({ message: 'Invalid JSON format in specifications.' }); }
    } else if (!specifications) {
      parsedSpecs = product.specifications;
    }

    let parsedBenefits = benefits;
    if (typeof benefits === 'string' && benefits.trim()) {
      try { parsedBenefits = JSON.parse(benefits); } catch (e) { return res.status(400).json({ message: 'Invalid JSON format in benefits.' }); }
    } else if (!benefits) {
      parsedBenefits = product.benefits;
    }

    let image_url = product.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    await product.update({
      name: name || product.name,
      kw_capacity: kw_capacity ? parseInt(kw_capacity) : product.kw_capacity,
      price: price ? parseFloat(price) : product.price,
      specifications: parsedSpecs,
      benefits: parsedBenefits,
      image_url,
      availability_status: availability_status || product.availability_status
    });

    return res.json({
      message: 'Product update logged successfully.',
      product
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    return res.status(500).json({ message: 'Failed to update generator product.' });
  }
};

/**
 * Delete a product catalog item (Admin-only).
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Generator model not found.' });
    }

    await product.destroy();
    return res.json({ message: 'Product permanently purged from database.' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    return res.status(500).json({ message: 'Failed to delete generator product.' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
