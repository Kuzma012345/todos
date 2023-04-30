const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

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

app.post('/api/users/login/to_dos', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [
      email,
      password,
    ]);

    if (user.rowCount) {
      const userId = user.rows[0].id;
      const tasks = await pool.query('SELECT * FROM to_dos WHERE user_id = $1', [userId]);

      res.json({ userId, tasks: tasks.rows });
    } else {
      res.json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post('/api/to_dos', async (req, res) => {
  const {  email, password,description } = req.body;
      const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [
      email,
      password,
    ]);

  try {
    if (user.rowCount) {
      const userId = user.rows[0].id;

      const newTodo = await pool.query(
          'INSERT INTO to_dos (user_id, description) VALUES ($1, $2) RETURNING *',
          [userId, description],
      );
      res.json(newTodo.rows[0]);
    }else {
      res.json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    res.json({ error: error.message });
  }
});