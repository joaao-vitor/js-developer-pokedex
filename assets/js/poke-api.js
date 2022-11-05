
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    const species = getPokemonSpecies(pokeDetail)
    const abilities = pokeDetail.abilities.map(abilitySlot => abilitySlot.ability.name)
    const gender = getPokemonGender(pokemon);
    const eggGroups = getPokemonEggGroups(pokemon)
    // const species = pokeDetail.species.map((genera) => genera.filter(language => language.name == "en").name)
    pokemon.types = types
    pokemon.type = type
    pokemon.abilities = abilities;
    pokemon.species = species;
    pokemon.height = (pokeDetail.height * 0.1).toFixed(2)
    pokemon.weight = (pokeDetail.weight * 0.1).toFixed(2)
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.femaleChances = gender.female
    pokemon.maleChances = gender.male
    pokemon.eggGroups = eggGroups

    return pokemon
}

const getPokemonSpecies = (pokemon) => {
    return fetch(pokemon.species.url)
        .then((response) => response.json())
        .then(specie => specie.genera)
        .then(genera => genera.filter(genus => genus.language.name == 'en'))
        .then(genus => genus.map(specie => specie.genus))
}
const getPokemonGender = (pokemon) => {
    const femaleUrl = `https://pokeapi.co/api/v2/gender/1`

    const femaleChances = fetch(femaleUrl)
        .then(response => response.json())
        .then(female => female.pokemon_species_details)
        .then(pokemonList => pokemonList.filter(pokemonObj => pokemonObj.pokemon_species.name == pokemon.name))
        .then(pokemonObj => pokemonObj[0].rate / 8)

    const maleUrl = `https://pokeapi.co/api/v2/gender/2`

    const maleChances = fetch(maleUrl)
        .then(response => response.json())
        .then(male => male.pokemon_species_details)
        .then(pokemonList => pokemonList.filter(pokemonObj => pokemonObj.pokemon_species.name == pokemon.name))
        .then(pokemonObj => pokemonObj[0].rate / 8)
    
    return {
        male: maleChances,
        female: femaleChances
    }

}
const getPokemonEggGroups = async (pokemon) => {
    const eggGroups = []
    for (let i = 1; i <= 15; i++) {
        const url = `https://pokeapi.co/api/v2/egg-group/${i}`
        let eggGroupName
        let isThere = 0
         const eggGroup = await fetch(url)
            .then(response => response.json())
            .then(eggG => 
                {
                    eggGroupName = eggG.name
                    return eggG
                })
            .then(eggG => eggG.pokemon_species)
            .then(species => isThere = (species.filter(specie => specie.name == pokemon.name)).length ? 1 : 0)
        
        if(isThere)
            eggGroups.push(eggGroupName)
    }
    return eggGroups
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`

    return fetch(url)
        .then(response => response.json())
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
