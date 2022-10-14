const fetch = require("node-fetch");
const express = require('express');
const { Pokemon, Type } = require("../db.js");

const router = express();
router.use(express.json());

let pokemons = [];
const url = "https://pokeapi.co/api/v2/pokemon?limit=2";

async function getApiPokemons() {

    return await fetch(url, {method : "get"})
        .then(response => response.json())
        .then(data => {
            let {results} = data; // result = [{name1, url2}, {name2, url2}] 
            let promisesPokemons =  results.map(async nameAndUrl => {
                let {url} = nameAndUrl;
                return await fetch(url, {method: "get"})
                .then(response => response.json())
                .then(p => {
                    let pokemon = {};
                    pokemon.id = p.id;
                    pokemon.name = p.name
                    pokemon.height = p.height;
                    pokemon.weight = p.weight;
                    pokemon.hp = p.stats[0].base_stat;
                    pokemon.attack = p.stats[1].base_stat;
                    pokemon.defense = p.stats[2].base_stat;
                    pokemon.defense = p.stats[5].base_stat;
                    pokemon.img = p.sprites.other.dream_world.front_default;
                    return pokemon;
                })
            });
            return Promise.all(promisesPokemons);
        })
        
}   

router.get("/pokemons", async (req, res) => {
    try {
        let apiPokemons = await getApiPokemons();
        if(apiPokemons) pokemons = [...pokemons, apiPokemons];

        let dbPokemons = await Pokemon.findAll();
        if(dbPokemons) pokemons = [...pokemons, dbPokemons];

        res.status(200).json(pokemons);
    }
    catch(e) {
        res.status(400).send(e.messege);
    }
})

router.post("/pokemons", async (req, res) => {

    try {
        Pokemon.create(req.body);
        res.status(200).send("pokemon creado con exito");
    }
    catch(e) {
        res.status(400).send(e.messege);
    }
})

module.exports = router;

