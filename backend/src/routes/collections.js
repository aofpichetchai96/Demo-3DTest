const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');
const router = express.Router();

// Validation schemas
const collectionSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow(''),
  is_public: Joi.boolean().default(false)
});

// Get user's collections
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT uc.*, 
             COUNT(ci.id) as item_count
      FROM user_collections uc
      LEFT JOIN collection_items ci ON uc.id = ci.collection_id
      WHERE uc.user_id = $1
      GROUP BY uc.id, uc.name, uc.description, uc.is_public, uc.created_at, uc.updated_at
      ORDER BY uc.updated_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Get public collections
router.get('/public', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await query(`
      SELECT uc.*, u.username,
             COUNT(ci.id) as item_count
      FROM user_collections uc
      JOIN users u ON uc.user_id = u.id
      LEFT JOIN collection_items ci ON uc.id = ci.collection_id
      WHERE uc.is_public = true
      GROUP BY uc.id, uc.name, uc.description, uc.is_public, uc.created_at, uc.updated_at, u.username
      ORDER BY uc.updated_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), parseInt(offset)]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching public collections:', error);
    res.status(500).json({ error: 'Failed to fetch public collections' });
  }
});

// Get specific collection with items
router.get('/:id', async (req, res) => {
  try {
    // Get collection info
    const collectionResult = await query(`
      SELECT uc.*, u.username
      FROM user_collections uc
      JOIN users u ON uc.user_id = u.id
      WHERE uc.id = $1
    `, [req.params.id]);

    if (collectionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const collection = collectionResult.rows[0];

    // Check permissions
    const isOwner = req.user && req.user.id === collection.user_id;
    if (!collection.is_public && !isOwner) {
      return res.status(403).json({ error: 'Collection is private' });
    }

    // Get collection items
    const itemsResult = await query(`
      SELECT ci.*, 
             pc.name as customization_name,
             pc.preview_image_path,
             pc.customization_data,
             p.name as product_name,
             p.thumbnail_path as product_thumbnail
      FROM collection_items ci
      JOIN product_customizations pc ON ci.customization_id = pc.id
      JOIN products p ON pc.product_id = p.id
      WHERE ci.collection_id = $1
      ORDER BY ci.position_order ASC, ci.created_at ASC
    `, [req.params.id]);

    collection.items = itemsResult.rows;

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Create new collection
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = collectionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, is_public } = value;

    const result = await query(`
      INSERT INTO user_collections (user_id, name, description, is_public)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.user.id, name, description, is_public]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// Update collection
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { error, value } = collectionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, is_public } = value;

    const result = await query(`
      UPDATE user_collections 
      SET name = $1, description = $2, is_public = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `, [name, description, is_public, req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Delete collection
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await query('BEGIN');

    try {
      // Delete collection items first
      await query('DELETE FROM collection_items WHERE collection_id = $1', [req.params.id]);
      
      // Delete collection
      const result = await query(`
        DELETE FROM user_collections 
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `, [req.params.id, req.user.id]);

      if (result.rows.length === 0) {
        await query('ROLLBACK');
        return res.status(404).json({ error: 'Collection not found' });
      }

      await query('COMMIT');
      res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

// Add item to collection
router.post('/:id/items', authenticateToken, async (req, res) => {
  try {
    const { customization_id, position_order } = req.body;

    if (!customization_id) {
      return res.status(400).json({ error: 'Customization ID required' });
    }

    // Verify collection ownership
    const collectionCheck = await query(
      'SELECT id FROM user_collections WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Verify customization exists and belongs to user
    const customizationCheck = await query(
      'SELECT id FROM product_customizations WHERE id = $1 AND user_id = $2',
      [customization_id, req.user.id]
    );

    if (customizationCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customization not found' });
    }

    // Check if item already exists in collection
    const existingItem = await query(
      'SELECT id FROM collection_items WHERE collection_id = $1 AND customization_id = $2',
      [req.params.id, customization_id]
    );

    if (existingItem.rows.length > 0) {
      return res.status(400).json({ error: 'Item already in collection' });
    }

    // Add item to collection
    const result = await query(`
      INSERT INTO collection_items (collection_id, customization_id, position_order)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [req.params.id, customization_id, position_order || 0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item to collection:', error);
    res.status(500).json({ error: 'Failed to add item to collection' });
  }
});

// Remove item from collection
router.delete('/:id/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      DELETE FROM collection_items 
      WHERE id = $1 AND collection_id = $2 
      AND collection_id IN (
        SELECT id FROM user_collections WHERE user_id = $3
      )
      RETURNING *
    `, [req.params.itemId, req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found in collection' });
    }

    res.json({ message: 'Item removed from collection' });
  } catch (error) {
    console.error('Error removing item from collection:', error);
    res.status(500).json({ error: 'Failed to remove item from collection' });
  }
});

// Update item position in collection
router.put('/:id/items/:itemId/position', authenticateToken, async (req, res) => {
  try {
    const { position_order } = req.body;

    if (typeof position_order !== 'number') {
      return res.status(400).json({ error: 'Position order must be a number' });
    }

    const result = await query(`
      UPDATE collection_items 
      SET position_order = $1
      WHERE id = $2 AND collection_id = $3 
      AND collection_id IN (
        SELECT id FROM user_collections WHERE user_id = $4
      )
      RETURNING *
    `, [position_order, req.params.itemId, req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found in collection' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating item position:', error);
    res.status(500).json({ error: 'Failed to update item position' });
  }
});

module.exports = router;