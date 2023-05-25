// @ts-check
import { chunkBySize } from "./util.js";

/**
 * @param {number[]} left
 * @param {number[]} right
 */
function merge(left, right) {
    /** @type {number[]} */
    let arr = [];
    // Break out of loop if any one of the array gets empty
    while (left.length && right.length) {
        // Pick the smaller among the smallest element of left and right sub arrays
        if (left[0] < right[0]) {
            const l = left.shift();
            if (l === undefined) throw new Error("this shouldn't happen.");
            arr.push(l);
        } else {
            const r = right.shift();
            if (r === undefined) throw new Error("this shouldn't happen.");
            arr.push(r);
        }
    }
    // console.log("arr", arr, "left", left, "right", right);

    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [...arr, ...left, ...right];
}

/**
 * @param {number[]} array
 * @returns {number[]}
 */
export function mergeSort(array) {
    const half = array.length / 2;

    // Base case or terminating case
    if (array.length < 2) {
        return array;
    }

    const left = array.splice(0, half);
    // console.log("left", left, "right", array);
    return merge(mergeSort(left), mergeSort(array));
}

/**
 * Creates an element of a group
 * @param {number} number
 **/
function createStepItem(number) {
    const div = document.createElement("div");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("baby");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("baby_shadow", "pixelart", "offset-silver");
    imgShadow.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/DemoRpgCharacterShadow.png";
    imgShadow.alt = "Shadow";

    const imgChar = document.createElement("img");
    imgChar.classList.add("baby_sprite", "pixelart", "offset-silver");
    imgChar.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/DemoRpgCharacter.png";
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    div.appendChild(imgDiv);

    const span = document.createElement("span");
    div.classList.add("g-item");
    span.textContent = number.toString();
    div.appendChild(span);

    return div;
}

/**
 * Creates a group of a step
 * @param {number[]} numbers
 **/
function createStepItemGroup(numbers) {
    const div = document.createElement("div");
    div.classList.add("group");
    const children = numbers.map(x => createStepItem(x));
    for (const child of children) {
        div.appendChild(child);
    }
    return div;
}

/**
 * @param {HTMLElement} step
 * @param {number[]} array
 * @param {boolean} shouldSplit
 **/
function addGroupToStep(step, array, shouldSplit = true) {
    const groups = chunkBySize(shouldSplit ? array.length / 2 : array.length, array);
    for (const group of groups) {
        const groupDiv = createStepItemGroup(group);
        if (groupDiv.children?.length === 0) {
            continue;
        }
        step.appendChild(groupDiv);
    }
}

/**
 * Creates a step with a single group
 * @param {number[]} array
 **/
function createStepSingle(array) {
    const step = document.createElement("section");
    step.classList.add("step");
    addGroupToStep(step, array, false);
    return step;
}

/**
 * Creates a step with multiple groups
 * @param {number[][]} arrays
 **/
function createStepMultiple(arrays) {
    const step = document.createElement("section");
    step.classList.add("step");
    for (const array of arrays) {
        addGroupToStep(step, array);
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
        const stepEl = i === 0 || i === arrayOfSteps.length - 1
            ? createStepSingle(stepArray.flat())
            : createStepMultiple(stepArray);

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
        [[6, 5, 12, 10, 9, 1]],
        [[6, 5, 12], [10, 9, 1]],
        [[6], [5, 12], [10], [9, 1]],
        [[6, 5, 12], [10, 1, 9]],
        [[5, 6, 12, 1, 9, 10]],
        [[1, 5, 6, 9, 10, 12]],
    ]);
});
