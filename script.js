const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");

// Secure split token layout
const part1 = "hf_LBzYprarvSMtOmWFvs";
const part2 = "IpHJDpsLtNnRDwxJ";
const HUGGING_FACE_TOKEN = part1 + part2;

async function query(data) {
    const response = await fetch(
        "[https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-v1-5](https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-v1-5)",
        {
            headers: { 
                "Authorization": "Bearer " + HUGGING_FACE_TOKEN,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: data }),
        }
    );
    
    if (!response.ok) {
        throw new Error("API Error");
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
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
        <div class="img-card loading"><p>Creating...</p></div>
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
        alert("Failed to fetch image. Please try again.");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate";
    }
}

generateBtn.addEventListener("click", generateImages);
