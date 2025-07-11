const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category_id, search, limit = 20, offset = 0 } = req.query;
    
    let queryText = `
      SELECT p.*, pc.name as category_name 
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (category_id) {
      queryText += ` AND p.category_id = $${paramIndex++}`;
      params.push(category_id);
    }

    if (search) {
      queryText += ` AND (p.name ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex++})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, params);
    
    res.json({
      products: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rowCount
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, pc.name as category_name 
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.id = $1 AND p.is_active = true
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get product categories
router.get('/categories/all', async (req, res) => {
  try {
    const result = await query(`
      SELECT pc.*, COUNT(p.id) as product_count
      FROM product_categories pc
      LEFT JOIN products p ON pc.id = p.category_id AND p.is_active = true
      GROUP BY pc.id, pc.name, pc.description, pc.created_at
      ORDER BY pc.name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      base_price,
      glb_file_path,
      thumbnail_path,
      customizable_parts
    } = req.body;

    const result = await query(`
      INSERT INTO products (name, description, category_id, base_price, glb_file_path, thumbnail_path, customizable_parts)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, description, category_id, base_price, glb_file_path, thumbnail_path, JSON.stringify(customizable_parts)]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      base_price,
      glb_file_path,
      thumbnail_path,
      customizable_parts,
      is_active
    } = req.body;

    const result = await query(`
      UPDATE products 
      SET name = $1, description = $2, category_id = $3, base_price = $4, 
          glb_file_path = $5, thumbnail_path = $6, customizable_parts = $7, 
          is_active = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [name, description, category_id, base_price, glb_file_path, thumbnail_path, 
        JSON.stringify(customizable_parts), is_active, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;