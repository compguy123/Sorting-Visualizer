/**
 * @param {"blue" | "silver" | "gold" | "pink" | "green" | "red" | "beige"} colour 
 */
function createBabySprite(colour) {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("baby");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("baby_shadow", "pixelart", "offset-silver");
    imgShadow.src = "assets/SilverShadow.png";
    imgShadow.alt = "Shadow";

    /**
     * @param {string} str 
     * @returns {string}
     */
    const src = str => `assets/${str[0].toUpperCase() + str.slice(1)}SpriteSheet.png`;
    const imgChar = document.createElement("img");
    imgChar.classList.add("baby_sprite", "pixelart", "offset-silver");
    imgChar.src = src(colour);
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    return imgDiv;
}
export function getAllBabyFunc() {
    const colours = [
        "silver",
        "gold",
        "pink",
        "blue",
        "green",
        "red",
        "beige",
    ];
    return colours.map(x => () => createBabySprite(x));
}
export function createImgGetter() {
    const dict = {};
    const imgPicker = (function* () {
        while (true) {
            for (const imgFunc of getAllBabyFunc()) {
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
//TODO: add functions to create imgs for other sprites here...


