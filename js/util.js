// @ts-check
/**
 * Splits an array into chunks i.e `[1,2,3,4]` -> `[[1,2],[3,4]]`
 * @template T
 * @param {number} chunkSize
 * @param {T[]} array
 * @return {Generator<T[], void, unknown>}
 **/
function* chunkBySize(chunkSize, array) {
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        yield chunk;
    }
}

export const random = {
    /**
     * The maximum is inclusive and the minimum is inclusive
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    inclusiveBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    /**
     * The maximum is inclusive
     * @param {number} max
     * @returns {number}
     */
    inclusive(max) {
        return this.inclusiveBetween(0, max);
    },
};
export const sorting = {
    /**
     * random compare
     * @template T
     * @param {T} a
     * @param {T} b
     */
    random(a, b) {
        return random.inclusive(3);
    },
    /**
     * ascending compare
     * @param {number} a
     * @param {number} b
     */
    ascending: function (a, b) {
        return (+a) - (+b);
    },

    /**
     * descending compare
     * @param {number} a
     * @param {number} b
     */
    descending: function (a, b) {
        return (+a) + (+b);
    },
};

/**
 * @template T
 * @param {T} object
 * @returns {T}
 */
export function deepClone(object) {
    // return JSON.parse(JSON.stringify(object));
    return structuredClone(object);
}

export const linq = {
    /**
      * @template T
      * @param {T[]} array
      * @param {(value: T) => number} selector
      * @returns {number}
      */
    maxBy(array, selector) {
        return array.map(selector).sort(sorting.descending)[0];
    },
    /**
     * @template T
     * @param {number} size
     * @param {T[]} array
     */
    chunk(size, array) {
        return [...chunkBySize(size, array)];
    },
};