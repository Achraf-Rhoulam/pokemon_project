import React, { useState, useEffect } from 'react';
import pokeApi from './pokeApiService';
import PokemonDetails from './PokemonDetails';
import './App.css'; // Feuilles CSS pour styler un peu ma page

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [pokemonTypes, setPokemonTypes] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await pokeApi.get('pokemon');
        const pokemonWithTypes = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonDetails = await pokeApi.get(`pokemon/${pokemon.name}`);
          return {
            ...pokemon,
            types: pokemonDetails.data.types.map(type => type.type.name),
            image: pokemonDetails.data.sprites.front_default
          };
        }));
        setPokemonList(pokemonWithTypes);

        const allPokemonTypes = pokemonWithTypes.reduce((types, pokemon) => {
          pokemon.types.forEach(type => {
            if (!types.includes(type)) {
              types.push(type);
            }
          });
          return types;
        }, []);
        setPokemonTypes(allPokemonTypes);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  const handlePokemonClick = async (pokemonName) => {
    try {
      const response = await pokeApi.get(`pokemon/${pokemonName}`);
      const selectedPokemonDetails = {
        ...response.data,
        types: response.data.types.map(type => type.type.name),
        image: response.data.sprites.front_default
      };
      setSelectedPokemon(selectedPokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    const input = event.target.value.trim().toLowerCase();
    setSearchTerm(input);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedType || pokemon.types.includes(selectedType))
  );

  return (
    <div className="container">
      <h1 className="text-center mb-4">Pokémon Lister</h1>
      <div className="row justify-content-center mb-4">
        <div className="col-lg-5">
          <input
            type="text"
            placeholder="Rechercher un Pokémon"
            value={searchTerm}
            className='SearchInput form-control mb-3'
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="col-lg-5">
          <select value={selectedType} onChange={handleTypeChange} className='TypeSelect form-select mb-3'>
            <option value="">Filtrer par Type</option>
            {pokemonTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <h2 className="text-center h2 mt-4 mb-5">Cliquez sur un Pokémon pour afficher plus de détails EN BAS !!</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
        {filteredPokemonList.map((pokemon, index) => (
          <div key={index} className="col mb-4">
            <div className="card" onClick={() => handlePokemonClick(pokemon.name)}>
              <img src={pokemon.image} className="card-img-top img-fluid" alt={pokemon.name} />
              <div className="card-body">
                <h5 className="card-title">{pokemon.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} />}
      
    </div>
  );
};

export default PokemonList;
