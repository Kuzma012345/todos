const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'to_do_list',
  password: 'postgres',
  port: 5432,
});

const app = express();

app.use(bodyParser.json());

app.listen(5100, () => {
  console.log('Server started (http://localhost:5000/) !');
});

app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password],
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (user.rows.length === 0) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ userId: user.rows[0].id }, SECRET_KEY);

    res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

    res.json({ message: 'Login successful'});
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post('/api/to_dos', async (req, res) => {
  const { description } = req.body;
  const token = req.headers.cookie.split('=')[1];
  if (!token) return res.status(401).send('Access denied. No token provided.');
  const decoded = jwt.verify(token, SECRET_KEY);


  try {
    const newTodo = await pool.query(
      'INSERT INTO to_dos (user_id, description) VALUES ($1, $2) RETURNING *',
      [decoded.userId, description],
    );

    res.json(newTodo.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/api/to_dos', async (req, res) => {
  try {
    const token = req.headers.cookie.split('=')[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');
    const decoded = jwt.verify(token, SECRET_KEY);
    const { userId } = decoded;

    const toDos = await pool.query('SELECT * FROM to_dos WHERE user_id = $1', [userId]);

    res.json(toDos.rows);
  } catch (error) {
    res.json({ error: error.message });
  }
});