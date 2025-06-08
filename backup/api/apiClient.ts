import axios from "axios";
const POKEMON_URL = "https://pokeapi.co/api/v2/";
const POKEMON_GRAPHQL_URL = "https://beta.pokeapi.co/graphql/v1beta";

export const apiClient = axios.create({
    baseURL: POKEMON_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const apiClient_GraphQL = axios.create({
    baseURL: POKEMON_GRAPHQL_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
