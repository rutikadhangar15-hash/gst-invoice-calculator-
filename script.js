const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");
async function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) return;

    generateBtn.innerText = "Generating...";
    imageGallery.innerHTML = "";

    for (let i = 0; i < 4; i++) {
        const card = document.createElement("div");
        card.className = "img-card";
        card.innerHTML = "Loading...";
        imageGallery.appendChild(card);

        const seed = Math.floor(Math.random() * 100000);
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=500&height=500&seed=${seed}&nologo=true`;

        // Use 'fetch' to check if the image is actually available before trying to show it
        try {
            const response = await fetch(imgUrl);
            if (response.ok) {
                const img = document.createElement("img");
                img.src = imgUrl;
                card.innerHTML = "";
                card.appendChild(img);
            } else {
                card.innerHTML = "Server Busy";
            }
        } catch (error) {
            card.innerHTML = "Blocked";
        }
    }
    generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);
