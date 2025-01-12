const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (you can replace this with a real database later)
let pokemons = [];

// Admin authentication token (for simplicity; replace with a secure method in production)
const ADMIN_TOKEN = 'your-secure-admin-token';

// Routes
// Fetch all Pokémon
app.get('/api/pokemons', (req, res) => {
    res.json(pokemons);
});

// Add a Pokémon (Admin only)
app.post('/api/pokemons', (req, res) => {
    const { token, name, owner, image } = req.body;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!name || !owner) {
        return res.status(400).json({ error: 'Name and owner are required' });
    }

    pokemons.push({ name, owner, image });
    res.status(201).json({ message: 'Pokémon added successfully' });
});

// Remove a Pokémon (Admin only)
app.delete('/api/pokemons/:name', (req, res) => {
    const { token } = req.body;
    const { name } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    pokemons = pokemons.filter(pokemon => pokemon.name !== name);
    res.json({ message: 'Pokémon removed successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

