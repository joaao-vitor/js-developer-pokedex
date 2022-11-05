
const URLParams = new URLSearchParams(location.search);
const id = URLParams.get("id")
const pokemonDetails = document.getElementsByClassName('info-container')[0]

async function convertPokeDetailsToHtml(pokemon) {

    const html =  `
        <header class="poke-info">
            <section>
                <nav>
                    <button class="back-btn">
                        <a href="index.html">
                            <img src="assets/imgs/back-button.png" alt="">
                        </a>
                    </button>
                </nav>
                <h1>${pokemon.name}</h1>
                <ol class="type-list">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </section>
            <p id="poke-id">#${pokemon.number}</p>
        </header>
        <img src="${pokemon.photo}"
            alt="${pokemon.name}" class="poke-photo">
        <section class="poke-details">
            <div class="container-details">
                <h3 class="section-title">About</h3>
                    <section class="poke-details-content">
                        <p><span class="categories">Species</span> ${(await pokemon.species).join(', ')}</p>
                        <p><span class="categories">Height</span> ${pokemon.height}cm</p>
                        <p><span class="categories">Weight</span> ${pokemon.weight}kg</p>
                        <p><span class="categories">Abilities</span> ${pokemon.abilities.join(', ')}</p>
                    </section>
                    <section class="breeding-details">
                        <h2>Breeding</h3>
                            <p><span class="categories">Gender</span>
                                <span>
                                    <img src="/assets/imgs/female-icon.png" alt="Female Pokemon" class="gender-icon"> ${(await pokemon.femaleChances) * 100}%
                                    <img src="/assets/imgs/male-icon.png" alt="Male Pokemon" class="gender-icon"> ${(await pokemon.maleChances) * 100}%
                                </span>
                            </p>
                            <p><span class="categories">Egg Groups</span> ${(await pokemon.eggGroups).join(' ')}</p>
                    </section>
                </div>
            </section>
        </main>
    `
    pokemonDetails.classList.add(pokemon.type)
    return html
}
function loadPokemonItens(id) {
    pokeApi.getPokemonById(id).then((pokemon = new Pokemon()) => {
        document.title = `${pokemon.name}: Details`
        convertPokeDetailsToHtml(pokemon).then(
            newHtml => {
                pokemonDetails.innerHTML = newHtml
            }
        )
        
    })
}
loadPokemonItens(id)