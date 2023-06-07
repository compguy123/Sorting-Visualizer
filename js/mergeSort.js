// @ts-check
import * as images from "./images.js";
import { chunkBySize, sorting } from "./util.js";

const imgGetter = images.createImgGetter();
/**
 * Creates an element of a group
 * @param {number} number
 * @param {number | null} id
 **/
function createStepItem(number, id = null) {
    const div = document.createElement("div");
    div.classList.add("g-item");
    if (id !== null) {
        div.classList.add(`g-item-${id}`);
        div.dataset.index = id.toString();
    }
    div.dataset.value = number.toString();

    const imgFunc = imgGetter(number);
    const imgDiv = imgFunc();
    div.appendChild(imgDiv);

    const span = document.createElement("span");
    span.textContent = number.toString();
    div.appendChild(span);

    return div;
}




/**
 * Creates a group of a step
 * @param {number[]} numbers
 * @param {number | null} id
 **/
function createStepItemGroup(numbers, id = null) {
    const div = document.createElement("div");
    div.classList.add("group");
    if (id !== null) {
        div.classList.add(`group-${id}`);
        div.dataset.index = id.toString();
    }
    const children = numbers.map((x, i) => createStepItem(x, i));
    for (const child of children) {
        div.appendChild(child);
    }
    return div;
}

/**
 * @param {HTMLElement} step
 * @param {number[]} array
 * @param {number | null} id
 **/
function addGroupToStep(step, array, id = null) {
    const group = array;
    const groupDiv = createStepItemGroup(group, id);
    if (groupDiv.children?.length === 0) {
        return;
    }
    step.appendChild(groupDiv);
}

/**
 * Creates a step with multiple groups
 * @param {number[][]} arrays
 * @param {number | null} id
 **/
function createStepMultiple(arrays, id = null) {
    const step = document.createElement("section");
    step.classList.add("step");
    if (id !== null) {
        step.classList.add(`step-${id}`);
        step.dataset.index = id.toString();
    }
    let groupCounter = 0;
    for (const array of arrays) {
        addGroupToStep(step, array, groupCounter++);
    }
    return step;
}

/**
 * Creates steps according to `arrayOfSteps` and then appends them to `mainEl`
 * @param {Element} mainEl
 * @param {number[][][]} arrayOfSteps 
 **/
function createVisualSortTree(mainEl, arrayOfSteps) {
    for (let i = 0; i < arrayOfSteps.length; i++) {
        const stepArray = arrayOfSteps[i];
        const stepEl = createStepMultiple(stepArray, i);
        mainEl.appendChild(stepEl);
    }
}

/**
 * @param {number[][]} numbers
 */
function* mergeSortStepGenerator(numbers) {
    if (!numbers || numbers.length <= 0 || numbers[0].length <= 0) {
        return [];
    }

    /** @type {number[][][]} */
    const tracker = [];

    // deep clone to avoid external mutation and ensure unique values
    let temp = deepClone(numbers).map(x => Array.from(new Set(x)));

    // return steps that break up the elements into groups/chunks
    yield deepClone(temp);
    tracker.push(temp);

    let innerMaxLength = maxBy(temp, x => x.length);
    while (innerMaxLength !== 1) {
        //should only hit this once (this should always create the 3rd last step)
        if (temp.filter(x => x.length === 3).length > temp.filter(x => x.length !== 3).length) {
            const twoChunked = temp.flatMap(x => chunk(2, x));
            innerMaxLength = maxBy(twoChunked, x => x.length);
            yield deepClone(twoChunked);
            temp = twoChunked;
            tracker.push(deepClone(twoChunked));
            continue;
        }

        const chunked = temp.flatMap(x => chunk(Math.max(x.length / 2, 1), x));
        innerMaxLength = maxBy(chunked, x => x.length);
        yield deepClone(chunked);
        temp = chunked;
        tracker.push(deepClone(chunked));
    }

    // take broken up groups and merge + sort them into bigger groups until original length
    /// input --> [[6], [5], [12], [10], [9], [1]]
    /// 1. --> [[6], [5, 12], [10], [1, 9]]
    /// 2. --> [[5, 6, 12], [1, 9, 10]]
    /// 3. --> [[1, 5, 6, 9, 10, 12]]
    temp = [];
    tracker.pop();
    tracker.reverse();
    for (const t of tracker) {
        t.forEach(x => x.sort(sorting.ascending));
        yield t;
    }

    /**
     * @template T
     * @param {T} array
     * @returns {T}
     */
    function deepClone(array) {
        return JSON.parse(JSON.stringify(array));
    }
    /**
     * @template T
     * @param {T[]} array
     * @param {(value: T) => number} selector
     * @returns {number}
     */
    function maxBy(array, selector) {
        return array.map(selector).sort(sorting.descending)[0];
    }
    /**
     * @template T
     * @param {number} size
     * @param {T[]} array
     */
    function chunk(size, array) {
        return [...chunkBySize(size, array)];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const title = "Merge Sort";
    document.title = `Sorting Visualizer - ${title}`;

    const sortTitleEl = document.querySelector("#sort-title");
    if (!sortTitleEl) throw new Error("failed to find #sort-title html element");
    sortTitleEl.textContent = title;

    const mainEl = document.querySelector("#sorting-visual");
    if (!mainEl) throw new Error("failed to find #sorting-visual html element");


    const input = [[94, 12, 5, 34, 9]];
    const steps = [...mergeSortStepGenerator(input)];
    createVisualSortTree(mainEl, steps);


    /********Highlighting mergesort code when the button is clicked********* */
    let lineCounter = 0;
    const linesArr = [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
    const highlightButton = document.getElementById("highlightButton");
    if (highlightButton) {
        highlightButton.addEventListener("click", highlightLine);
    }

    function highlightLine() {
        const mergeCode = document.getElementById("mergeSortSnippet");
        if (mergeCode == null) {
            console.log("Element with ID 'mergeSortSnippet' not found.");
            return;
        }

        const lines = mergeCode.innerHTML.split("\n");

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace('<span class="highlighted">', '');
            lines[i] = lines[i].replace('</span>', '');
        }

        lines[linesArr[lineCounter]] = `<span class="highlighted">${lines[linesArr[lineCounter]]}</span>`;
        lineCounter++;
        if (lineCounter == linesArr.length)
            reset();
        mergeCode.innerHTML = lines.join("\n");
    }

    function reset() {
        lineCounter = 0;
    }
    /**************** */
});
