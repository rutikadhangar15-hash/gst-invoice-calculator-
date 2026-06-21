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

    // Show loading status
    imageGallery.innerHTML = `
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
    `;

    try {
        // Using a completely free, fast public image source that requires no tokens!
        imageGallery.innerHTML = "";
        for (let i = 1; i <= 4; i++) {
            const uniqueId = Math.floor(Math.random() * 10000);
            const imgUrl = `https://picsum.photos/500/500?random=${uniqueId}`;
            
            imageGallery.innerHTML += `
                <div class="img-card">
                    <img src="${imgUrl}" alt="Generated Image ${i}">
                </div>
            `;
        }
    } catch (error) {
        alert("Failed to fetch image. Please try again.");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
    }
}

generateBtn.addEventListener("click", generateImages);
