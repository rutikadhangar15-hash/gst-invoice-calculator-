const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter text!");
        return;
    }

    generateBtn.innerText = "Generating...";
    imageGallery.innerHTML = "";

    // We add a tiny delay to each image so the browser doesn't block them
    for (let i = 0; i < 4; i++) {
        const seed = Math.floor(Math.random() * 100000);
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?seed=${seed}&width=500&height=500`;
        
        imageGallery.innerHTML += `
            <div class="img-card">
                <img src="${imgUrl}" alt="AI Image" onerror="this.style.display='none'">
            </div>
        `;
    }
    
    generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);
