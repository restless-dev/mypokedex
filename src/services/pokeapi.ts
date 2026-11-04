import { request, gql } from 'graphql-request';

const API_URL = 'https://graphqlpokemon.favware.tech/v8';

export interface PokemonData {
  cryUrl: string;
  flavorText: string;
  height: number;
  id: number;
  name: string;
  sprite: string;
  sprite2d: string;
  stats: { name: string; value: number }[];
  types: string[];
}

interface GraphQLPokemon {
  baseStats: {
    attack: number;
    defense: number;
    hp: number;
    specialattack: number;
    specialdefense: number;
    speed: number;
  };
  cry?: string;
  flavorTexts: { flavor: string }[];
  height: number;
  num: number;
  species: string;
  sprite: string;
  types: { name: string }[];
}

interface GraphQLResponse {
  getAllPokemon: GraphQLPokemon[];
}

export const GENERATIONS = [
  { gen: 1, min: 1, max: 151, apiOffset: 89, apiTake: 400 },
  { gen: 2, min: 152, max: 251, apiOffset: 250, apiTake: 400 },
  { gen: 3, min: 252, max: 386, apiOffset: 350, apiTake: 400 },
  { gen: 4, min: 387, max: 493, apiOffset: 500, apiTake: 400 },
  { gen: 5, min: 494, max: 649, apiOffset: 650, apiTake: 400 },
  { gen: 6, min: 650, max: 721, apiOffset: 850, apiTake: 400 },
  { gen: 7, min: 722, max: 809, apiOffset: 1000, apiTake: 400 },
  { gen: 8, min: 810, max: 905, apiOffset: 1150, apiTake: 400 },
  { gen: 9, min: 906, max: 1025, apiOffset: 1250, apiTake: 400 },
];

export const getGenerationByPokemonId = (id: number) => {
  return GENERATIONS.find((g) => id >= g.min && id <= g.max) || GENERATIONS[0];
};

const GET_ALL_POKEMON_QUERY = gql`
  query GetAllPokemon($offset: Int!, $take: Int!) {
    getAllPokemon(offset: $offset, take: $take) {
      num
      species
      sprite
      cry
      height
      types {
        name
      }
      baseStats {
        hp
        attack
        defense
        specialattack
        specialdefense
        speed
      }
      flavorTexts {
        flavor
      }
    }
  }
`;

const formatPokemon = (p: GraphQLPokemon): PokemonData => {
  const parsedTypes = Array.isArray(p.types)
    ? p.types.map((t: any) =>
        (typeof t === 'string' ? t : t.name || '').toUpperCase(),
      )
    : [];

  return {
    id: p.num || 0,
    name: p.species ? p.species.toUpperCase() : 'UNKNOWN',
    sprite:
      p.sprite ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.num}.png`,
    sprite2d: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.num}.png`,
    height: p.height || 1,
    types: parsedTypes,
    stats: [
      { name: 'HP', value: p.baseStats?.hp || 0 },
      { name: 'ATK', value: p.baseStats?.attack || 0 },
      { name: 'DEF', value: p.baseStats?.defense || 0 },
      { name: 'SP. ATK', value: p.baseStats?.specialattack || 0 },
      { name: 'SP. DEF', value: p.baseStats?.specialdefense || 0 },
      { name: 'SPEED', value: p.baseStats?.speed || 0 },
    ],
    flavorText:
      p.flavorTexts && p.flavorTexts.length > 0
        ? p.flavorTexts[0].flavor.replace(/[\n\f\r]/g, ' ')
        : 'No data available.',
    cryUrl:
      p.cry ||
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${p.num}.ogg`,
  };
};

export const fetchGeneration = async (
  genNum: number,
): Promise<PokemonData[]> => {
  const gen = GENERATIONS.find((g) => g.gen === genNum) || GENERATIONS[0];

  const response = await request<GraphQLResponse>(
    API_URL,
    GET_ALL_POKEMON_QUERY,
    {
      offset: gen.apiOffset,
      take: gen.apiTake,
    },
  );

  const uniquePokemon = new Map<number, PokemonData>();

  response.getAllPokemon.forEach((p) => {
    if (p.num >= gen.min && p.num <= gen.max) {
      if (!uniquePokemon.has(p.num)) {
        uniquePokemon.set(p.num, formatPokemon(p));
      }
    }
  });

  return Array.from(uniquePokemon.values()).sort((a, b) => a.id - b.id);
};
