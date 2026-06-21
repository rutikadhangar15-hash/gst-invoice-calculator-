const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");
function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) return;

    generateBtn.innerText = "Generating...";
    imageGallery.innerHTML = "";

    for (let i = 0; i < 4; i++) {
        const card = document.createElement("div");
        card.className = "img-card";
        imageGallery.appendChild(card);

        const seed = Math.floor(Math.random() * 100000);
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=500&height=500&seed=${seed}&nologo=true`;

        // Direct image injection: This avoids the "fetch" security block
        card.innerHTML = `<img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;">`;
    }
    
    generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);
