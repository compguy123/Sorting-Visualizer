export function createSilver() {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("baby");
    const imgShadow = document.createElement("img");
    imgShadow.classList.add("baby_shadow", "pixelart", "offset-silver");
    imgShadow.src = "assets/SilverShadow.png";
    imgShadow.alt = "Shadow";

    const imgChar = document.createElement("img");
    imgChar.classList.add("baby_sprite", "pixelart", "offset-silver");
    imgChar.src = "assets/SilverSpriteSheet.png";
    imgChar.alt = "Character";
    imgDiv.appendChild(imgShadow);
    imgDiv.appendChild(imgChar);
    return imgDiv;
}

//TODO: add functions to create imgs for other sprites here...


