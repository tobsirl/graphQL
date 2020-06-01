import React from 'react';

export default function Pokemon({ pokemon }) {
  return (
    <div className="pokemon">
      <div className="pokemon__name">
        <p>{pokemon.name}</p>
      </div>
      <div className="pokemon__meta">
        <span>{pokemon.maxHP}</span>
        <span>{pokemon.maxCP}</span>
      </div>
      <div className="pokemon__image">
        <img
          className="pokemon__image"
          src={pokemon.image}
          alt={pokemon.name}
        />
      </div>
      <div class="pokemon__attacks"></div>
    </div>
  );
}
