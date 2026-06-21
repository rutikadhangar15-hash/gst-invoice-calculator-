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
// 1. Get all the card slots that are already in your HTML
    const cards = document.querySelectorAll(".img-card");
    const promptText = userPrompt.value.trim();
    
    // 2. Loop through each of the 4 slots and insert the images
    for (let i = 0; i < 4; i++) {
        const cleanPrompt = encodeURIComponent(promptText);
        const randomSeed = Math.floor(Math.random() * 999999) + i;
        const imgUrl = `https://image.pollinations.ai/p/${cleanPrompt}?width=500&height=500&seed=${randomSeed}&nofeed=true`;
        
        // 3. Update the existing card slot directly
        cards[i].innerHTML = `<img src="${imgUrl}" alt="AI Image ${i + 1}">`;
    }
   
    
            
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
