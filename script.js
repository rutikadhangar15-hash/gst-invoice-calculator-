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

    // Show loading text
    imageGallery.innerHTML = `
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
    `;

    try {
        imageGallery.innerHTML = "";
        
        // This loops 4 times to create 4 different AI images
        for (let i = 1; i <= 4; i++) {
            const cleanPrompt = encodeURIComponent(promptText);
            const randomSeed = Math.floor(Math.random() * 999999);
            
            // This smart link actually reads your prompt text and generates real AI art!
            const imgUrl = `https://image.pollinations.ai/p/${cleanPrompt}?width=500&height=500&seed=${randomSeed}&nofeed=true`;
            
            imageGallery.innerHTML += `
                <div class="img-card">
                    <img src="${imgUrl}" alt="AI Image ${i}">
                </div>
            `;
        }
    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
    }
}

generateBtn.addEventListener("click", generateImages);
