import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT_DIR = fileURLToPath(new URL("../", import.meta.url));
const OUTPUT_PATH = join(ROOT_DIR, "src/data/pokemon-roster.json");
const TEMP_PATH = `${OUTPUT_PATH}.tmp`;

const PVPOKE_URL =
  process.env.PVPOKE_POKEMON_URL ||
  "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster/pokemon.json";
const POKEAPI_GRAPHQL_URL =
  process.env.POKEAPI_GRAPHQL_URL || "https://graphql.pokeapi.co/v1beta2";

const REQUEST_TIMEOUT_MS = 30_000;
const CPM_50 = 0.84029999;

const VALID_TYPES = new Set([
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
]);

const FORM_ORDER = {
  normal: 0,
  alolan: 1,
  galarian: 2,
  hisuian: 3,
  paldean: 4,
};

const FORM_ZH_PREFIX = {
  normal: "",
  alolan: "阿羅拉",
  galarian: "伽勒爾",
  hisuian: "洗翠",
  paldean: "帕底亞",
};

const FORM_POKEAPI_SUFFIX = {
  alolan: "-alola",
  galarian: "-galar",
  hisuian: "-hisui",
  paldean: "-paldea",
};

const PALDEAN_TAUROS_OVERRIDES = {
  tauros_combat: {
    pokeApiSlug: "tauros-paldea-combat-breed",
    zhName: "帕底亞肯泰羅（鬥戰種）",
  },
  tauros_blaze: {
    pokeApiSlug: "tauros-paldea-blaze-breed",
    zhName: "帕底亞肯泰羅（火熾種）",
  },
  tauros_aqua: {
    pokeApiSlug: "tauros-paldea-aqua-breed",
    zhName: "帕底亞肯泰羅（水瀾種）",
  },
  tauros_paldean_combat: {
    pokeApiSlug: "tauros-paldea-combat-breed",
    zhName: "帕底亞肯泰羅（鬥戰種）",
  },
  tauros_paldean_blaze: {
    pokeApiSlug: "tauros-paldea-blaze-breed",
    zhName: "帕底亞肯泰羅（火熾種）",
  },
  tauros_paldean_aqua: {
    pokeApiSlug: "tauros-paldea-aqua-breed",
    zhName: "帕底亞肯泰羅（水瀾種）",
  },
};

// pvpoke speciesId 與 PokéAPI default slug 命名差異對照（僅在自動比對不唯一時輔助）
const CANONICAL_NORMAL_SUFFIXES = new Set([
  "altered",
  "normal",
  "ordinary",
  "aria",
  "incarnate",
  "land",
  "standard",
  "overcast",
  "plant",
  "average",
  "baile",
  "midday",
  "solo",
  "red_striped",
  "shield",
  "amped",
  "ice",
  "full_belly",
  "hero",
  "single_strike",
  "male",
  "family_of_four",
  "two_segment",
  "curly",
  "disguised",
  "50",
]);

const POKEAPI_QUERY = `
  query SyncPokemonRoster {
    species: pokemonspecies(order_by: { id: asc }) {
      id
      name
      names: pokemonspeciesnames(where: { language_id: { _eq: 4 } }) {
        name
      }
    }
    pokemon: pokemon(
      where: {
        _or: [
          { is_default: { _eq: true } }
          { name: { _ilike: "%-alola%" } }
          { name: { _ilike: "%-galar%" } }
          { name: { _ilike: "%-hisui%" } }
          { name: { _ilike: "%-paldea%" } }
        ]
      }
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_species_id
      is_default
      sprites: pokemonsprites {
        artwork: sprites(path: "other.official-artwork.front_default")
        home: sprites(path: "other.home.front_default")
      }
    }
  }
`;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} from ${url}`);
  }
  return response.json();
}

function buildOfficialArtworkUrl(dexId) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;
}

function resolveSpriteUrl(pokeApiPokemon, dexId, id, warnings) {
  const spriteRow = pokeApiPokemon?.sprites?.[0];
  const officialArtwork = spriteRow?.artwork;
  if (typeof officialArtwork === "string" && officialArtwork.length > 0) {
    return officialArtwork;
  }

  const homeSprite = spriteRow?.home;
  if (typeof homeSprite === "string" && homeSprite.length > 0) {
    warnings.push(
      `[圖資降級: home] ${id} (dex ${dexId}) 缺少 official-artwork，改用 home.front_default`,
    );
    return homeSprite;
  }

  const fallbackUrl = buildOfficialArtworkUrl(dexId);
  warnings.push(
    `[圖資降級: 原種 dexId] ${id} (dex ${dexId}) 缺少形態圖資，改用原種 official-artwork (${fallbackUrl})`,
  );
  return fallbackUrl;
}

function detectRegionalForm(entry) {
  const id = entry.speciesId;
  const tags = Array.isArray(entry.tags) ? entry.tags : [];

  if (tags.includes("alolan") || /_alolan(?:_|$)/.test(id)) return "alolan";
  if (tags.includes("galarian") || /_galarian(?:_|$)/.test(id)) return "galarian";
  if (tags.includes("hisuian") || /_hisuian(?:_|$)/.test(id)) return "hisuian";
  if (tags.includes("paldean") || /_paldean(?:_|$)/.test(id)) return "paldean";
  return "normal";
}

function isExcludedEntry(entry) {
  const id = entry.speciesId;
  const tags = Array.isArray(entry.tags) ? entry.tags : [];

  if (entry.released !== true) return true;
  if (
    tags.includes("shadow") ||
    tags.includes("mega") ||
    tags.includes("primal") ||
    tags.includes("duplicate")
  ) {
    return true;
  }
  if (/(_shadow|_mega(?:_[xy])?|_primal|_xs|_xl|_apex|_armored)$/.test(id)) {
    return true;
  }
  // 排除裝扮、周年與活動特殊型態（僅比對底線後綴，避免誤傷原種名稱）
  if (
    /_(costume|holiday|halloween|fashion|anniversary|celebration|pop_star|rock_star|libre|phd|flying|belle|wizard|safari|detective|party|horizons|kariyushi|5th_anniversary)(?:_|$)/.test(
      id,
    )
  ) {
    return true;
  }
  return false;
}

function normalizeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function computeLv50MaxCp(baseStats) {
  const atk = Number(baseStats?.atk);
  const def = Number(baseStats?.def);
  const hp = Number(baseStats?.hp);
  if (!Number.isFinite(atk) || !Number.isFinite(def) || !Number.isFinite(hp)) {
    throw new Error(`Invalid baseStats: ${JSON.stringify(baseStats)}`);
  }
  const raw =
    ((atk + 15) *
      Math.sqrt(def + 15) *
      Math.sqrt(hp + 15) *
      CPM_50 *
      CPM_50) /
    10;
  return Math.max(10, Math.floor(raw));
}

function normalizeTypes(rawTypes, speciesId) {
  if (!Array.isArray(rawTypes)) {
    throw new Error(`Missing types array on ${speciesId}`);
  }
  const filtered = rawTypes
    .filter((t) => typeof t === "string" && t !== "none")
    .map((t) => t.toLowerCase());

  if (filtered.length < 1 || filtered.length > 2) {
    throw new Error(
      `Expected 1-2 types for ${speciesId}, got: ${JSON.stringify(rawTypes)}`,
    );
  }
  for (const typeId of filtered) {
    if (!VALID_TYPES.has(typeId)) {
      throw new Error(`Invalid type "${typeId}" on ${speciesId}`);
    }
  }
  return filtered;
}

function selectCanonicalEntryForGroup(entries, form, speciesInfo) {
  if (entries.length === 1) {
    const single = entries[0];
    // 若單一候選帶有明顯非基礎型態後綴（例如僅釋出非基礎型態的特殊情況），仍做基本檢查
    if (form === "normal") return single;
    if (
      form === "galarian" &&
      single.speciesId.includes("_zen") &&
      !single.speciesId.includes("_standard")
    ) {
      return null;
    }
    return single;
  }

  const speciesNorm = normalizeSlug(speciesInfo.name);
  const defaultNorm = speciesInfo.defaultPokemon
    ? normalizeSlug(speciesInfo.defaultPokemon.name)
    : "";

  const scored = entries.map((entry) => {
    const id = entry.speciesId;
    const idNorm = normalizeSlug(id);
    let score = 0;

    if (form === "normal") {
      if (idNorm === defaultNorm) score += 100;
      if (idNorm === speciesNorm) score += 90;
      if (id === speciesInfo.name.replace(/-/g, "_")) score += 80;
      const suffix = id.slice(speciesInfo.name.length + 1);
      if (CANONICAL_NORMAL_SUFFIXES.has(suffix)) score += 60;
      if (!entry.tags?.includes("teambuilderexclude")) score += 10;
      // 偏好較短、無額外變體的基礎 ID
      score -= id.length * 0.01;
    } else {
      const expectedSlug = `${speciesInfo.name}${FORM_POKEAPI_SUFFIX[form]}`;
      if (idNorm === normalizeSlug(expectedSlug)) score += 100;
      if (id.endsWith(`_${form}`)) score += 80;
      if (id.includes("_standard")) score += 60;
      if (id.includes("_zen") || id.includes("_crowned")) score -= 100;
      score -= id.length * 0.01;
    }

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > -50 ? scored[0].entry : null;
}

function validateRecord(record) {
  const requiredStrings = ["id", "zhName", "enName", "form", "spriteUrl"];
  for (const field of requiredStrings) {
    if (typeof record[field] !== "string" || record[field].trim() === "") {
      throw new Error(
        `Validation failed: "${field}" must be non-empty string on ${record.id}`,
      );
    }
  }
  const requiredNumbers = [
    "dexId",
    "baseAttack",
    "baseDefense",
    "baseStamina",
    "maxCp",
  ];
  for (const field of requiredNumbers) {
    if (!Number.isInteger(record[field]) || record[field] <= 0) {
      throw new Error(
        `Validation failed: "${field}" must be positive integer on ${record.id}, got ${record[field]}`,
      );
    }
  }
  if (!(record.form in FORM_ORDER)) {
    throw new Error(`Validation failed: invalid form "${record.form}"`);
  }
  if (!Array.isArray(record.types) || record.types.length < 1 || record.types.length > 2) {
    throw new Error(`Validation failed: invalid types on ${record.id}`);
  }
}

async function main() {
  console.log("正在從 pvpoke 與 PokéAPI GraphQL v1beta2 同步寶可夢資料...");

  const [pvpokeData, graphqlResponse] = await Promise.all([
    fetchJson(PVPOKE_URL),
    fetchJson(POKEAPI_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: POKEAPI_QUERY }),
    }),
  ]);

  if (!Array.isArray(pvpokeData) || pvpokeData.length === 0) {
    throw new Error("pvpoke pokemon.json 格式異常或為空陣列");
  }
  if (Array.isArray(graphqlResponse?.errors) && graphqlResponse.errors.length > 0) {
    throw new Error(
      `PokéAPI GraphQL 錯誤: ${JSON.stringify(graphqlResponse.errors)}`,
    );
  }

  const speciesList = graphqlResponse?.data?.species;
  const pokemonList = graphqlResponse?.data?.pokemon;
  if (!Array.isArray(speciesList) || speciesList.length === 0) {
    throw new Error("PokéAPI GraphQL species 資料異常或為空");
  }
  if (!Array.isArray(pokemonList) || pokemonList.length === 0) {
    throw new Error("PokéAPI GraphQL pokemon 資料異常或為空");
  }

  const pokemonBySlug = new Map();
  const defaultPokemonByDexId = new Map();
  for (const p of pokemonList) {
    pokemonBySlug.set(p.name, p);
    if (p.is_default) {
      defaultPokemonByDexId.set(p.pokemon_species_id, p);
    }
  }

  const speciesByDexId = new Map();
  for (const s of speciesList) {
    const zhName = s.names?.[0]?.name?.trim();
    if (!zhName) continue;
    speciesByDexId.set(s.id, {
      dexId: s.id,
      name: s.name,
      zhName,
      defaultPokemon: defaultPokemonByDexId.get(s.id) ?? null,
    });
  }

  // 依 (dexId, form) 分組，帕底亞肯泰羅亞型獨立保留
  const grouped = new Map();
  for (const entry of pvpokeData) {
    if (!entry || typeof entry.speciesId !== "string") continue;
    if (isExcludedEntry(entry)) continue;

    const dexId = Number(entry.dex);
    if (!Number.isInteger(dexId) || dexId <= 0) continue;
    if (!speciesByDexId.has(dexId)) continue;

    const form = detectRegionalForm(entry);

    // 排除非指定地區型的其他標籤型態（例如未列為 paldean sub-breed 的純區域占位）
    if (entry.speciesId === "tauros_paldean") continue;

    const groupKey =
      entry.speciesId in PALDEAN_TAUROS_OVERRIDES
        ? entry.speciesId
        : `${dexId}:${form}`;

    const list = grouped.get(groupKey) ?? [];
    list.push(entry);
    grouped.set(groupKey, list);
  }

  const warnings = [];
  const roster = [];

  for (const [groupKey, entries] of grouped.entries()) {
    const first = entries[0];
    const dexId = Number(first.dex);
    const speciesInfo = speciesByDexId.get(dexId);
    const form = detectRegionalForm(first);

    const selected =
      groupKey in PALDEAN_TAUROS_OVERRIDES
        ? first
        : selectCanonicalEntryForGroup(entries, form, speciesInfo);

    if (!selected) continue;

    const id = selected.speciesId;
    const taurosOverride = PALDEAN_TAUROS_OVERRIDES[id];

    let pokeApiPokemon = null;
    if (taurosOverride) {
      pokeApiPokemon = pokemonBySlug.get(taurosOverride.pokeApiSlug) ?? null;
    } else if (form === "normal") {
      pokeApiPokemon = speciesInfo.defaultPokemon;
    } else {
      const baseSlug = speciesInfo.name;
      const suffix = FORM_POKEAPI_SUFFIX[form];
      pokeApiPokemon =
        pokemonBySlug.get(`${baseSlug}${suffix}`) ??
        pokemonBySlug.get(`${baseSlug}${suffix}-standard`) ??
        null;
    }

    const zhName = taurosOverride
      ? taurosOverride.zhName
      : `${FORM_ZH_PREFIX[form]}${speciesInfo.zhName}`;

    const spriteUrl = resolveSpriteUrl(pokeApiPokemon, dexId, id, warnings);
    const types = normalizeTypes(selected.types, id);
    const maxCp = computeLv50MaxCp(selected.baseStats);

    const record = {
      id,
      dexId,
      zhName,
      enName: String(selected.speciesName || id).trim(),
      form,
      types,
      spriteUrl,
      baseAttack: Math.round(selected.baseStats.atk),
      baseDefense: Math.round(selected.baseStats.def),
      baseStamina: Math.round(selected.baseStats.hp),
      maxCp,
    };

    validateRecord(record);
    roster.push(record);
  }

  if (roster.length === 0) {
    throw new Error("過濾與合併後結果為 0 筆，中止寫入以保護既有資料");
  }

  // 確定性排序：dexId 升冪 -> form 順序 -> id 升冪
  roster.sort(
    (a, b) =>
      a.dexId - b.dexId ||
      FORM_ORDER[a.form] - FORM_ORDER[b.form] ||
      a.id.localeCompare(b.id, "en"),
  );

  const jsonContent = `${JSON.stringify(roster, null, 2)}\n`;
  const rawBytes = Buffer.byteLength(jsonContent, "utf8");
  const gzipBytes = gzipSync(jsonContent).byteLength;

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  try {
    await writeFile(TEMP_PATH, jsonContent, "utf8");
    await rename(TEMP_PATH, OUTPUT_PATH);
  } catch (err) {
    await rm(TEMP_PATH, { force: true });
    throw err;
  }

  for (const warn of warnings) {
    console.warn(warn);
  }

  const formCounts = roster.reduce((acc, item) => {
    acc[item.form] = (acc[item.form] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`同步完成：共 ${roster.length} 筆寶可夢`);
  console.log(`型態統計：${JSON.stringify(formCounts)}`);
  console.log(`圖片降級警告：${warnings.length} 筆`);
  console.log(
    `檔案體積：raw ${(rawBytes / 1024).toFixed(2)} KB / gzip ${(gzipBytes / 1024).toFixed(2)} KB`,
  );

  if (gzipBytes >= 60 * 1024) {
    console.warn(
      `警告：gzip 體積 ${(gzipBytes / 1024).toFixed(2)} KB 已達或超過 60 KB 目標上限`,
    );
  }
}

main().catch((error) => {
  console.error("同步失敗（已保留既有靜態資料，未進行覆寫）：", error);
  process.exit(1);
});
