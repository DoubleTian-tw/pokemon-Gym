import React, { FunctionComponent, useEffect, useState } from "react";
import PokemonAvatar from "./components/PokemonAvatar";
import { nanoid } from "nanoid";
import PokemonSearch from "./components/PokemonSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAllPokemonDetails } from "@/api/useQueryPokemon";

const getPokemonSpeciesLangs = (species) => {
    return species.reduce((acc, { name, pokemon_v2_pokemonspeciesnames }) => {
        if (acc.has(name) === false) {
            acc.set(
                name,
                pokemon_v2_pokemonspeciesnames.map(
                    ({ name, pokemon_v2_language }) => ({
                        name,
                        lang: pokemon_v2_language?.name,
                    })
                )
            );
        }
        return acc;
    }, new Map());
};

const integratedDetailsDataFormat = ({
    pokemon_v2_pokemon,
    pokemon_v2_pokemonspecies,
}) => {
    const speciesLangs = getPokemonSpeciesLangs(pokemon_v2_pokemonspecies);

    const results = pokemon_v2_pokemon.map((pokemon) => {
        const currentSpeciesLang = speciesLangs.get(pokemon?.name);
        if (!currentSpeciesLang) return null;

        const langName = currentSpeciesLang.reduce((acc, { name, lang }) => {
            if (acc.has(lang) === false) {
                acc.set(lang, name);
            }
            return acc;
        }, new Map());
        const img = pokemon?.pokemon_v2_pokemonsprites[0]?.sprites;
        const types = pokemon?.pokemon_v2_pokemontypes.map(
            (type) => type?.pokemon_v2_type?.name
        );
        return {
            id: pokemon?.name,
            name: langName,
            src: img,
            types: types,
        };
    });
    return results.filter(Boolean);
};

const Gym: FunctionComponent = () => {
    const { data, isLoading, isSuccess, isError } = useAllPokemonDetails();
    const [pokemonDetails, setPokemonDetails] = useState([]);

    useEffect(() => {
        if (isSuccess) {
            const results = integratedDetailsDataFormat(data);
            setPokemonDetails(results);
        }
    }, [isSuccess]);

    return (
        <>
            <PokemonSearch />

            <ScrollArea className="h-[360px] w-auto rounded-md border py-3 mb-5">
                <div className="grid grid-cols-3 gap-5 py-2 px-5 justify-center">
                    {pokemonDetails.map((pokemon) => {
                        return (
                            <PokemonAvatar
                                name={pokemon.id}
                                src={pokemon.src}
                                abilities={pokemon.types}
                                key={nanoid()}
                            />
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="w-full h-auto text-right">
                <Button variant="outline" className="w-20 uppercase">
                    done
                </Button>
            </div>
        </>
    );
};
export default Gym;
