
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    const species = pokeApi.getPokemonSpecies(pokeDetail)

    // const species = pokeDetail.species.map((genera) => genera.filter(language => language.name == "en").name)
    pokemon.types = types
    pokemon.type = type
    pokemon.species = species;
    pokemon.height = (pokeDetail.height * 0.1).toFixed(2)
    pokemon.weight = (pokeDetail.weight * 0.1).toFixed(2)
    console.log(pokemon.weight)
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonSpecies = (pokemon) => {
    return fetch(pokemon.species.url)
        .then((response) => response.json())
        .then(specie => specie.genera)
        .then(genera => genera.filter(genus => genus.language.name == 'en'))
        .then(genus => genus.map(specie => specie.genus))
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
