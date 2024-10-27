import React, { FunctionComponent, useEffect, useState } from "react";
import PokemonAvatar from "./components/PokemonAvatar";
import { nanoid } from "nanoid";
import PokemonSearch from "./components/PokemonSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { fetchAllPokemonDetails } from "@/api/pokemonApi";

const data = [
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
    {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        abilities: [
            { enName: "grass", zhName: "草", bgColor: "#22c02a" },
            { enName: "water", zhName: "水", bgColor: "#6890f0" },
        ],
    },
];

const Gym: FunctionComponent = () => {
    const [pokemonInfos, setPokemonInfos] = useState([]);
    useEffect(() => {
        const getPokemonInfos = async () => {
            const infos = await fetchAllPokemonDetails();
            setPokemonInfos(infos);
        };
        getPokemonInfos();
    }, []);
    return (
        <>
            <PokemonSearch />

            <ScrollArea className="h-[360px] w-auto rounded-md border py-3 mb-5">
                <div className="grid grid-cols-3 gap-5 py-2 px-5">
                    {data.map((item) => {
                        return (
                            <PokemonAvatar
                                name={item.name}
                                src={item.src}
                                abilities={item.abilities}
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
