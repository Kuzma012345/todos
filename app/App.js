import { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toDos, setToDos] = useState([]);
  const [description, setDescription] = useState('');

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleCreateToDo() {
    try {
      const response = await axios.post('http://localhost:5000/api/to_dos', {
        user_id: 1, // replace with actual user_id
        description,
      });

      setToDos(prevToDos => [...prevToDos, response.data]);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getToDos() {
    try {
      const response = await axios.get('http://localhost:5000/api/to_dos/1'); // replace with actual user_id

      setToDos(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button>Register</button>
      </form>

      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button>Login</button>
      </form>

      <div>
        <h3>Todos</h3>

        <input type="text" placeholder="Description" onChange={e => setDescription(e.target.value)} />
        <button onClick={handleCreateToDo}>Create To-Do</button>

        <ul>
          {toDos.map(toDo => (
            <li key={toDo.id}>{toDo.description}</li>
          ))}
        </ul>

        <button onClick={getToDos}>Get To-Dos</button>
      </div>
    </div>
  );
}

export default App;