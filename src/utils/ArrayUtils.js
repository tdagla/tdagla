/**
 * @template T
 *
 * @param {T[]} array
 * @param {function(T,T):number} comparator
 * @returns {T}
 */
export function findMax(array, comparator) {
    let maxItem = array[0];
    array.forEach(item => {
        if (comparator(item, maxItem) > 0) {
            maxItem = item;
        }
    })
    return maxItem;
}

/**
 * @template T
 *
 * @param {T[]} array
 * @param {function(T, i):boolean} predicate
 * @returns {T}
 */
export function find(array, predicate) {
    let result = null;
    array.forEach((item, i) => {
        if (predicate(item, i)) {
            result = item;
        }
    })
    return result;
}

/**
 * @template T
 *
 * @param {T[]} array
 * @param {T} item
 * @returns {boolean}
 */
export function removeItemFrom(array, item) {
    let index = array.indexOf(item)
    if (index === -1) return false
    array.splice(index, 1)
    return true
}

export const ArrayUtils = {
    findMax,
    find,
    removeItemFrom,
}
