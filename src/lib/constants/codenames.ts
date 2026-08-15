export const Codenames = {
    "Rogerio Herminio da Silva": "Vendedor1",
    "Andre Meller": "Vendedor2",
    "Jéssica Moura": "Vendedor3",
    "Monitor": "Vendedor4",
    "Nadja Gomes": "Vendedor5",
    "Guilherme Ramos": "Vendedor6",
    "Tiago Crepaldi": "Vendedor7",
    "Camila Zapata": "Vendedor8",
    "Nata Borges": "Vendedor9",
    "Inexistente": "Vendedor10",
    "Juliano Pereira": "Vendedor11",
    "Deise Oliveira": "Vendedor12",
    "Diego": "Vendedor13",
    "João": "Vendedor14",
    "Larissa de Oliveira": "Vendedor15",
    "Deiberto Joaz": "Vendedor16",
    "Pamela Wayne": "Vendedor17",
    "Elinton Assis": "Vendedor18",
    "Recorrencia": "Vendedor19",
} as const;

export function getCodename(name: string | null): string {
    if (!name) return "_";
    const trimmed = name.trim();
    // Try direct match first
    if (trimmed in Codenames) return Codenames[trimmed as keyof typeof Codenames];

    // Case-insensitive match
    const lower = trimmed.toLowerCase();
    for (const key of Object.keys(Codenames)) {
        if (key.toLowerCase() === lower) return Codenames[key as keyof typeof Codenames];
    }

    // Try matching by first name token (e.g., 'João Silva' -> 'João')
    const firstToken = trimmed.split(/\s+/)[0];
    for (const key of Object.keys(Codenames)) {
        if (key.toLowerCase() === firstToken.toLowerCase()) return Codenames[key as keyof typeof Codenames];
    }

    return "Vendedor X";
}
