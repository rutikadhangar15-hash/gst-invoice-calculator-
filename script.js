const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");
const imageCountSelect = document.getElementById("image-count");
const statusMessage = document.getElementById("status-message");

function createLoadingCard(index) {
  const card = document.createElement("div");

  card.className = "img-card";
  card.id = `image-card-${index}`;

  card.innerHTML = `
    <div class="loading-text">
      <div class="placeholder-icon">⏳</div>
      <p>Generating Image ${index + 1}...</p>
    </div>
  `;

  imageGallery.appendChild(card);
}

function loadImage(index, imageUrl) {
  return new Promise((resolve) => {
    const card = document.getElementById(`image-card-${index}`);
    const img = new Image();

    img.onload = () => {
      card.innerHTML = "";
      card.appendChild(img);
      resolve(true);
    };

    img.onerror = () => {
      card.innerHTML = `
        <div class="error-text">
          <div class="placeholder-icon">⚠️</div>
          <p>Image ${index + 1} failed to load.</p>
          <p>Please click Generate again.</p>
        </div>
      `;
      resolve(false);
    };

    img.src = imageUrl;
    img.alt = `AI Generated Image ${index + 1}`;
  });
}

async function generateImages() {
  const promptText = userPrompt.value.trim();
  const imageCount = Number(imageCountSelect.value);

  if (!promptText) {
    alert("Please enter a description!");
    userPrompt.focus();
    return;
  }

  generateBtn.disabled = true;
  generateBtn.innerText = "Generating...";
  statusMessage.innerText = `Generating ${imageCount} image(s)...`;

  imageGallery.innerHTML = "";

  const imagePromises = [];

  for (let i = 0; i < imageCount; i++) {
    createLoadingCard(i);

    const seed = Date.now() + i + Math.floor(Math.random() * 1000000);

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}` +
      `?width=500&height=500&seed=${seed}&nologo=true`;

    imagePromises.push(loadImage(i, imageUrl));
  }

  const results = await Promise.all(imagePromises);

  const successfulImages = results.filter((result) => result === true).length;

  statusMessage.innerText =
    `${successfulImages} of ${imageCount} image(s) generated successfully.`;

  generateBtn.disabled = false;
  generateBtn.innerText = "Generate";
}

generateBtn.addEventListener("click", generateImages);

userPrompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateImages();
  }
});
