// @ts-check
import { sorting } from "./util.js";

/**
 * @param {"blue" | "silver" | "gold" | "pink" | "green" | "red" | "beige"} colour 
 */
function createSilverSprite(colour) {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("silver");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("silver_shadow", "pixelart", "offset-silver");
    imgShadow.src = "assets/SilverShadow.png";
    imgShadow.alt = "Shadow";

    /**
     * @param {string} str 
     * @returns {string}
     */
    const src = str => `assets/${str[0].toUpperCase() + str.slice(1)}SpriteSheet.png`;
    const imgChar = document.createElement("img");
    imgChar.classList.add("silver_man", "pixelart", "offset-silver");
    imgChar.src = src(colour);
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    return imgDiv;
}

function getAllSilverFunc() {
    const colours = [
        "silver",
        "gold",
        "pink",
        "blue",
        "green",
        "red",
        "beige",
    ];
    // @ts-ignore
    return colours.map(x => () => createSilverSprite(x));
}

function createBabySprite() {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("baby", "offset-baby");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("silver_shadow", "pixelart", "offset-baby");
    imgShadow.src = "assets/SilverShadow.png";
    imgShadow.alt = "Shadow";

    const imgChar = document.createElement("img");
    imgChar.classList.add("baby_sprite", "pixelart", "offset-baby");
    imgChar.src = "assets/baby.png";
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    return imgDiv;
}

function createBoySprite() {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("boy", "offset-boy");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("silver_shadow", "pixelart", "offset-boy");
    imgShadow.src = "assets/SilverShadow.png";
    imgShadow.alt = "Shadow";

    const imgChar = document.createElement("img");
    imgChar.classList.add("boy_sprite", "pixelart", "offset-boy");
    imgChar.src = "assets/boy.png";
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    return imgDiv;
}

function createKidSprite() {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("kid", "offset-kid");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("silver_shadow", "pixelart", "offset-kid");
    imgShadow.src = "assets/SilverShadow.png";
    imgShadow.alt = "Shadow";

    const imgChar = document.createElement("img");
    imgChar.classList.add("kid_sprite", "pixelart", "offset-kid");
    imgChar.src = "assets/kid.png";
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    return imgDiv;
}


export function createImgGetter() {
    const dict = {};
    const imgPicker = (function* () {
        const silvers = getAllSilverFunc();
        silvers.sort(sorting.random);
        silvers.splice(0, silvers.length / 2);

        const imgs = [...silvers];
        imgs.push(createBabySprite);
        imgs.push(createBoySprite);
        imgs.push(createKidSprite);
        imgs.sort(sorting.random);
        while (true) {
            for (const imgFunc of imgs) {
                yield imgFunc;
            }
        }
    })();
    /**
     * @param {number} num
     * @returns {() => HTMLDivElement}
     */
    const imgGetter = (num) => {
        if (num in dict) return dict[num];
        dict[num] = imgPicker.next().value;
        return dict[num];
    };
    return imgGetter;
}
