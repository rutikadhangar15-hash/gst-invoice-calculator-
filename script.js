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
    
    // 1. Clear the gallery
    imageGallery.innerHTML = "";

    // 2. Create the 4 containers first
    for (let i = 0; i < 4; i++) {
        imageGallery.innerHTML += `<div class="img-card" id="card-${i}">Loading...</div>`;
    }

    // 3. Populate them with images
    for (let i = 0; i < 4; i++) {
        const seed = Math.floor(Math.random() * 100000);
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?seed=${seed}&width=500&height=500`;
        
        const card = document.getElementById(`card-${i}`);
        const img = document.createElement('img');
        img.src = imgUrl;
        
        img.onload = () => {
            card.innerHTML = ""; // Clear "Loading..."
            card.appendChild(img);
        };
        
        img.onerror = () => {
            card.innerHTML = "Failed to load";
        };
    }
    
    generateBtn.innerText = "Generate";
}
generateBtn.addEventListener("click", generateImages);
