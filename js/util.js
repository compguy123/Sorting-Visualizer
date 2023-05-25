// @ts-check
/**
 * Splits an array into chunks i.e `[1,2,3,4]` -> `[[1,2],[3,4]]`
 * @template T
 * @param {number} chunkSize
 * @param {T[]} array
 * @return {Generator<T[], void, unknown>}
 **/
export function* chunkBySize(chunkSize, array) {
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        yield chunk;
    }
}
