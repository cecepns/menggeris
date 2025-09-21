const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads-menggaris', express.static(path.join(__dirname, 'uploads-menggaris')));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads-menggaris');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Database initialization
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create admin user if not exists
    const [adminExists] = await connection.execute(
      'SELECT id FROM admin_users WHERE username = ?',
      [process.env.ADMIN_USERNAME]
    );

    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await connection.execute(
        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
        [process.env.ADMIN_USERNAME, hashedPassword]
      );
      console.log('Default admin user created');
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Routes

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload Route
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Category Routes
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [categories] = await connection.execute(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    connection.release();
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    connection.release();

    res.status(201).json({
      message: 'Category created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [name, description || null, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    // Check if category has products
    const [products] = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if (products[0].count > 0) {
      connection.release();
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products' 
      });
    }

    const [result] = await connection.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const category = req.query.category || '';
    const search = req.query.search || '';
    const limit = 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Count total
    const countQuery = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
    
    const connection = await pool.getConnection();
    const [countResult] = await connection.execute(countQuery, params);
    const total = countResult[0].total;

    // Get paginated results
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [products] = await connection.execute(query, params);
    
    // Parse images JSON for each product
    const productsWithImages = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    connection.release();

    res.json({
      data: productsWithImages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [products] = await connection.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    );
    connection.release();

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    product.images = product.images ? JSON.parse(product.images) : [];

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category_id, images } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ 
        message: 'Name, price, and category are required' 
      });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO products (name, description, price, category_id, images) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category_id, JSON.stringify(images || [])]
    );
    connection.release();

    res.status(201).json({
      message: 'Product created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, images } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ 
        message: 'Name, price, and category are required' 
      });
    }

    const connection = await pool.getConnection();
    
    // Get current product images before update
    const [currentProduct] = await connection.execute(
      'SELECT images FROM products WHERE id = ?',
      [id]
    );

    if (currentProduct.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse current images
    const currentImages = currentProduct[0].images ? JSON.parse(currentProduct[0].images) : [];
    const newImages = images || [];

    // Update product
    const [result] = await connection.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, images = ?, updated_at = NOW() WHERE id = ?',
      [name, description, price, category_id, JSON.stringify(newImages), id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete old images that are no longer used
    const imagesToDelete = currentImages.filter(image => !newImages.includes(image));
    imagesToDelete.forEach(image => {
      const imagePath = path.join(__dirname, 'uploads-menggaris', image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Deleted old image: ${image}`);
        } catch (deleteError) {
          console.error(`Failed to delete image ${image}:`, deleteError);
        }
      }
    });

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    // Get product images before deletion
    const [products] = await connection.execute(
      'SELECT images FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    connection.release();

    // Delete associated image files
    const images = products[0].images ? JSON.parse(products[0].images) : [];
    images.forEach(image => {
      const imagePath = path.join(__dirname, 'uploads-menggaris', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings Routes
app.get('/api/settings', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [settings] = await connection.execute(
      'SELECT * FROM settings ORDER BY id DESC LIMIT 1'
    );
    connection.release();

    const setting = settings.length > 0 ? settings[0] : {};
    res.json(setting);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { company_name, address, phone, email, about, maps } = req.body;

    const connection = await pool.getConnection();
    
    // Check if settings exist
    const [existing] = await connection.execute('SELECT id FROM settings LIMIT 1');

    if (existing.length > 0) {
      // Update existing settings
      await connection.execute(
        'UPDATE settings SET company_name = ?, address = ?, phone = ?, email = ?, about = ?, maps = ?, updated_at = NOW() WHERE id = ?',
        [company_name, address, phone, email, about, maps, existing[0].id]
      );
    } else {
      // Insert new settings
      await connection.execute(
        'INSERT INTO settings (company_name, address, phone, email, about, maps) VALUES (?, ?, ?, ?, ?, ?)',
        [company_name, address, phone, email, about, maps]
      );
    }

    connection.release();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connected successfully');
    
    // Initialize database
    await initializeDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Please make sure MySQL is running and the database exists');
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await pool.end();
  process.exit(0);
});