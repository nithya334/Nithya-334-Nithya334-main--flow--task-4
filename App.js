import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const register = async () => {
        await axios.post('http://localhost:5000/register', { username, password });
        alert('User registered');
    };

    const login = async () => {
        const response = await axios.post('http://localhost:5000/login', { username, password });
        setToken(response.data.token);
        alert('Logged in');
    };

    const getDashboard = async () => {
        const response = await axios.get('http://localhost:5000/dashboard', {
            headers: { Authorization: token }
        });
        alert(response.data);
    };

    return (
        <div>
            <h1>MERN Stack App</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
            <button onClick={getDashboard}>Get Dashboard</button>
        </div>
    );
}

export default App;
