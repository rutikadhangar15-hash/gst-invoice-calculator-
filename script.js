const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

async function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter a description first!");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    // 1. Reset the gallery and create 4 empty placeholders
    imageGallery.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        imageGallery.innerHTML += `<div class="img-card"><p>Creating...</p></div>`;
    }

    const cards = document.querySelectorAll(".img-card");

    // 2. Fetch images
    for (let i = 0; i < 4; i++) {
        const cleanPrompt = encodeURIComponent(promptText);
        const randomSeed = Math.floor(Math.random() * 999999) + i;
        const imgUrl = `https://image.pollinations.ai/p/${cleanPrompt}?width=500&height=500&seed=${randomSeed}&nofeed=true`;
        
        cards[i].innerHTML = `<img src="${imgUrl}" alt="AI Image ${i + 1}">`;
    }

    generateBtn.disabled = false;
    generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);
