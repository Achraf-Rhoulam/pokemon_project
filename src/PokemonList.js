import React, { useState, useEffect } from 'react';
import pokeApi from './pokeApiService'; // Import du service API pour récupérer les données des Pokémon
import PokemonDetails from './PokemonDetails'; // Import du composant pour afficher les détails d'un Pokémon
import './App.css'; // Import la stylesheet de CSS pour le composant

const PokemonList = () => {
  // Déclaration des différents états du composant
  const [pokemonList, setPokemonList] = useState([]); // Liste des Pokémon
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Pokémon sélectionné
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [selectedType, setSelectedType] = useState(''); // Type de Pokémon sélectionné
  const [pokemonTypes, setPokemonTypes] = useState([]); // Liste des types de Pokémon

  // Effet de chargement initial pour récupérer la liste des Pokémon et leurs détails
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        // Récupération de la liste des Pokémon depuis l'API
        const response = await pokeApi.get('pokemon');
        // Récupération des détails de chaque Pokémon et création d'une liste avec types et image
        const pokemonWithTypes = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonDetails = await pokeApi.get(`pokemon/${pokemon.name}`);
          return {
            ...pokemon,
            types: pokemonDetails.data.types.map(type => type.type.name),
            image: pokemonDetails.data.sprites.front_default
          };
        }));
        // Mise à jour de la liste des Pokémon et des types
        setPokemonList(pokemonWithTypes);

        // Création d'une liste de tous les types de Pokémon disponibles
        const allPokemonTypes = pokemonWithTypes.reduce((types, pokemon) => {
          pokemon.types.forEach(type => {
            if (!types.includes(type)) {
              types.push(type);
            }
          });
          return types;
        }, []);
        // Mise à jour de la liste des types de Pokémon
        setPokemonTypes(allPokemonTypes);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };

    // Appel de la fonction de récupération de la liste des Pokémon
    fetchPokemonList();
  }, []);

  // Fonction pour gérer le clic sur un Pokémon et afficher ses détails
  const handlePokemonClick = async (pokemonName) => {
    try {
      // Récupération des détails du Pokémon sélectionné depuis l'API
      const response = await pokeApi.get(`pokemon/${pokemonName}`);
      // Création de l'objet contenant les détails du Pokémon
      const selectedPokemonDetails = {
        ...response.data,
        types: response.data.types.map(type => type.type.name),
        image: response.data.sprites.front_default
      };
      // Mise à jour du Pokémon sélectionné
      setSelectedPokemon(selectedPokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  };

  // Fonction pour gérer le changement de terme de recherche
  const handleSearchInputChange = (event) => {
    const input = event.target.value.trim().toLowerCase();
    setSearchTerm(input);
  };

  // Fonction pour gérer le changement de type de Pokémon sélectionné
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Filtrage de la liste des Pokémon en fonction du terme de recherche et du type sélectionné
  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedType || pokemon.types.includes(selectedType))
  );


  return (
    <div className="container">
        {/* Zones de Recherche et Filtrage */}
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

          {/* Sélecteur de type */}
          <select value={selectedType} onChange={handleTypeChange} className='TypeSelect form-select mb-3'>
            <option value="">Filtrer par Type</option>
            {pokemonTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Instructions aux utilisateurs */}
      <h2 className="text-center h2 mt-4 mb-5">Cliquez sur un Pokémon pour afficher plus de détails !!</h2>

      {/* Affichage des détails du Pokémon sélectionné */}
      {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} />}



      {/* Liste des Pokémon sous forme de cartes */}
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

      
    </div>
  );
};

export default PokemonList;
