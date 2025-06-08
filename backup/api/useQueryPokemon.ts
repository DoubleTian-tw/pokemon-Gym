import { useQuery } from "@tanstack/react-query";
import { getPokemonDetailsGraphQL } from "./apiService";

const POKEMON_DETAILS_QUERY = `query pokemon_details {
    pokemon_v2_pokemon(order_by: {id: asc}) {
            name
            id
            pokemon_v2_pokemonsprites {
                id
                sprites(path: "other.official-artwork.front_default")
            }
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
    }
    pokemon_v2_pokemonspecies(order_by: {id: asc}) {
        name
        id
        pokemon_v2_pokemonspeciesnames {
            name
            language_id
            pokemon_v2_language {
                name
            }
        }
    }
}
`;

const fetchAllPokemonDetails = async () => {
    const options = {
        operationName: "pokemon_details",
        query: POKEMON_DETAILS_QUERY,
    };
    const response = await getPokemonDetailsGraphQL(JSON.stringify(options));
    return response.data.data;
};

export const useAllPokemonDetails = () => {
    return useQuery({
        queryKey: ["allPokemonDetails"],
        queryFn: fetchAllPokemonDetails,
        staleTime: Infinity,
    });
};
