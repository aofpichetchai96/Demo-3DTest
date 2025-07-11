const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user's customizations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT pc.*, p.name as product_name, p.thumbnail_path as product_thumbnail
      FROM product_customizations pc
      JOIN products p ON pc.product_id = p.id
      WHERE pc.user_id = $1
      ORDER BY pc.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customizations:', error);
    res.status(500).json({ error: 'Failed to fetch customizations' });
  }
});

// Get specific customization
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT pc.*, p.name as product_name, p.glb_file_path, p.customizable_parts
      FROM product_customizations pc
      JOIN products p ON pc.product_id = p.id
      WHERE pc.id = $1 AND pc.user_id = $2
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customization not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customization:', error);
    res.status(500).json({ error: 'Failed to fetch customization' });
  }
});

// Create new customization
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      product_id,
      customization_data,
      preview_image_path,
      name
    } = req.body;

    // Validate product exists
    const productCheck = await query('SELECT id FROM products WHERE id = $1 AND is_active = true', [product_id]);
    if (productCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const result = await query(`
      INSERT INTO product_customizations (product_id, user_id, customization_data, preview_image_path, name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [product_id, req.user.id, JSON.stringify(customization_data), preview_image_path, name]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customization:', error);
    res.status(500).json({ error: 'Failed to create customization' });
  }
});

// Update customization
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      customization_data,
      preview_image_path,
      name
    } = req.body;

    const result = await query(`
      UPDATE product_customizations 
      SET customization_data = $1, preview_image_path = $2, name = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `, [JSON.stringify(customization_data), preview_image_path, name, req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customization not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating customization:', error);
    res.status(500).json({ error: 'Failed to update customization' });
  }
});

// Delete customization
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      DELETE FROM product_customizations 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customization not found' });
    }

    res.json({ message: 'Customization deleted successfully' });
  } catch (error) {
    console.error('Error deleting customization:', error);
    res.status(500).json({ error: 'Failed to delete customization' });
  }
});

// Clone customization
router.post('/:id/clone', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    const original = await query(`
      SELECT product_id, customization_data, preview_image_path
      FROM product_customizations
      WHERE id = $1 AND user_id = $2
    `, [req.params.id, req.user.id]);

    if (original.rows.length === 0) {
      return res.status(404).json({ error: 'Customization not found' });
    }

    const originalData = original.rows[0];
    const result = await query(`
      INSERT INTO product_customizations (product_id, user_id, customization_data, preview_image_path, name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      originalData.product_id,
      req.user.id,
      originalData.customization_data,
      originalData.preview_image_path,
      name || `Copy of ${originalData.name}`
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error cloning customization:', error);
    res.status(500).json({ error: 'Failed to clone customization' });
  }
});

module.exports = router;