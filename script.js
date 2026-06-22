const userPrompt = document.getElementById("user-prompt");
const generateBtn = document.getElementById("generate-btn");
const imageGallery = document.getElementById("image-gallery");
const imageCountSelect = document.getElementById("image-count");
const statusMessage = document.getElementById("status-message");

function createCard(index) {
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

function generateOneImage(index, prompt) {
  return new Promise((resolve) => {
    const card = document.getElementById(`card-${index}`);
    const img = new Image();

    let finished = false;

    function finish(success) {
      if (finished) return;
      finished = true;
      resolve(success);
    }

    const timeoutId = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      img.src = "";

      card.innerHTML = `
        <div class="error-text">
          <div class="placeholder-icon">⚠️</div>
          <p>Image ${index + 1} timed out.</p>
          <p>Try generating 1 image first.</p>
        </div>
      `;

      finish(false);
    }, 15000);

    img.onload = () => {
      clearTimeout(timeoutId);

      card.innerHTML = "";
      card.appendChild(img);

      finish(true);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);

      card.innerHTML = `
        <div class="error-text">
          <div class="placeholder-icon">⚠️</div>
          <p>Image ${index + 1} failed.</p>
          <p>Image server is unavailable.</p>
        </div>
      `;

      finish(false);
    };

    const seed = Date.now() + index * 1000;

    img.src =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=512&height=512&seed=${seed}&nologo=true`;
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
  statusMessage.textContent = `Generating ${count} image(s)...`;
  imageGallery.innerHTML = "";

  for (let i = 0; i < count; i++) {
    createCard(i);
  }

  try {
    const tasks = [];

    for (let i = 0; i < count; i++) {
      tasks.push(generateOneImage(i, prompt));
    }

    const results = await Promise.all(tasks);
    const successCount = results.filter(Boolean).length;

    statusMessage.textContent =
      `${successCount} of ${count} image(s) loaded.`;
  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Something went wrong. Please try again.";
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate";
  }
}

generateBtn.addEventListener("click", generateImages);

userPrompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateImages();
  }
});
