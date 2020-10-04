import fetch from 'cross-fetch';

// Fetch a T from a URL.
export async function fetchFromUrl<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json();
        return Promise.reject(error);
    }
    let result = await res.json();
    return result;
}

// Fetch a T from a URL, use the provided cache.
export async function fetchWithCache<T>(url: string, cache: Map<string, T>): Promise<T> {
    // check in cache
    if (cache.has(url)) {
        //console.log("Cache hit!");
        let result = cache.get(url);
        if (!result) {
            throw Error("Assertion error: cached object not found");
        }
        return result;
    }
    //console.log(`Cache miss, fetching from: ${url}`);
    const res: T = await fetchFromUrl(url);
    // add to cache and resolve
    cache.set(url, res);
    //console.log(`returning result from: ${url}`);
    return res;
}
