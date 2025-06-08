import { PokemonTypeName } from "./pokemon";

export interface PokemonSpeciesName {
    name: string;
    pokemon_v2_language?: {
        name: string;
    };
    lang?: string;
}

export interface PokemonSpecies {
    name: string;
    pokemon_v2_pokemonspeciesnames: PokemonSpeciesName[];
}

interface PokemonType {
    pokemon_v2_type?: {
        name: PokemonTypeName;
    };
}

interface PokemonSprite {
    sprites: string;
}

interface Pokemon {
    name: string;
    pokemon_v2_pokemonsprites: PokemonSprite[];
    pokemon_v2_pokemontypes: PokemonType[];
}

export interface PokemonData {
    pokemon_v2_pokemon: Pokemon[];
    pokemon_v2_pokemonspecies: PokemonSpecies[];
}

export interface PokemonDetails {
    id: string;
    name: Map<string, string>;
    src: string;
    types: PokemonTypeName[];
}
