import { photographerTemplate } from "../templates/photographer.js";

async function getPhotographers() {
  try {
    // Récupérer les données des photographes
    const data = await fetch("data/photographers.json");
    if (!data.ok) {
      throw new Error("HTTP Error! Status : " + data.status);
    }
    // Récupérer les photographes
    const photographersData = await data.json();
    return { photographers: photographersData.photographers };
  } catch (error) {
    console.error("Error fetch photographers: ", error);
    return { photographers: [] };
  }
}

// 1- Créer une fonction displayData pour afficher les photographes
async function displayData(photographers) {
  // Récupérer la section des photographes
  const photographersSection = document.querySelector(".photographer_section");
  if (!photographersSection) {
    console.error("No photographer section found!");
    return;
  }
  // Récupérer le template des photographes
  photographers.forEach((photographer) => {
    // Créer un modèle de photographe
    const photographerModel = photographerTemplate(photographer);
    if (photographerModel) {
      // Récupérer le DOM du photographe
      const userCardDOM = photographerModel.getUserCardDOM();
      if (userCardDOM) {
        // Ajouter le DOM du photographe à la section des photographes
        photographersSection.appendChild(userCardDOM);
      } else {
        console.error("No user card DOM found!");
      }
    } else {
      console.error("No user card model found!");
    }
  });
}

// 2- Ajouter la fonction init pour appeler getPhotographers et displayData
async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  if (photographers.length > 0) {
    displayData(photographers);
  } else {
    console.error("No photographers data found to display!");
  }
}

// 3- Appeler la fonction init pour lancer l'application
init();
