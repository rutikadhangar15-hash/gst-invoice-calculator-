const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");
function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter a description!");
        return;
    }

    generateBtn.innerText = "Generating...";
    imageGallery.innerHTML = "";

    // 1. Create the card structure
    for (let i = 0; i < 4; i++) {
        const card = document.createElement("div");
        card.className = "img-card";
        card.innerHTML = "<p>Loading...</p>";
        imageGallery.appendChild(card);

        // 2. Build the URL with a unique seed to prevent caching issues
        const seed = Math.floor(Math.random() * 1000000);
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=500&height=500&seed=${seed}&nologo=true`;

        // 3. Create a clean Image object
        const img = new Image();
        img.src = imgUrl;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";

        // 4. Update the card when the image finishes loading
        img.onload = () => {
            card.innerHTML = "";
            card.appendChild(img);
        };

        img.onerror = () => {
            card.innerHTML = "<p>Failed to load (Server Busy)</p>";
        };
    }

    generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);
