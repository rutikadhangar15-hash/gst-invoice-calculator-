const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

// Put your real hf_... token key inside these quotes!
const HUGGING_FACE_TOKEN = "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";

async function query(data) {
    // Using a highly stable model endpoint
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}` },
            method: "POST",
            body: JSON.stringify({ inputs: data }),
        }
    );
    if (!response.ok) throw new Error("API Error. Please check your token!");
    const result = await response.blob();
    return result;
}

async function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter a description first!");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    // Show loading state placeholder cards
    imageGallery.innerHTML = `
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
    `;

    try {
        // Send plain text string directly to query function
        const blob = await query(promptText);
        const imgUrl = URL.createObjectURL(blob);

        // Render the 4 generated cards with the actual image source
        imageGallery.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            imageGallery.innerHTML += `
                <div class="img-card">
                    <img src="${imgUrl}" alt="AI Generated Image ${i + 1}">
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
