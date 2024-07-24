function photographerTemplate(data) {
  // Récupérer les données du photographe
  const { name, id, city, country, tagline, price, portrait } = data;
  // Récupérer le chemin de l'image du photographe
  const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`;
  // Créer une fonction pour récupérer le DOM du photographe
  function getUserCardDOM() {
    // Créer un article
    const article = document.createElement("article");
    // Créer une image
    const img = document.createElement("img");
    // Ajouter les attributs de l'image
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);
    // Créer un titre
    const h2 = document.createElement("h2");
    // Ajouter le nom du photographe
    h2.textContent = name;
    // Créer un paragraphe pour la localisation
    const location = document.createElement("p");
    // Ajouter la classe location
    location.classList.add("location");
    // Ajouter la localisation
    location.textContent = `${city}, ${country}`;
    // Créer un paragraphe pour la description
    const description = document.createElement("p");
    // Ajouter la classe description
    description.classList.add("description");
    // Ajouter la description
    description.textContent = tagline;
    // Créer un paragraphe pour le prix
    const pricePerDay = document.createElement("p");
    // Ajouter la classe price
    pricePerDay.classList.add("price");
    // Ajouter le prix par jour
    pricePerDay.textContent = `${price}€/jour`;
    // Ajouter les éléments à l'article
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(location);
    article.appendChild(description);
    article.appendChild(pricePerDay);
    // Ajouter les classes et les attributs à l'article
    article.classList.add("photographer_card");
    article.setAttribute("data-id", id);
    article.setAttribute("tabindex", "0");
    article.setAttribute(
      "aria-label",
      `Voir le profil de ${name} à ${city}, ${country}`
    );
    // Ajouter un écouteur d'événement au clic
    article.addEventListener("click", (event) => {
      // Empêcher le comportement par défaut
      event.preventDefault();
      // Rediriger vers la page du photographe
      window.location.href = `photographer.html?id=${id}`;
    });

    // Ajouter un écouteur d'événement à la touche Entrée
    article.addEventListener("keydown", (event) => {
      // Vérifier si la touche Entrée est enfoncée
      if (event.key === "Enter") {
        // Empêcher le comportement par défaut
        event.preventDefault();
        // Rediriger vers la page du photographe
        window.location.href = `photographer.html?id=${id}`;
      }
    });

    // Retourner l'article
    return article;
  }
  // Retourner les données du photographe et la fonction pour récupérer le DOM du photographe
  return { name, picture, id, city, country, tagline, price, getUserCardDOM };
}
