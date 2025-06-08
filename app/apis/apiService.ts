import { apiClient, apiClient_GraphQL } from "./apiClient";

export const getPokemonSpecies = () => {
    return apiClient.post("/pokemon-species");
};

export const getPokemonDetailsGraphQL = (graphqlQuery: string) => {
    return apiClient_GraphQL.post("", graphqlQuery);
};
