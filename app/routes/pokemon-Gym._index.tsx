import { FunctionComponent, useEffect, useState } from "react";
import PokemonAvatar from "@/components/Avatar";
import { nanoid } from "nanoid";
import PokemonSearch from "@/components/Search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAllPokemonDetails } from "@/apis/useQueryPokemon";
import {
    PokemonData,
    PokemonDetails,
    PokemonSpecies,
    PokemonSpeciesName,
} from "@/types/pokemonGym";
import { PokemonTypeName } from "@/types/pokemon";

const getPokemonSpeciesLangs = (
    species: PokemonSpecies[]
): Map<string, PokemonSpeciesName[]> => {
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
}: PokemonData): PokemonDetails[] => {
    const speciesLangs = getPokemonSpeciesLangs(pokemon_v2_pokemonspecies);

    const results = pokemon_v2_pokemon.map((pokemon): PokemonDetails | null => {
        if (!pokemon?.name) return null;

        const currentSpeciesLang = speciesLangs.get(pokemon.name);
        if (!currentSpeciesLang) return null;

        const langName = currentSpeciesLang.reduce((acc, { name, lang }) => {
            if (lang && acc.has(lang) === false) {
                acc.set(lang, name);
            }
            return acc;
        }, new Map<string, string>());

        const img = pokemon?.pokemon_v2_pokemonsprites[0]?.sprites;
        if (!img) return null;

        const types = pokemon?.pokemon_v2_pokemontypes
            .map((type) => type?.pokemon_v2_type?.name)
            .filter((type): type is PokemonTypeName => type !== undefined);

        return {
            id: pokemon.name,
            name: langName,
            src: img,
            types: types,
        };
    });
    return results.filter((item): item is PokemonDetails => item !== null);
};

const PokemonGym: FunctionComponent = () => {
    const { data, isSuccess } = useAllPokemonDetails();
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);

    useEffect(() => {
        if (isSuccess && data) {
            const results = integratedDetailsDataFormat(data);
            setPokemonDetails(results);
        }
    }, [isSuccess, data]);

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

export default PokemonGym;
