

const KEY = import.meta.env.PUBLIC_PEXELS_KEY as string | undefined;

export interface StockPhoto {
  id: number;
  thumb: string; 
  full: string; 
  photographer: string;
  photographerUrl: string;
}

export function hasPexels(): boolean {
  return Boolean(KEY);
}

interface PexelsPhoto {
  id: number;
  photographer: string;
  photographer_url: string;
  src: { medium: string; large2x: string; large: string };
}

function map(p: PexelsPhoto): StockPhoto {
  return {
    id: p.id,
    thumb: p.src.medium,
    full: p.src.large2x || p.src.large,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
  };
}

async function call(url: string): Promise<StockPhoto[]> {
  if (!KEY) throw new Error('Pexels API key not configured.');
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels request failed (${res.status})`);
  const data = (await res.json()) as { photos: PexelsPhoto[] };
  return (data.photos ?? []).map(map);
}

export function searchPhotos(query: string, page = 1, perPage = 24): Promise<StockPhoto[]> {
  const q = encodeURIComponent(query.trim());
  return call(`https://api.pexels.com/v1/search?query=${q}&per_page=${perPage}&page=${page}`);
}

export function curatedPhotos(page = 1, perPage = 24): Promise<StockPhoto[]> {
  return call(`https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`);
}
