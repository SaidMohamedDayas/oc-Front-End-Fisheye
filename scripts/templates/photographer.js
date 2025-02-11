export function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");

    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`);
    link.setAttribute("aria-label", `Voir le profil de ${name}`);
    link.classList.add("photographer-link");

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const location = document.createElement("p");
    location.classList.add("location");
    location.textContent = `${city}, ${country}`;

    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = tagline;

    const pricePerDay = document.createElement("p");
    pricePerDay.classList.add("price");
    pricePerDay.textContent = `${price}€/jour`;

    link.appendChild(img);
    link.appendChild(h2);
    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(description);
    article.appendChild(pricePerDay);
    article.classList.add("photographer_card");
    article.setAttribute("data-id", id);
    article.setAttribute("tabindex", "0");

    return article;
  }

  return { name, picture, id, city, country, tagline, price, getUserCardDOM };
}
