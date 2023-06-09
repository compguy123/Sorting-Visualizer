// @ts-check
import { StepManager } from "./stepManager.js";
import { linq, deepClone, sorting } from "./util.js";

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

    let innerMaxLength = linq.maxBy(temp, x => x.length);
    while (innerMaxLength !== 1) {
        //should only hit this once (this should always create the 3rd last step)
        if (temp.filter(x => x.length === 3).length > temp.filter(x => x.length !== 3).length) {
            const twoChunked = temp.flatMap(x => linq.chunk(2, x));
            innerMaxLength = linq.maxBy(twoChunked, x => x.length);
            yield deepClone(twoChunked);
            temp = twoChunked;
            tracker.push(deepClone(twoChunked));
            continue;
        }

        const chunked = temp.flatMap(x => linq.chunk(Math.max(x.length / 2, 1), x));
        innerMaxLength = linq.maxBy(chunked, x => x.length);
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
}

document.addEventListener("DOMContentLoaded", () => {
    const title = "Merge Sort";
    document.title = `Sorting Visualizer - ${title}`;

    const sortTitleEl = document.querySelector("#sort-title");
    if (!sortTitleEl) throw new Error("failed to find #sort-title html element");
    sortTitleEl.textContent = title;

    const mainEl = document.querySelector("#sorting-visual");
    if (!mainEl) throw new Error("failed to find #sorting-visual html element");



    /*
    example steps:
    [
        [ [6, 5, 12, 10, 9, 1] ],
        [ [6, 5, 12], [10, 9, 1] ],
        [ [6], [5, 12], [10], [9, 1] ],
        [ [6], [5], [12], [10], [9], [1] ],
        [ [6], [5, 12], [10], [1, 9] ],
        [ [5, 6, 12], [1, 9, 10] ],
        [ [1, 5, 6, 9, 10, 12] ],
    ]
    steps[0] ==> step1
    steps[0][0] ==> step1's 1st group
    steps[0][0][0] ==> step1 1st group's 1st element
    */
    const input = [[94, 12, 5, 34, 9]];
    const steps = [...mergeSortStepGenerator(input)];
    const stepManager = new StepManager("main", steps);

    const nextStepButton = document.querySelector("#nextStepButton");
    if (!nextStepButton) throw new Error("failed to find #nextStepButton html element");
    nextStepButton.addEventListener("click", stepManager.hideAndCreateStepper());

    mainEl.replaceWith(stepManager.domElement);



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
