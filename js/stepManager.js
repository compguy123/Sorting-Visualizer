// @ts-check
import * as images from "./images.js";

export class StepManager {
    #type = "STEP_MANAGER";
    /** @type {keyof HTMLElementTagNameMap} */
    #elementType;

    /** @type {Step[]} */
    #steps = [];

    /** @type {HTMLElement} */
    #domElement;

    /**
     * @param {keyof HTMLElementTagNameMap} elementType
     * @param {number[][][]} steps
     */
    constructor(elementType, steps) {
        this.#elementType = elementType;
        this.#steps = this.#createChildren(steps);
        this.#domElement = this.#createDomElement();
    }

    get type() {
        return this.#type;
    }

    get steps() {
        return this.#steps;
    }

    get allStepGroups() {
        return this.#steps.map(step => step.stepGroups);
    }

    get allStepGroupItems() {
        return this.#steps.map(step => step.stepGroups.map(group => group.stepGroupItems));
    }

    get originalNumbers() {
        return this.#steps.map(step => step.stepGroups.map(group => group.stepGroupItems.map(item => item.value)));
    }

    get domElement() {
        return this.#domElement;
    }

    /**
     * @param {number[][][]} steps
     */
    #createChildren(steps) {
        return steps.map((x, i) => new Step(i, x));
    }

    #createDomElement() {
        const wrapper = document.createElement(this.#elementType);
        wrapper.classList.add("sorting-visual");
        for (let i = 0; i < this.#steps.length; i++) {
            const stepArray = this.#steps[i];
            const stepEl = stepArray.domElement;
            wrapper.appendChild(stepEl);
        }
        return wrapper;
    }

    hide() {
        this.#domElement.classList.add("hidden");
    }

    show() {
        this.#domElement.classList.remove("hidden");
    }

    hideAndCreateStepper() {
        const skipStepAmount = 1;
        const hiddenSteps = this.steps.slice(skipStepAmount);
        hideSteps(hiddenSteps);
        let stepCounter = 0;
        return () => {
            if (stepCounter >= hiddenSteps.length) {
                stepCounter = 0;
                hideSteps(hiddenSteps);
                return;
            }

            const stepToShow = hiddenSteps[stepCounter];
            const upComingStep = stepCounter + 1 < hiddenSteps.length
                ? hiddenSteps[stepCounter + 1]
                : null;
            // console.log(stepToShow);
            // console.log(upComingStep);
            const me = stepToShow.allStepGroupItems.flat(2).find(x => x.value === 94);

            const futureMe = upComingStep?.allStepGroupItems.flat(2).find(x => x.value === 94);
            if (futureMe && me) {
                const currentOffset = me.domElement.getBoundingClientRect();
                const futureOffset = futureMe.domElement.getBoundingClientRect();
                console.log(futureOffset);

                me.domElement.style.position = "relative";
                me.domElement.style.top = `${futureOffset.y - currentOffset.y}px`;
                me.domElement.style.left = `${futureOffset.x - currentOffset.x}px`;
                me.domElement.style.zIndex = "999";
            }


            stepToShow.domElement.style.transition = "all 500ms ease";

            // stepToShow.show(); // to show the whole step
            stepToShow.allStepGroupItems.flat().forEach(x => x.domElement.style.opacity = "100%");
            stepToShow.domElement.style.backgroundColor = "unset";
            stepToShow.domElement.style.borderRadius = "unset";
            //TODO: probably some animation logic goes here
            // - maybe we find the item in the next step (that's currently hidden)
            //   and then set a class or keep track of where it will be placed in the dom.
            //   With that you could translate the item to the next spot before calling step.show();
            stepCounter++;
        };

        /** @param {Step[]} steps */
        function hideSteps(steps) {
            for (const step of steps) {
                // step.hide(); // to hide the whole step
                step.allStepGroupItems.flat().forEach(x => x.domElement.style.opacity = "0%");
                step.domElement.style.backgroundColor = "rgb(10, 158, 226)";
                step.domElement.style.borderRadius = "0.5rem";
            }
        }
    }
}

export class Step {
    #type = "STEP";
    #index = -1;

    /** @type {StepGroup[]} */
    #stepGroups = [];

    /** @type {HTMLElement} */
    #domElement;

    /**
     * @param {number} index
     * @param {number[][]} groups
     */
    constructor(index, groups) {
        this.#index = index;
        this.#stepGroups = this.#createChildren(groups);

        const domElement = this.#createDomElement();
        if (!domElement) throw new Error(`Failed to create dom element for Step-${index}`);
        this.#domElement = domElement;
    }

    get type() {
        return this.#type;
    }

    get index() {
        return this.#index;
    }

    /** @type {StepGroup[]} */
    get stepGroups() {
        return this.#stepGroups;
    }

    get allStepGroupItems() {
        return this.#stepGroups.map(group => group.stepGroupItems);
    }

    get originalNumbers() {
        return this.#stepGroups.map(group => group.stepGroupItems.map(item => item.value));
    }

    get domElement() {
        return this.#domElement;
    }

    /** @param {number[][]} groups */
    #createChildren(groups) {
        return groups.map((x, i) => new StepGroup(i, x));
    }

    #createDomElement() {
        const step = document.createElement("section");
        step.classList.add("step");
        if (this.#index !== null) {
            step.classList.add(`step-${this.#index}`);
            step.dataset.index = this.#index.toString();
        }

        const groups = this.#stepGroups;
        for (const group of groups) {
            const groupDiv = group.domElement;
            if (groupDiv.children?.length === 0) {
                return;
            }
            step.appendChild(groupDiv);
        }
        return step;
    }

    hide() {
        this.#domElement.classList.add("hidden");
    }

    show() {
        this.#domElement.classList.remove("hidden");
    }
}

export class StepGroup {
    #type = "STEP_GROUP";
    #index = -1;

    /** @type {StepGroupItem[]} */
    #stepGroupItems = [];

    /** @type {HTMLElement} */
    #domElement;

    /**
     * @param {number} index
     * @param {number[]} numbers
     */
    constructor(index, numbers) {
        this.#index = index;
        this.#stepGroupItems = this.#createChildren(numbers);
        this.#domElement = this.#createDomElement();
    }

    get type() {
        return this.#type;
    }

    get index() {
        return this.#index;
    }

    /** @type {StepGroupItem[]} */
    get stepGroupItems() {
        return this.#stepGroupItems;
    }

    get originalNumbers() {
        return this.#stepGroupItems.map(item => item.value);
    }

    get domElement() {
        return this.#domElement;
    }

    /** @param {number[]} numbers */
    #createChildren(numbers) {
        return numbers.map((x, i) => new StepGroupItem(i, x));
    }

    #createDomElement() {
        const div = document.createElement("div");
        div.classList.add("group");
        if (this.#index !== null) {
            div.classList.add(`group-${this.#index}`);
            div.dataset.index = this.#index.toString();
        }
        const children = this.#stepGroupItems;
        for (const child of children) {
            div.appendChild(child.domElement);
        }
        return div;
    }

    hide() {
        this.#domElement.classList.add("hidden");
    }

    show() {
        this.#domElement.classList.remove("hidden");
    }
}

export class StepGroupItem {
    #type = "STEP_GROUP_ITEM";
    static #imgGetter = images.createImgGetter();

    #index = -1;
    #value = 0;

    /** @type {HTMLElement} */
    #domElement;

    /**
     * @param {number} index
     * @param {number} value
     */
    constructor(index, value) {
        this.#index = index;
        this.#value = value;
        this.#domElement = this.#createDomElement();
    }

    get type() {
        return this.#type;
    }

    get index() {
        return this.#index;
    }

    get value() {
        return this.#value;
    }

    get domElement() {
        return this.#domElement;
    }

    #createDomElement() {
        const div = document.createElement("div");
        div.classList.add("g-item");
        if (this.#index !== null) {
            div.classList.add(`g-item-${this.#index}`);
            div.dataset.index = this.#index.toString();
        }
        div.dataset.value = this.#value.toString();

        const imgFunc = StepGroupItem.#imgGetter(this.#value);
        const imgDiv = imgFunc();
        div.appendChild(imgDiv);

        const span = document.createElement("span");
        span.textContent = this.#value.toString();
        div.appendChild(span);

        return div;
    }

    hide() {
        this.#domElement.classList.add("hidden");
    }

    show() {
        this.#domElement.classList.remove("hidden");
    }
}
