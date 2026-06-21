const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

// Put your real hf_... token key inside these quotes!
const HUGGING_FACE_TOKEN = "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";

async function query(data) {
    // This handles the connection cleanly without long complex links
    const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
            headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
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

    imageGallery.innerHTML = `
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner">⏳</div><p>Creating...</p></div>
    `;

    try {
        const blob = await query({ "inputs": promptText });
        const imgUrl = URL.createObjectURL(blob);

        imageGallery.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            imageGallery.innerHTML += `
                <div class="img-card">
                    <img src="${imgUrl}" alt="AI Image" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                </div>
            `;
        }
    } catch (error) {
        alert(error.message);
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

generateBtn.addEventListener("click", generateImages);
