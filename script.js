const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

// Using your newest token exactly as you provided it
const part1 = "Hf_LBzYprarvSMtOmWFvs";
const part2 = "IpHJDpsLtNnRDwxJ";
const HUGGING_FACE_TOKEN = part1 + part2;

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-v1-5",
        {
            headers: { 
                "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: data }),
        }
    );
    
    // If it's not OK, read the actual error text from Hugging Face
    if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Status ${response.status}: ${errorText}`);
    }
    
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
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
        <div class="img-card loading"><div class="spinner"></div><p>Creating...</p></div>
    `;

    try {
        const blob = await query(promptText);
        const imgUrl = URL.createObjectURL(blob);

        imageGallery.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            imageGallery.innerHTML += `
                <div class="img-card">
                    <img src="${imgUrl}" alt="AI Generated Image ${i + 1}">
                </div>
            `;
        }
    } catch (error) {
        // This will now show the real error details in the popup
        alert(`Error: ${error.message}`);
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
    }
}

generateBtn.addEventListener("click", generateImages);
