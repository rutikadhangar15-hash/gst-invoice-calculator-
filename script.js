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

function showError(index, message) {
  const card = document.getElementById(`card-${index}`);

  if (!card) return;

  card.innerHTML = `
    <div class="error-text">
      <div class="placeholder-icon">⚠️</div>
      <p>Image ${index + 1} not generated</p>
      <small>${message}</small>
    </div>
  `;
}

function loadImageWithTimeout(index, imageUrl) {
  return new Promise((resolve) => {
    const card = document.getElementById(`card-${index}`);
    const img = new Image();

    let done = false;

    const finish = (success, message = "") => {
      if (done) return;

      done = true;
      clearTimeout(timeout);

      if (success) {
        card.innerHTML = "";
        card.appendChild(img);
      } else {
        showError(index, message);
      }

      resolve(success);
    };

    const timeout = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      img.src = "";
      finish(false, "Server timeout. Please try again.");
    }, 10000);

    img.onload = () => {
      finish(true);
    };

    img.onerror = () => {
      finish(false, "Image API failed.");
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
    alert("Please enter a prompt.");
    userPrompt.focus();
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  statusMessage.textContent = "Generating images. Maximum wait: 10 seconds.";

  imageGallery.innerHTML = "";

  for (let i = 0; i < count; i++) {
    createCard(i);
  }

  try {
    const tasks = [];

    for (let i = 0; i < count; i++) {
      const seed = Date.now() + i + Math.floor(Math.random() * 100000);

      const imageUrl =
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
        `?width=512&height=512&seed=${seed}&nologo=true`;

      tasks.push(loadImageWithTimeout(i, imageUrl));
    }

    const results = await Promise.all(tasks);
    const successCount = results.filter(Boolean).length;

    statusMessage.textContent =
      `${successCount} of ${count} image(s) generated.`;
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
