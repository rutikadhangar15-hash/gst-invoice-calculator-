const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

async function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter a description first!");
        return;
    }

    // 1. Reset button and gallery state
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";
    imageGallery.innerHTML = "";
    
    // 2. Pre-create the 4 card slots
    for (let i = 0; i < 4; i++) {
        imageGallery.innerHTML += `<div class="img-card"><p>Creating...</p></div>`;
    }

    const cards = document.querySelectorAll(".img-card");

    // 3. Fetch images one by one
    for (let i = 0; i < 4; i++) {
        const cleanPrompt = encodeURIComponent(promptText);
        const randomSeed = Math.floor(Math.random() * 999999) + i;
        const imgUrl = `https://image.pollinations.ai/p/${cleanPrompt}?width=500&height=500&seed=${randomSeed}&nofeed=true`;
        
        const img = new Image();
        img.src = imgUrl;

        img.onload = () => {
            cards[i].innerHTML = ""; // Remove "Creating..."
            cards[i].appendChild(img); // Add the actual image
        };

        img.onerror = () => {
            cards[i].innerHTML = "<p>Failed to load</p>";
        };
    }

    // 4. Reset button after initiating the requests
    generateBtn.disabled = false;
    generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);
