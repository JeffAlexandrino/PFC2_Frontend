const CACHE_KEY = "cotacao_usd_brl";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

export async function getUSDtoBRLRate(): Promise<number> {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as { rate: number; ts: number };
            if (Date.now() - parsed.ts < CACHE_TTL_MS) {
                return parsed.rate;
            }
        }
    } catch (e) {}

    // API
    const url =
        "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL?token=0af65c75e8585b3f361428e440de3a457cc1cbb4b9313d68cd89cb9d4d548c76";
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Erro ao buscar cotação");
    const json = await resp.json();
    const rate = Number(json?.USDBRL?.bid ?? NaN);
    if (!rate || isNaN(rate)) throw new Error("Cotação inválida");

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() }));
    } catch (e) {}

    return rate;
}
