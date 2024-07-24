//Mettre le code JavaScript lié à la page photographer.html

// Variables globales
let photographers = [];
let sortedMediaList = [];
let totalLikesCounter = 0;

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const logo = document.querySelector("header .logo");
    wrapImageInLink(logo, "/");
    logo.setAttribute("alt", "Fisheye logo");
    // Appeler la fonction loadData pour charger les données
    await loadData();
    // Appeler la fonction onePhotographer pour afficher les données du photographe
    displayPhotographer();
    // Appeler la fonction displayMedias pour afficher les médias du photographe
    displayMedias();
    // Initialiser le select pour le tri
    initializeSortSelect();
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
  }
});

function wrapImageInLink(imageElement, linkURL) {
  const link = document.createElement("a");
  link.href = linkURL; // Définit l'URL de destination, ici la racine pour la page d'accueil
  imageElement.parentNode.insertBefore(link, imageElement);
  link.appendChild(imageElement);
  link.setAttribute("alt", "Retour à l'accueil"); // Ajoute un label pour l'accessibilité
  link.title = "Retour à l'accueil"; // Ajoute un titre pour l'accessibilité
  link.setAttribute("alt", "Fisheye Home page"); // Ajoute un titre pour l'accessibilité
}

// 1- Créer une fonction loadData pour charger les données
async function loadData() {
  try {
    const response = await fetch("data/photographers.json");
    if (!response.ok) {
      throw new Error("HTTP error ! Status: " + response.status);
    }
    const data = await response.json();
    if (!data.photographers) {
      throw new Error("Le champ photographers est vide");
    }
    photographers = data.photographers;
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
  }
}

// 1- Créer une fonction onePhotographer pour récupérer les données du photographe
function displayPhotographer() {
  // Récupérer l'id du photographe dans l'url
  const urlParams = new URLSearchParams(window.location.search);
  // Récupérer l'id du photographe
  const photographerId = parseInt(urlParams.get("id"));
  // Récupérer le photographe correspondant à l'id
  const photographer = photographers.find(
    // Vérifier si l'id du photographe correspond à l'id dans l'url
    (params) => params.id === parseInt(photographerId)
  );
  // Afficher le photographe
  if (!photographer) {
    console.error("Photographe non trouvé");
    document.title = "Fisheye - Photographe non trouvé";
    return;
  }

  // Récupérer les données du photographe
  const { name, portrait } = photographer;
  // Afficher le nom du photographe dans le titre de la page
  document.title = `Fisheye - ${name}`;
  const photographerHeader = document.querySelector(".photograph-header");
  photographerHeader.prepend(createPhotographerProfile(photographer));

  const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`;

  // Créer une image
  const img = document.createElement("img");
  img.setAttribute("src", picture);
  img.setAttribute("alt", `Portrait de ${name}`);
  photographerHeader.appendChild(img);
}

// Créer une fonction pour afficher le profil du photographe
function createPhotographerProfile(photographer) {
  // Récupérer les données du photographe
  const { name, city, country, tagline } = photographer;
  // Récupérer le chemin de l'image du photographe

  const photographerProfile = document.createElement("div");
  photographerProfile.classList.add("photograph-profile");

  // Créer un titre
  const nameH2 = document.createElement("h2");
  nameH2.classList.add("photograph-name");
  nameH2.textContent = name;

  // Créer un paragraphe pour la localisation
  const locationP = document.createElement("p");
  locationP.classList.add("photograph-location");
  locationP.textContent = `${city}, ${country}`;

  // Créer un paragraphe pour la description
  const descriptionP = document.createElement("p");
  descriptionP.classList.add("photograph-description");
  descriptionP.textContent = tagline;

  photographerProfile.append(nameH2, locationP, descriptionP);
  return photographerProfile;
}

function initializeSortSelect() {
  const main = document.getElementById("main");

  // Créer une div qui contient le select et son label
  const selectDiv = document.createElement("div");
  selectDiv.classList.add("select-div");
  main.appendChild(selectDiv);

  // Créer un label pour le select
  const label = document.createElement("label");
  label.textContent = "Trier par";
  label.setAttribute("for", "sort-select");
  label.setAttribute("id", "sort-label");
  selectDiv.appendChild(label);

  const popularityOption = document.createElement("button");
  popularityOption.classList.add("selected-option");
  popularityOption.setAttribute("aria-labelledby", "sort-label");
  popularityOption.setAttribute("type", "button");
  popularityOption.setAttribute("role", "listbox");
  popularityOption.setAttribute("aria-expanded", "false");

  const popularityText = document.createElement("span");
  // ajouter id pour le test
  popularityText.id = "sort-span";
  popularityText.textContent = "Popularité";

  popularityOption.appendChild(popularityText);

  const chevronOption = document.createElement("i");
  chevronOption.classList.add("fas", "fa-chevron-down");
  popularityOption.appendChild(chevronOption);

  selectDiv.appendChild(popularityOption);

  const select = document.createElement("ul");
  select.classList.add("sort-select");
  selectDiv.appendChild(select);

  // Option pour trier par date
  const dateOption = document.createElement("li");
  dateOption.textContent = "Date";
  select.appendChild(dateOption);

  // Option pour trier par titre
  const titleOption = document.createElement("li");
  titleOption.textContent = "Titre";
  select.appendChild(titleOption);

  // Ajouter un écouteur d'événement pour le changement de tri
  addSortChangeListener(
    select,
    popularityOption,
    popularityText,
    chevronOption
  );
}

function addSortChangeListener(
  select,
  selectedOption,
  selectedText,
  chevronOption
) {
  selectedOption.addEventListener("click", () => {
    // Bascule la visibilité du menu
    select.style.display = select.style.display === "block" ? "none" : "block";

    // Bascule l'icône du chevron
    chevronOption.classList.toggle("fa-chevron-up");
    chevronOption.classList.toggle("fa-chevron-down");
    // Mettre à jour l'attribut aria-expanded
    selectedOption.setAttribute(
      "aria-expanded",
      select.style.display === "block"
    );
  });

  select.addEventListener("click", (event) => {
    const option = event.target;

    const textContentSort = option.textContent;

    if (textContentSort) {
      // Échanger les textes et valeurs entre l'option sélectionnée et l'option cliquée
      const tempText = selectedText.textContent;

      selectedText.textContent = option.textContent;

      option.textContent = tempText;

      // Cacher le menu
      select.style.display = "none";
      chevronOption.classList.remove("fa-chevron-up");
      chevronOption.classList.add("fa-chevron-down");

      // Effectuer le tri en fonction de la nouvelle valeur sélectionnée
      if (textContentSort === "Popularité") {
        sortMediasByPopularity();
      } else if (textContentSort === "Titre") {
        sortMediasByTitle();
      } else if (textContentSort === "Date") {
        sortMediasByDate();
      } else {
        console.error("Valeur de tri inconnue", textContentSort);
      }
    }
  });
}

// Créer une fonction pour trier les médias par popularité
function sortMediasByPopularity() {
  // Récupérer les médias
  const mediaList = document.querySelector(".media-section");
  // Récupérer les div des médias
  const mediaDivs = Array.from(mediaList.children);
  // Trier les médias par popularité
  mediaDivs.sort((a, b) => {
    const likesA = parseInt(a.querySelector(".media-likes").textContent);
    const likesB = parseInt(b.querySelector(".media-likes").textContent);
    return likesB - likesA;
  });
  // Ajouter les div triées à la section des médias
  mediaDivs.forEach((div) => mediaList.appendChild(div));

  updateMediaIndex();
  // afficher dans la console les index des médias triés par popularité
}

// Créer une fonction pour trier les médias par titre
function sortMediasByTitle() {
  // Récupérer les médias
  const mediaList = document.querySelector(".media-section");
  // Récupérer les div des médias
  const mediaDivs = Array.from(mediaList.children);
  // Trier les médias par titre
  mediaDivs.sort((a, b) => {
    const titleA = a.querySelector(".media-title").textContent;
    const titleB = b.querySelector(".media-title").textContent;
    return titleA.localeCompare(titleB);
  });
  // Ajouter les div triées à la section des médias
  mediaDivs.forEach((div) => mediaList.appendChild(div));

  updateMediaIndex();
}

// Créer une fonction pour trier les médias par date
function sortMediasByDate() {
  // Récupérer les médias
  const mediaList = document.querySelector(".media-section");
  // Récupérer les div des médias
  const mediaDivs = Array.from(mediaList.children);
  // Trier les médias par date
  mediaDivs.sort((a, b) => {
    const dateA = a.dataset.date;
    const dateB = b.dataset.date;
    return dateB.localeCompare(dateA);
  });
  // Ajouter les div triées à la section des médias
  mediaDivs.forEach((div) => mediaList.appendChild(div));

  updateMediaIndex();
}

// Créer une fonction qui met à jour l'index des médias
function updateMediaIndex() {
  const mediaList = document.querySelector(".media-section");
  const mediaDivs = Array.from(mediaList.children);
  // Mettre à jour l'index des médias
  sortedMediaList = mediaDivs;
}

class TotalLikesDisplay {
  constructor(initialLikes = 0, photographerPrice) {
    this.totalLikes = initialLikes; // Initialiser avec la somme des likes des médias du photographe
    this.photographerPrice = photographerPrice;
    this.displayElement = this.createDisplayElement();
  }

  createDisplayElement() {
    const main = document.getElementById("main");
    // Créer le div principal pour l'affichage total des likes
    const totalLikesDiv = document.createElement("div");
    totalLikesDiv.classList.add("total-likes-div");

    // Créer le paragraphe pour les likes avec un span pour le nombre et une icône
    const totalLikesText = document.createElement("p");
    totalLikesText.classList.add("total-likes");

    // Créer un span pour encapsuler le nombre de likes
    const likesSpan = document.createElement("span");
    likesSpan.textContent = this.totalLikes;
    totalLikesText.appendChild(likesSpan);

    // Créer l'élément i pour l'icône de coeur
    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fas", "fa-heart", "like-icon");
    totalLikesText.appendChild(heartIcon);

    // Créer le paragraphe pour le prix
    const priceText = document.createElement("p");
    priceText.classList.add("photographer-price");
    priceText.textContent = `${this.photographerPrice}€ / jour`;

    // Ajouter le texte des likes au div principal
    totalLikesDiv.appendChild(totalLikesText);

    // Ajouter le texte du prix au div principal
    totalLikesDiv.appendChild(priceText);

    // Ajouter le div principal au corps du document
    main.appendChild(totalLikesDiv);

    // Retourner le paragraphe des likes pour référence future
    return totalLikesText;
  }

  updateLikes(newLikes) {
    // Incrémenter le total des likes avec les nouveaux likes
    this.totalLikes += newLikes;

    // Sélectionner le span dans l'élément totalLikesText
    // Supposons que totalLikesText est le paragraphe contenant le span et l'icône
    const likesSpan = this.displayElement.querySelector("span");

    // Mettre à jour le texte du span pour refléter le nouveau total de likes
    likesSpan.textContent = this.totalLikes;
  }
}

// Création pattern media factory
class MediaFactory {
  // Créer un constructeur pour initialiser les propriétés
  constructor(media, name) {
    // Initialiser les propriétés
    // Initialiser le type de média
    this.media = media;
    // Initialiser le nom du photographe
    this.name = name;
    this.media.liked = false;
  }
  // Créer une méthode pour créer un élément média
  createMediaElement() {
    // Créer une div pour le média
    const mediaDiv = document.createElement("div");
    // Ajouter la classe image-div ou video-div
    mediaDiv.classList.add(this.mediaType);
    // Ajouter la date du média
    mediaDiv.dataset.date = this.media.date;

    // Créer un élément média (image ou vidéo)
    const mediaElement = document.createElement(
      this.media.image ? "img" : "video"
    );
    // Ajouter la classe media-image ou media-video
    mediaElement.classList.add(
      this.media.image ? "media-image" : "media-video"
    );
    // Ajouter l'attribut src avec le chemin du média
    mediaElement.src = `assets/photographers/${this.name}/${
      this.media.image || this.media.video
    }`;
    // Ajouter l'attribut alt avec le titre du média
    mediaElement.alt = this.media.title;
    // Ajouter les contrôles pour les vidéos
    // if (this.media.video) {
    //   mediaElement.controls = true;
    // }
    // Ajouter l'attribut tabindex pour la navigation au clavier
    mediaElement.tabIndex = 0;

    // Ajouter l'élément média à la div du média
    mediaDiv.appendChild(mediaElement);
    // Ajouter les informations du média à la div du média
    this.appendMediaInfo(mediaDiv);

    // retourner la div du média
    return mediaDiv;
  }

  // Créer une méthode pour ajouter les informations du média
  appendMediaInfo(mediaDiv) {
    // Créer une div pour les informations du média
    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("media-info");
    mediaDiv.appendChild(mediaInfo);

    // Créer un titre pour le média
    const title = document.createElement("h3");
    title.classList.add("media-title");
    title.textContent = this.media.title;
    mediaInfo.appendChild(title);

    // Créer une div pour les likes
    const likesDiv = document.createElement("div");
    likesDiv.classList.add("likes-div");
    mediaInfo.appendChild(likesDiv);

    // Créer un paragraphe pour les likes
    const likesParagraph = document.createElement("p");
    likesParagraph.classList.add("media-likes");
    likesParagraph.textContent = this.media.likes;
    likesDiv.appendChild(likesParagraph);

    // Créer une balise i pour le bouton like
    const likeBtn = document.createElement("i");
    likeBtn.alt = "Like";
    likeBtn.classList.add("like-btn");
    likeBtn.classList.add("fas");
    likeBtn.classList.add("fa-heart");
    likeBtn.style.cursor = "pointer";
    likeBtn.ariaLabel = "likes";
    likeBtn.tabIndex = 0;
    likesDiv.appendChild(likeBtn);

    // Ajouter un écouteur d'événement pour le clic sur le bouton like
    likeBtn.addEventListener("click", () => this.increaseLikes(likesParagraph));

    // Ajouter un écouteur d'événement pour le Enter sur le bouton like
    likeBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.increaseLikes(likesParagraph);
      }
    });
  }

  // Créer une méthode pour augmenter les likes
  increaseLikes(likesParagraph) {
    if (!this.media.liked) {
      this.media.likes++;
      totalLikesCounter.updateLikes(1);
      this.media.liked = true;
    } else {
      this.media.likes--;
      totalLikesCounter.updateLikes(-1);
      this.media.liked = false;
    }
    likesParagraph.textContent = this.media.likes;
  }
}

// Créer une classe pour les images
class ImageMediaFactory extends MediaFactory {
  // Créer un constructeur pour initialiser les propriétés
  constructor(media, name) {
    // Appeler le constructeur de la classe parente
    super(media, name);
    // Initialiser le type de média
    this.mediaType = "image-div";
    // Initialiser le type d'élément
    this.elementType = "img";
  }
}

// Créer une classe pour les vidéos
class VideoMediaFactory extends MediaFactory {
  // Créer un constructeur pour initialiser les propriétés
  constructor(media, name) {
    // Appeler le constructeur de la classe parente
    super(media, name);
    // Initialiser le type de média
    this.mediaType = "video-div";
    // Initialiser le type d'élément
    this.elementType = "video";
  }
}

// Créer une fonction pour récupérer les médias du photographe
async function displayMedias() {
  if (!photographers.length === 0) {
    console.error("Aucun photographe trouvé");
    return;
  }
  try {
    // Récupérer les données des médias
    const response = await fetch("data/photographers.json");
    const photographersData = await response.json();
    const mediaArray = photographersData.media;
    const photographerId = parseInt(
      new URLSearchParams(window.location.search).get("id")
    );
    const photographer = photographers.find((p) => p.id === photographerId);
    if (!photographer) {
      throw new Error("Photographe non trouvé avec l'id " + photographerId);
    }
    // Récupérer les médias du photographe
    const photographerMedias = mediaArray.filter(
      (media) => media.photographerId === photographerId
    );
    const initialLikes = photographerMedias.reduce(
      (total, media) => total + media.likes,
      0
    );

    const photographerName = photographer.name;

    const photographerPrice = photographer.price;
    // Créer une instance de la classe TotalLikesDisplay
    totalLikesCounter = new TotalLikesDisplay(initialLikes, photographerPrice);

    const main = document.getElementById("main");

    let mediaSection = document.querySelector(".media-section");
    if (!mediaSection) {
      mediaSection = document.createElement("section");
      mediaSection.classList.add("media-section");
      main.appendChild(mediaSection);
    }

    // Afficher les médias du photographe
    mediaArray
      // Filtrer les médias par photographe
      .filter((media) => media.photographerId === photographerId)
      // Trier les médias par date
      .forEach((media) => {
        // Créer une instance de la classe ImageMediaFactory ou VideoMediaFactory
        const factory = media.image
          ? // Vérifier si le média est une image ou une vidéo
            // Créer une instance de la classe ImageMediaFactory
            new ImageMediaFactory(media, photographerName)
          : // Créer une instance de la classe VideoMediaFactory
            new VideoMediaFactory(media, photographerName);
        // Créer un élément média
        const mediaDiv = factory.createMediaElement();

        if (main.contains(mediaSection)) {
          // Ajouter la div du média à la section des médias
          mediaSection.appendChild(mediaDiv);
        } else {
          console.error(" La section des médias a été supprimée du DOM");
        }
      });

    const mediaImageOrVideo = document.querySelectorAll(
      ".media-image, .media-video"
    );

    // Ajouter un écouteur d'événement pour afficher le média dans le lightbox
    mediaImageOrVideo.forEach((media) => {
      media.addEventListener("click", (event) => {
        const imageDiv = event.target.closest(".image-div");
        const videoDiv = event.target.closest(".video-div");
        const mediaDiv = imageDiv || videoDiv;
        updateMediaIndex();
        if (mediaDiv) {
          displayLightbox(mediaDiv, photographerName);
        }
      });
    });

    // Ajouter un écouteur d'événement pour afficher le média dans le lightbox
    mediaImageOrVideo.forEach((media) => {
      media.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const imageDiv = event.target.closest(".image-div");
          const videoDiv = event.target.closest(".video-div");
          const mediaDiv = imageDiv || videoDiv;
          updateMediaIndex();
          if (mediaDiv) {
            displayLightbox(mediaDiv, photographerName);
          }
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des médias", error);
  }
}

// Créer une fonction pour afficher le lightbox
function displayLightbox(mediaDiv, photographerName) {
  // Récupérer l'index du média
  const index = sortedMediaList.indexOf(mediaDiv);
  // Créer une instance de la classe Lightbox
  new Lightbox(index, photographerName);
}

// Créer une classe pour le lightbox
class Lightbox {
  constructor(index, photographerName) {
    this.index = index;
    this.photographerName = photographerName;
    this.mediaList = sortedMediaList;
    this.createLightbox();
    document.addEventListener("keydown", this.handleKeydown);
  }

  createLightbox() {
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-button");
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.title = "Fermer";
    closeBtn.addEventListener("click", this.closeLightbox.bind(this));
    lightbox.appendChild(closeBtn);

    const mediaDiv = document.createElement("div");
    mediaDiv.classList.add("lightbox-media");
    mediaDiv.innerHTML = this.mediaList[this.index].innerHTML;
    lightbox.appendChild(mediaDiv);

    const title = document.createElement("p");
    title.classList.add("lightbox-title");
    mediaDiv.appendChild(title);
    this.title = title;

    const previousBtn = document.createElement("button");
    previousBtn.classList.add("prev-button");
    previousBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    previousBtn.title = "Média précédent";
    previousBtn.addEventListener("click", this.previousMedia.bind(this));
    lightbox.appendChild(previousBtn);

    const nextBtn = document.createElement("button");
    nextBtn.classList.add("next-button");
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.title = "Média suivant";
    nextBtn.addEventListener("click", this.nextMedia.bind(this));
    lightbox.appendChild(nextBtn);

    this.updateMedia();
  }

  updateMedia() {
    const mediaDiv = this.mediaList[this.index];

    // Mettre à jour le contenu de la lightbox avec le contenu du mediaDiv sélectionné
    this.lightbox.querySelector(".lightbox-media").innerHTML =
      mediaDiv.innerHTML;

    // Sélectionner l'élément avec la classe "media-image" dans la lightbox et remplacer la classe
    const mediaImageElement = this.lightbox.querySelector(".media-image");
    if (mediaImageElement) {
      mediaImageElement.classList.replace("media-image", "lightbox-image");
    }

    const mediaVideoElement = this.lightbox.querySelector(".media-video");
    if (mediaVideoElement) {
      mediaVideoElement.classList.replace("media-video", "lightbox-video");
      mediaVideoElement.controls = true;
    }

    const mediaInfo = this.lightbox.querySelector(".media-info");
    if (mediaInfo) {
      mediaInfo.classList.replace("media-info", "lightbox-info");
    }

    // Mettre à jour le titre dans la lightbox avec le titre du mediaDiv sélectionné
    const mediaTitle = this.lightbox.querySelector(".media-title");
    if (mediaTitle) {
      mediaTitle.classList.replace("media-title", "lightbox-title");
    }
    this.title.textContent = mediaDiv.querySelector(".media-title").textContent;

    const likesDiv = this.lightbox.querySelector(".likes-div");
    if (likesDiv) {
      likesDiv.remove();
    }
  }

  nextMedia() {
    this.index = (this.index + 1) % this.mediaList.length;
    this.updateMedia();
  }

  previousMedia() {
    this.index =
      (this.index - 1 + this.mediaList.length) % this.mediaList.length;
    this.updateMedia();
  }

  closeLightbox() {
    this.lightbox.remove();
    document.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown = (event) => {
    if (event.key === "Escape") {
      this.closeLightbox();
    } else if (event.key === "ArrowRight") {
      this.nextMedia();
    } else if (event.key === "ArrowLeft") {
      this.previousMedia();
    } else if (event.key === "Enter") {
      this.displayLightbox();
    }
  };
}
