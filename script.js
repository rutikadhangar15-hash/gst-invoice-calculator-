const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

// ⚠️ REPLACE THIS WITH YOUR ACTUAL HUGGING FACE TOKEN (e.g., "hf_xxxx...")
const HUGGING_FACE_TOKEN = "hf_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6"; // Your real token goes here! 

async function generateImages() {
    const promptText = userPrompt.value.trim();
    if (!promptText) {
        alert("Please enter a description first!");
        return;
    }

    // Change button state to loading
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    // Clear the older icons and show loading placeholders
    imageGallery.innerHTML = `
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
    `;

    try {
        // We make a request to the Hugging Face Inference API (Stable Diffusion)
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`
                },
                body: JSON.stringify({ inputs: promptText }),
            }
        );

        if (!response.ok) throw new Error("Failed to generate images. Check your API token!");

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);

        // Update the display grid with the generated image copies
        imageGallery.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            imageGallery.innerHTML += `
                <div class="img-card">
                    <img src="${imgUrl}" alt="AI Generated Image ${i + 1}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                </div>
            `;
        }

    } catch (error) {
        alert("Error: " + error.message);
        // Put back standard icons if it fails
        imageGallery.innerHTML = `
            <div class="img-card"><div class="placeholder-icon">🖼️</div><p>Image 1</p></div>
            <div class="img-card"><div class="placeholder-icon">🖼️</div><p>Image 2</p></div>
            <div class="img-card"><div class="placeholder-icon">🖼️</div><p>Image 3</p></div>
            <div class="img-card"><div class="placeholder-icon">🖼️</div><p>Image 4</p></div>
        `;
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
    }
}

// Add the click listener to your button
generateBtn.addEventListener("click", generateImages);
