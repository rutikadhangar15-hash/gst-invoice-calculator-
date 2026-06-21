const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

async function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter a description first!");
        return;
    }

    // 1. Disable button and clear gallery
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";
    imageGallery.innerHTML = "";

    // 2. Pre-create the 4 empty card slots
    for (let i = 0; i < 4; i++) {
        imageGallery.innerHTML += `<div class="img-card"><p>Creating...</p></div>`;
    }

    const cards = document.querySelectorAll(".img-card");

    // 3. Staggered image loading
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const cleanPrompt = encodeURIComponent(promptText);
            const randomSeed = Math.floor(Math.random() * 999999) + i;
            const imgUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=500&height=500&seed=${randomSeed}&nologo=true`;

            const img = new Image();
            img.src = imgUrl;

            img.onload = () => {
                cards[i].innerHTML = "";
                cards[i].appendChild(img);
            };

            img.onerror = () => {
                cards[i].innerHTML = "<p>Failed to load</p>";
            };
        }, i * 500);
    }

    // 4. Re-enable button after a short delay
    setTimeout(() => {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
    }, 2500);
}

generateBtn.addEventListener("click", generateImages);
