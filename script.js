// Éléments DOM
const imageUpload = document.getElementById("image-upload");
const galleryGrid = document.getElementById("gallery-grid");
const memeCanvas = document.getElementById("meme-canvas");
const canvasPlaceholder = document.getElementById("canvas-placeholder");
const textInput = document.getElementById("text-input");
const textSize = document.getElementById("text-size");
const sizeValue = document.getElementById("size-value");
const textColor = document.getElementById("text-color");
const colorValue = document.getElementById("color-value");
const textRotation = document.getElementById("text-rotation");
const rotationValue = document.getElementById("rotation-value");
const downloadBtn = document.getElementById("download-btn");
const posButtons = document.querySelectorAll(".group-button");
const textsList = document.getElementById("texts-list");
const addTextBtn = document.getElementById("add-text-btn");
const deleteTextBtn = document.getElementById("delete-text-btn");

// État de l'application
let currentImage = null;
let texts = []; // Tableau de textes
let selectedTextIndex = -1; // Index du texte sélectionné (-1 = aucun)
let isDragging = false; // Indique si on est en train de déplacer un texte
let dragOffset = { x: 0, y: 0 }; // Offset du clic lors du glisser-déposer

// Templates de galerie (images de base)
const galleryTemplates = [
  // Ces templates peuvent être remplacés par de vraies images
  // Pour l'instant, on utilise des placeholders
];

// Initialisation
init();

function init() {
  setupEventListeners();
  loadGalleryTemplates();
  updateTextsList();
  updateControls();
}

function setupEventListeners() {
  // Upload d'image
  imageUpload.addEventListener("change", handleImageUpload);

  // Contrôles de texte
  textInput.addEventListener("input", handleTextChange);
  textSize.addEventListener("input", handleSizeChange);
  textColor.addEventListener("input", handleColorChange);
  textRotation.addEventListener("input", handleRotationChange);

  // Position
  posButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (selectedTextIndex === -1) return;
      posButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      texts[selectedTextIndex].position = btn.dataset.position;
      // Réinitialiser les coordonnées personnalisées lors du changement de position
      updateTextPositionFromPreset(selectedTextIndex);
      updateTextsList();
      renderMeme();
    });
  });

  // Ajouter un texte
  addTextBtn.addEventListener("click", addText);

  // Supprimer un texte
  deleteTextBtn.addEventListener("click", deleteSelectedText);

  // Téléchargement
  downloadBtn.addEventListener("click", downloadMeme);

  // Gestionnaires pour le déplacement du texte sur le canvas
  memeCanvas.addEventListener("mousedown", handleCanvasMouseDown);
  memeCanvas.addEventListener("mousemove", (e) => {
    handleCanvasMouseMove(e);
    // Changer le curseur au survol d'un texte
    if (!currentImage || isDragging) {
      memeCanvas.style.cursor = "default";
      return;
    }
    const coords = getCanvasCoordinates(e);
    const textIndex = findTextAtPoint(coords.x, coords.y);
    memeCanvas.style.cursor = textIndex !== -1 ? "move" : "default";
  });
  memeCanvas.addEventListener("mouseup", handleCanvasMouseUp);
  memeCanvas.addEventListener("mouseleave", handleCanvasMouseUp);
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      loadImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }
}

function loadImage(src) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    currentImage = img;
    setupCanvas();
    // Réinitialiser la sélection de texte lors du chargement d'une nouvelle image
    if (texts.length > 0) {
      selectedTextIndex = 0;
    } else {
      selectedTextIndex = -1;
    }
    updateControls();
    renderMeme();
    downloadBtn.disabled = false;
  };
  img.onerror = () => {
    alert("Erreur lors du chargement de l'image");
  };
  img.src = src;
}

function setupCanvas() {
  if (!currentImage) return;

  // Obtenir les dimensions du conteneur
  const container = memeCanvas.parentElement;
  const maxWidth = container.clientWidth - 40;
  const maxHeight = container.clientHeight - 40;

  let width = currentImage.width;
  let height = currentImage.height;

  // Redimensionner si nécessaire pour l'aperçu
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = width * ratio;
    height = height * ratio;
  }

  memeCanvas.width = width;
  memeCanvas.height = height;
  memeCanvas.style.display = "block";
  canvasPlaceholder.classList.add("hidden");
}

function renderMeme() {
  if (!currentImage) return;

  const ctx = memeCanvas.getContext("2d");

  // Effacer le canvas
  ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);

  // Dessiner l'image
  ctx.drawImage(currentImage, 0, 0, memeCanvas.width, memeCanvas.height);

  // Dessiner tous les textes
  texts.forEach((textObj) => {
    if (textObj.text.trim()) {
      drawText(ctx, textObj);
    }
  });
}

function drawText(ctx, textObj) {
  const text = textObj.text;
  const fontSize = textObj.size;
  const lines = text.split("\n");

  // Configuration du texte
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Calculer la position selon les coordonnées personnalisées ou la position prédéfinie
  let x, y;
  const padding = 30;

  if (textObj.x !== null && textObj.y !== null) {
    // Utiliser les coordonnées personnalisées
    x = textObj.x;
    y = textObj.y;
  } else {
    // Utiliser la position prédéfinie
    x = memeCanvas.width / 2;
    switch (textObj.position) {
      case "top":
        y = padding + fontSize / 2;
        break;
      case "bottom":
        y =
          memeCanvas.height -
          padding -
          (lines.length - 1) * fontSize * 1.5 -
          fontSize / 2;
        break;
      case "center":
      default:
        y = memeCanvas.height / 2;
        break;
    }
  }

  const lineHeight = fontSize * 1.5;

  // Sauvegarder l'état du contexte
  ctx.save();

  // Appliquer la rotation si nécessaire
  if (textObj.rotation !== 0) {
    ctx.translate(x, y);
    ctx.rotate((textObj.rotation * Math.PI) / 180);
    ctx.translate(-x, -y);
  }

  // Dessiner chaque ligne de texte
  lines.forEach((line, index) => {
    if (line.trim()) {
      const lineY = y + (index - (lines.length - 1) / 2) * lineHeight;

      // Dessiner le contour noir (stroke) - épaissi
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(6, fontSize / 5);
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(line, x, lineY);

      // Dessiner le texte avec la couleur sélectionnée (fill)
      ctx.fillStyle = textObj.color;
      ctx.fillText(line, x, lineY);
    }
  });

  // Restaurer l'état du contexte
  ctx.restore();
}

function handleTextChange(e) {
  if (selectedTextIndex === -1) return;
  texts[selectedTextIndex].text = e.target.value;
  updateTextsList();
  renderMeme();
}

function handleSizeChange(e) {
  if (selectedTextIndex === -1) return;
  const size = parseInt(e.target.value);
  texts[selectedTextIndex].size = size;
  sizeValue.textContent = size;
  renderMeme();
}

function handleColorChange(e) {
  if (selectedTextIndex === -1) return;
  const color = e.target.value.toUpperCase();
  texts[selectedTextIndex].color = color;
  colorValue.textContent = color;
  renderMeme();
}

function handleRotationChange(e) {
  if (selectedTextIndex === -1) return;
  const rotation = parseInt(e.target.value);
  texts[selectedTextIndex].rotation = rotation;
  rotationValue.textContent = rotation;
  renderMeme();
}

function addText() {
  const newText = {
    text: "",
    size: 40,
    color: "#FFFFFF",
    position: "center",
    x: null, // null signifie utiliser la position prédéfinie
    y: null,
    rotation: 0, // Angle de rotation en degrés
  };
  texts.push(newText);
  selectedTextIndex = texts.length - 1;
  updateTextsList();
  updateControls();
  renderMeme();
}

function deleteSelectedText() {
  if (selectedTextIndex === -1 || texts.length === 0) return;
  texts.splice(selectedTextIndex, 1);
  if (texts.length === 0) {
    selectedTextIndex = -1;
  } else if (selectedTextIndex >= texts.length) {
    selectedTextIndex = texts.length - 1;
  }
  updateTextsList();
  updateControls();
  renderMeme();
}

function selectText(index) {
  if (index < 0 || index >= texts.length) return;
  selectedTextIndex = index;
  updateTextsList();
  updateControls();
  renderMeme();
}

function updateTextsList() {
  textsList.innerHTML = "";
  if (texts.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "text-item";
    emptyMsg.style.justifyContent = "center";
    emptyMsg.style.opacity = "0.5";
    emptyMsg.textContent = "Aucun texte";
    textsList.appendChild(emptyMsg);
    return;
  }

  texts.forEach((textObj, index) => {
    const item = document.createElement("div");
    item.className = `text-item ${index === selectedTextIndex ? "active" : ""}`;
    item.addEventListener("click", () => selectText(index));

    const number = document.createElement("span");
    number.className = "text-item-number";
    number.textContent = `${index + 1}`;

    const content = document.createElement("span");
    content.className = "text-item-content";
    content.textContent = textObj.text.trim() || `Texte ${index + 1}`;

    item.appendChild(number);
    item.appendChild(content);
    textsList.appendChild(item);
  });
}

function updateControls() {
  if (selectedTextIndex === -1 || texts.length === 0) {
    // Désactiver les contrôles
    textInput.disabled = true;
    textInput.value = "";
    textSize.disabled = true;
    textColor.disabled = true;
    textRotation.disabled = true;
    deleteTextBtn.disabled = true;
    posButtons.forEach((btn) => {
      btn.disabled = true;
      btn.classList.remove("active");
    });
    return;
  }

  // Activer les contrôles
  const textObj = texts[selectedTextIndex];
  textInput.disabled = false;
  textInput.value = textObj.text;
  textSize.disabled = false;
  textSize.value = textObj.size;
  sizeValue.textContent = textObj.size;
  textColor.disabled = false;
  textColor.value = textObj.color;
  colorValue.textContent = textObj.color;
  textRotation.disabled = false;
  textRotation.value = textObj.rotation || 0;
  rotationValue.textContent = textObj.rotation || 0;
  deleteTextBtn.disabled = false;

  // Mettre à jour les boutons de position
  posButtons.forEach((btn) => {
    btn.disabled = false;
    if (btn.dataset.position === textObj.position) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function downloadMeme() {
  if (!currentImage) return;

  // Créer un canvas temporaire avec la taille originale de l'image
  const downloadCanvas = document.createElement("canvas");
  downloadCanvas.width = currentImage.width;
  downloadCanvas.height = currentImage.height;
  const ctx = downloadCanvas.getContext("2d");

  // Dessiner l'image à sa taille originale
  ctx.drawImage(currentImage, 0, 0);

  // Calculer le facteur d'échelle
  const scaleFactor = currentImage.width / memeCanvas.width;

  // Dessiner tous les textes avec la même taille relative
  texts.forEach((textObj) => {
    if (textObj.text.trim()) {
      const originalFontSize = textObj.size * scaleFactor;
      const text = textObj.text;
      const fontSize = originalFontSize;
      const lines = text.split("\n");

      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculer la position selon les coordonnées personnalisées ou la position prédéfinie
      let x, y;
      const padding = 30 * scaleFactor;

      if (textObj.x !== null && textObj.y !== null) {
        // Utiliser les coordonnées personnalisées avec le facteur d'échelle
        x = textObj.x * scaleFactor;
        y = textObj.y * scaleFactor;
      } else {
        // Utiliser la position prédéfinie
        x = downloadCanvas.width / 2;
        switch (textObj.position) {
          case "top":
            y = padding + fontSize / 2;
            break;
          case "bottom":
            y =
              downloadCanvas.height -
              padding -
              (lines.length - 1) * fontSize * 1.5 -
              fontSize / 2;
            break;
          case "center":
          default:
            y = downloadCanvas.height / 2;
            break;
        }
      }

      const lineHeight = fontSize * 1.5;

      // Sauvegarder l'état du contexte
      ctx.save();

      // Appliquer la rotation si nécessaire
      if (textObj.rotation !== 0) {
        ctx.translate(x, y);
        ctx.rotate((textObj.rotation * Math.PI) / 180);
        ctx.translate(-x, -y);
      }

      lines.forEach((line, index) => {
        if (line.trim()) {
          const lineY = y + (index - (lines.length - 1) / 2) * lineHeight;

          // Contour noir - épaissi
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = Math.max(6 * scaleFactor, fontSize / 5);
          ctx.lineJoin = "round";
          ctx.miterLimit = 2;
          ctx.strokeText(line, x, lineY);

          // Texte avec la couleur sélectionnée
          ctx.fillStyle = textObj.color;
          ctx.fillText(line, x, lineY);
        }
      });

      // Restaurer l'état du contexte
      ctx.restore();
    }
  });

  // Télécharger l'image
  downloadCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

// Fonction pour obtenir les coordonnées de la souris sur le canvas
function getCanvasCoordinates(e) {
  const rect = memeCanvas.getBoundingClientRect();
  const scaleX = memeCanvas.width / rect.width;
  const scaleY = memeCanvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

// Fonction pour vérifier si un point est dans les limites d'un texte
function isPointInText(x, y, textObj) {
  if (!textObj.text.trim()) return false;

  const fontSize = textObj.size;
  const lines = textObj.text.split("\n");
  const lineHeight = fontSize * 1.5;
  const totalHeight = lines.length * lineHeight;

  // Calculer la position du texte
  let textX, textY;
  const padding = 30;

  if (textObj.x !== null && textObj.y !== null) {
    textX = textObj.x;
    textY = textObj.y;
  } else {
    textX = memeCanvas.width / 2;
    switch (textObj.position) {
      case "top":
        textY = padding + fontSize / 2;
        break;
      case "bottom":
        textY =
          memeCanvas.height -
          padding -
          (lines.length - 1) * fontSize * 1.5 -
          fontSize / 2;
        break;
      case "center":
      default:
        textY = memeCanvas.height / 2;
        break;
    }
  }

  // Mesurer la largeur approximative du texte
  const ctx = memeCanvas.getContext("2d");
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  const maxWidth = Math.max(
    ...lines.map((line) => ctx.measureText(line).width)
  );

  // Vérifier si le point est dans le rectangle du texte
  const halfWidth = maxWidth / 2;
  const halfHeight = totalHeight / 2;

  // Appliquer la rotation inverse pour vérifier la collision
  if (textObj.rotation !== 0) {
    const angle = (-textObj.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - textX;
    const dy = y - textY;
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;
    return (
      rotatedX >= -halfWidth &&
      rotatedX <= halfWidth &&
      rotatedY >= -halfHeight &&
      rotatedY <= halfHeight
    );
  }

  return (
    x >= textX - halfWidth &&
    x <= textX + halfWidth &&
    y >= textY - halfHeight &&
    y <= textY + halfHeight
  );
}

// Fonction pour trouver le texte sous le curseur
function findTextAtPoint(x, y) {
  // Parcourir les textes de la fin au début pour trouver celui du dessus
  for (let i = texts.length - 1; i >= 0; i--) {
    if (isPointInText(x, y, texts[i])) {
      return i;
    }
  }
  return -1;
}

// Gestionnaire de clic sur le canvas
function handleCanvasMouseDown(e) {
  if (!currentImage) return;

  const coords = getCanvasCoordinates(e);
  const textIndex = findTextAtPoint(coords.x, coords.y);

  if (textIndex !== -1) {
    selectedTextIndex = textIndex;
    isDragging = true;
    const textObj = texts[textIndex];

    // Calculer la position actuelle du texte
    let textX, textY;
    const fontSize = textObj.size;
    const padding = 30;

    if (textObj.x !== null && textObj.y !== null) {
      textX = textObj.x;
      textY = textObj.y;
    } else {
      textX = memeCanvas.width / 2;
      const lines = textObj.text.split("\n");
      switch (textObj.position) {
        case "top":
          textY = padding + fontSize / 2;
          break;
        case "bottom":
          textY =
            memeCanvas.height -
            padding -
            (lines.length - 1) * fontSize * 1.5 -
            fontSize / 2;
          break;
        case "center":
        default:
          textY = memeCanvas.height / 2;
          break;
      }
    }

    // Calculer l'offset pour un déplacement fluide
    dragOffset.x = coords.x - textX;
    dragOffset.y = coords.y - textY;

    updateTextsList();
    updateControls();
    renderMeme();
  }
}

// Gestionnaire de mouvement de la souris sur le canvas
function handleCanvasMouseMove(e) {
  if (!currentImage || !isDragging || selectedTextIndex === -1) return;

  const coords = getCanvasCoordinates(e);
  const textObj = texts[selectedTextIndex];

  // Mettre à jour les coordonnées personnalisées
  textObj.x = coords.x - dragOffset.x;
  textObj.y = coords.y - dragOffset.y;

  // Marquer que le texte utilise maintenant des coordonnées personnalisées
  // (on garde la position pour référence mais on utilise x/y)

  renderMeme();
}

// Gestionnaire de relâchement de la souris
function handleCanvasMouseUp(e) {
  if (isDragging) {
    isDragging = false;
  }
}

// Fonction pour mettre à jour la position depuis un preset
function updateTextPositionFromPreset(index) {
  if (index < 0 || index >= texts.length) return;
  const textObj = texts[index];
  const fontSize = textObj.size;
  const padding = 30;
  const lines = textObj.text.split("\n");

  // Réinitialiser les coordonnées personnalisées pour utiliser le preset
  textObj.x = null;
  textObj.y = null;
}

function loadGalleryTemplates() {
  // Liste des templates disponibles dans le dossier templates/
  // Pour ajouter de nouveaux templates :
  // 1. Ajoutez l'image dans le dossier templates/
  // 2. Ajoutez le chemin dans le tableau ci-dessous
  const templateImages = [
    "templates/all_well.jpg",
    "templates/clever.jpg",
    "templates/made_it.jpg",
  ];

  // Vider la galerie avant de charger les templates
  galleryGrid.innerHTML = "";

  templateImages.forEach((src, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.dataset.index = index;

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Template ${index + 1}`;
    img.loading = "lazy";
    img.onerror = () => {
      // Si l'image n'existe pas, on ne l'affiche pas
      item.remove();
    };

    item.appendChild(img);
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".gallery-item")
        .forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
      loadImage(src);
    });

    galleryGrid.appendChild(item);
  });

  // Si aucun template n'est disponible, afficher un message
  if (templateImages.length === 0) {
    const message = document.createElement("p");
    message.textContent =
      "Aucun template disponible. Utilisez le bouton Upload pour ajouter votre propre image.";
    message.style.textAlign = "center";
    message.style.color = "#666666";
    message.style.padding = "20px";
    message.style.fontSize = "0.875rem";
    galleryGrid.appendChild(message);
  }
}
