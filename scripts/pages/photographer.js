// Importations
import Lightbox, { sortedMediaList } from "../utils/Lightbox.js";
import TotalLikesDisplay from "../utils/TotalLikesDisplay.js";
import { mediaFactory } from "../templates/media.js";
import { photographerTemplate } from "../templates/photographer.js";

// Variables globales
let photographers = [];
let totalLikesCounter = 0;

// Fonctions utilitaires
function wrapImageInLink(imageElement, linkURL) {
  const link = document.createElement("a");
  link.href = linkURL;
  imageElement.parentNode.insertBefore(link, imageElement);
  link.appendChild(imageElement);
  link.setAttribute("aria-label", "Retour à l'accueil");
  link.title = "Retour à l'accueil";
}

// Chargement des données
async function loadData() {
  try {
    const response = await fetch("data/photographers.json");
    if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
    const data = await response.json();
    photographers = data.photographers;
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
}

// Affichage du photographe
function displayPhotographer() {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    document.title = "Fisheye - Photographe non trouvé";
    return;
  }
  document.title = `Fisheye - ${photographer.name}`;

  const header = document.querySelector(".photograph-header");
  const photographerModel = photographerTemplate(photographer);
  const userCardDOM = photographerModel.getUserCardDOM();

  // Ajouter le DOM du photographe à l'en-tête
  const profileElements = userCardDOM.querySelectorAll(".location, .description");
  const profileDiv = document.createElement("div");
  profileDiv.className = "photograph-profile";

  // Créer et ajouter le nom du photographe
  const nameElement = document.createElement("h2");
  nameElement.className = "photograph-name";
  nameElement.textContent = photographer.name;
  profileDiv.appendChild(nameElement);

  // Ajouter les éléments de localisation et de description
  profileElements.forEach((el) => {
    if (el.classList.contains("location")) {
      el.classList.replace("location", "photograph-location");
    }
    if (el.classList.contains("description")) {
      el.classList.replace("description", "photograph-description");
    }
    profileDiv.appendChild(el);
  });

  header.prepend(profileDiv);

  const img = userCardDOM.querySelector("img");
  img.classList.add("photographer-portrait");
  header.appendChild(img);
}

// Tri et affichage des médias
function initializeSortSelect() {
  const main = document.getElementById("main");
  const container = document.createElement("div");
  container.className = "select-div";

  const label = document.createElement("label");
  label.textContent = "Trier par";
  label.setAttribute("for", "sort-select");
  label.id = "sort-label";

  const selectedButton = document.createElement("button");
  selectedButton.className = "selected-option";
  selectedButton.setAttribute("aria-labelledby", "sort-label");
  selectedButton.setAttribute("type", "button");
  selectedButton.setAttribute("role", "listbox");
  selectedButton.setAttribute("aria-expanded", "false");

  const span = document.createElement("span");
  span.id = "sort-span";
  span.textContent = "Popularité";

  const icon = document.createElement("i");
  icon.className = "fas fa-chevron-down";

  selectedButton.append(span, icon);

  const list = document.createElement("ul");
  list.className = "sort-select";
  list.id = "sort-select";

  ["Date", "Titre"].forEach((label) => {
    const li = document.createElement("li");
    li.textContent = label;
    li.setAttribute("role", "option");
    li.tabIndex = 0;
    list.appendChild(li);
  });

  container.append(label, selectedButton, list);
  main.appendChild(container);

  addSortChangeListener(list, selectedButton, span, icon);
}

// Ajout d'un écouteur d'événements pour le changement de tri
function addSortChangeListener(select, button, span, icon) {
  button.addEventListener("click", () => {
    const open = select.style.display === "block";
    select.style.display = open ? "none" : "block";
    button.setAttribute("aria-expanded", !open);
    icon.classList.toggle("fa-chevron-up", !open);
    icon.classList.toggle("fa-chevron-down", open);
  });

  select.addEventListener("click", (e) => {
    const option = e.target.textContent;
    const current = span.textContent;
    span.textContent = option;
    e.target.textContent = current;
    select.style.display = "none";
    icon.className = "fas fa-chevron-down";

    switch (option) {
      case "Popularité":
        sortMediasByPopularity(); break;
      case "Date":
        sortMediasByDate(); break;
      case "Titre":
        sortMediasByTitle(); break;
    }
  });

  select.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.target.click();
  });
}

// Fonctions de tri
function sortMediasByPopularity() {
  sortMediaSection((a, b) => parseInt(b.likes) - parseInt(a.likes));
}
function sortMediasByTitle() {
  sortMediaSection((a, b) => a.title.localeCompare(b.title));
}
function sortMediasByDate() {
  sortMediaSection((a, b) => new Date(b.date) - new Date(a.date));
}

function sortMediaSection(compareFn) {
  const mediaSection = document.querySelector(".media-section");
  const mediaElements = Array.from(mediaSection.children);
  mediaElements.sort((a, b) => compareFn(a.dataset, b.dataset));
  mediaElements.forEach((el) => mediaSection.appendChild(el));
  updateMediaIndex();
}

// Met à jour l'index des médias pour la lightbox et le tri
function updateMediaIndex() {
  sortedMediaList.length = 0;
  const mediaElements = Array.from(document.querySelectorAll(".media-section > div"));
  sortedMediaList.push(...mediaElements);
}

// Affichage des médias
async function displayMedias() {
  const photographerId = parseInt(new URLSearchParams(window.location.search).get("id"));
  const response = await fetch("data/photographers.json");
  const data = await response.json();
  const photographer = photographers.find((p) => p.id === photographerId);
  const medias = data.media.filter((m) => m.photographerId === photographerId);
  const initialLikes = medias.reduce((sum, m) => sum + m.likes, 0);

  totalLikesCounter = new TotalLikesDisplay(initialLikes, photographer.price);

  const section = document.querySelector(".media-section") || document.createElement("section");
  section.className = "media-section";
  document.getElementById("main").appendChild(section);

  medias.forEach((media) => {
    const mediaCard = mediaFactory(media, photographer.name, totalLikesCounter).getMediaCardDOM();
    section.appendChild(mediaCard);
  });

  updateMediaIndex();

  document.querySelectorAll(".media-image, .media-video").forEach((el) => {
    el.addEventListener("click", (e) => {
      const mediaDiv = e.target.closest(".image-div, .video-div");
      if (mediaDiv) displayLightbox(mediaDiv, photographer.name);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const mediaDiv = e.target.closest(".image-div, .video-div");
        if (mediaDiv) displayLightbox(mediaDiv, photographer.name);
      }
    });
  });
}

// Lightbox
function displayLightbox(mediaDiv, photographerName) {
  const index = sortedMediaList.indexOf(mediaDiv);
  new Lightbox(index, photographerName);
}

// Initialisation
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const logo = document.querySelector("header .logo");
    wrapImageInLink(logo, "./index.html");
    logo.setAttribute("alt", "Fisheye logo");

    await loadData();
    displayPhotographer();
    displayMedias();
    initializeSortSelect();
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
});