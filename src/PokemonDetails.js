import React from 'react';

const PokemonDetails = ({ pokemon }) => {
  if (!pokemon) {
    return <div>Sélectionnez un Pokémon pour afficher les détails.</div>;
  }

  return (
    <div className='details-pokemon'>
      <h2>Détails de {pokemon.name}</h2>
      <p>Numéro : {pokemon.id}</p>
      <p>Type : {pokemon.types.map(type => type).join(', ')}</p>
      <img src={pokemon.image} alt={pokemon.name} />
    </div>
  );
};

export default PokemonDetails;
