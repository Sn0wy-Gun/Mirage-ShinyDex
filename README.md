// Updated project files include a backend system and revised frontend for admin-only control.

// Backend Code (Node.js with Express)
// Save this as backend/server.js:
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
    console.log(Server running on http://localhost:${PORT});
});

// Frontend Code (HTML with API Integration)
// Save this as frontend/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Mirage OT Shiny Dex</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500&display=swap" rel="stylesheet">
    <style>
        /* Styles remain the same */
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #2d2d2d;
            color: white;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: auto;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 16px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            padding: 30px;
            display: flex;
            flex-direction: column;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #444;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 2.5em;
            color: #ffcb05;
        }
        .pokemon-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .pokemon-item {
            background: #444;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 120px;
            text-align: center;
            position: relative;
        }
        .pokemon-item img {
            width: 80px;
            height: 80px;
            margin-bottom: 5px;
        }
        .pokemon-name {
            font-size: 1.2em;
            margin-bottom: 5px;
        }
        .pokemon-owner {
            font-size: 0.9em;
            color: #bbb;
        }
        .remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            font-size: 0.8em;
        }
        .remove-btn:hover {
            background-color: #d32f2f;
        }
        .add-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
        }
        .add-section input {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: none;
            background-color: #444;
            color: white;
        }
        .add-section button {
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            background-color: #ffbb33;
            color: white;
            cursor: pointer;
        }
        .add-section button:hover {
            background-color: #ff9900;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Team Mirage OT Shiny Dex</h1>
    </div>
    
    <ul class="pokemon-list" id="pokemonList">
        <!-- Pokémon will be dynamically added here -->
    </ul>

    <div class="add-section">
        <input type="text" id="pokemonName" placeholder="Enter Pokémon name">
        <input type="text" id="pokemonOwner" placeholder="Enter owner name">
        <input type="text" id="pokemonImage" placeholder="Enter GIF URL (optional)">
        <input type="text" id="adminToken" placeholder="Enter admin token">
        <button id="addPokemonBtn">Add Pokémon</button>
    </div>
</div>

<script>
    const pokemonList = document.getElementById('pokemonList');
    const addPokemonBtn = document.getElementById('addPokemonBtn');
    const pokemonName = document.getElementById('pokemonName');
    const pokemonOwner = document.getElementById('pokemonOwner');
    const pokemonImage = document.getElementById('pokemonImage');
    const adminToken = document.getElementById('adminToken');

    const API_URL = 'http://localhost:3000/api/pokemons';

    const renderPokemons = async () => {
        const response = await fetch(API_URL);
        const pokemons = await response.json();

        pokemonList.innerHTML = ''; // Clear current list
        pokemons.forEach(pokemon => {
            const li = document.createElement('li');
            li.classList.add('pokemon-item');
            li.innerHTML = 
                <div class="pokemon-name">${pokemon.name}</div>
                ${pokemon.image ? <img src="${pokemon.image}" alt="${pokemon.name}"> : '<div style="width:80px;height:80px;background:#555;border-radius:50%;"></div>'}
                <div class="pokemon-owner">${pokemon.owner}</div>
            ;
            pokemonList.appendChild(li);
        });
    };

    const addPokemon = async () => {
        const name = pokemonName.value.trim();
        const owner = pokemonOwner.value.trim();
        const image = pokemonImage.value.trim();
        const token = adminToken.value.trim();

        if (!name || !owner || !token) {
            alert("Please provide Pokémon name, owner, and admin token.");
            return;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, owner, image, token })
        });

        if (response.ok) {
            alert("Pokémon added successfully!");
            pokemonName.value = '';
            pokemonOwner.value = '';
            pokemonImage.value = '';
            adminToken.value = '';
            renderPokemons();
        } else {
            const error = await response.json();
            alert(error.error);
        }
    };

    addPokemonBtn.addEventListener('click', addPokemon);

    // Initial render
    renderPokemons();
</script>

</body>
</html>
