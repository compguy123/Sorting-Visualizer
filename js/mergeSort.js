// @ts-check
import * as images from "./images.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const title = "Merge Sort";
    document.title = `Sorting Visualizer - ${title}`;

    const sortTitleEl = document.querySelector("#sort-title");
    if (!sortTitleEl) throw new Error("failed to find #sort-title html element");
    sortTitleEl.textContent = title;

    const mainEl = document.querySelector("#sorting-visual");
    if (!mainEl) throw new Error("failed to find #sorting-visual html element");

    createVisualSortTree(mainEl, [
        [[6, 5, 12, 10, 9, 1]],
        [[6, 5, 12], [10, 9, 1]],
        [[6], [5, 12], [10], [9, 1]],
        [[6], [5], [12], [10], [9], [1]],
        [[6], [5, 12], [10], [1, 9]],
        [[5, 6, 12], [1, 9, 10]],
        [[1, 5, 6, 9, 10, 12]],
    ]);

    const sourceImpl = `function merge(left, right) {
    let arr = [];
    // Break out of loop if any one of the array gets empty
    while (left.length && right.length) {
        // Pick the smaller among the smallest element of left and right sub arrays
        if (left[0] < right[0]) {
            arr.push(left.shift());
        } else {
            arr.push(right.shift());
        }
    }
    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [...arr, ...left, ...right];
}

function mergeSort(array) {
    const half = array.length / 2;
    // Base case or terminating case
    if (array.length < 2) {
        return array;
    }
    const left = array.splice(0, half);
    return merge(mergeSort(left), mergeSort(array));
}`;

    const implementationEl = document.querySelector("#implementation");
    if (!implementationEl) throw new Error("failed to find #implementation html element");

    implementationEl.textContent = sourceImpl;
});
