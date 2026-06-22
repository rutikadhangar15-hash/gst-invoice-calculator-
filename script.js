const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");
const imageCountSelect = document.getElementById("image-count");
const statusMessage = document.getElementById("status-message");

function createLoadingCard(index) {
  const card = document.createElement("div");
  card.className = "img-card";
  card.id = `card-${index}`;

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
    const card = document.getElementById(`card-${index}`);
    const img = new Image();

    let finished = false;

    function finish(success, message) {
      if (finished) return;

      finished = true;
      clearTimeout(timeoutId);

      if (success) {
        card.innerHTML = "";
        card.appendChild(img);
      } else {
        card.innerHTML = `
          <div class="error-text">
            <div class="placeholder-icon">⚠️</div>
            <p>Image ${index + 1} failed.</p>
            <p>${message}</p>
          </div>
        `;
      }

      resolve(success);
    }

    const timeoutId = setTimeout(() => {
      img.src = "";
      finish(false, "Server timeout. Please try again.");
    }, 15000);

    img.onload = () => {
      finish(true, "");
    };

    img.onerror = () => {
      finish(false, "Image server did not respond.");
    };

    img.src = imageUrl;
    img.alt = `AI Image ${index + 1}`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
  });
}

async function generateImages() {
  const prompt = userPrompt.value.trim();
  const count = Number(imageCountSelect.value);

  if (!prompt) {
    alert("Please enter a description.");
    userPrompt.focus();
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  statusMessage.textContent = "Please wait up to 15 seconds...";

  imageGallery.innerHTML = "";

  for (let i = 0; i < count; i++) {
    createLoadingCard(i);
  }

  const imageTasks = [];

  for (let i = 0; i < count; i++) {
    const seed = Date.now() + i * 10000;

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=512&height=512&seed=${seed}&nologo=true`;

    imageTasks.push(loadImage(i, imageUrl));
  }

  const results = await Promise.all(imageTasks);
  const successCount = results.filter(Boolean).length;

  statusMessage.textContent =
    `${successCount} of ${count} image(s) generated.`;

  generateBtn.disabled = false;
  generateBtn.textContent = "Generate";
}

generateBtn.addEventListener("click", generateImages);

userPrompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateImages();
  }
});
