export function mediaFactory(media, photographerName, totalLikesCounter) {
  function getMediaCardDOM() {
    const div = document.createElement("div");
    div.className = media.image ? "image-div" : "video-div";
    div.dataset.date = media.date;
    div.dataset.likes = media.likes;
    div.dataset.title = media.title;

    const element = document.createElement(media.image ? "img" : "video");
    element.src = `assets/photographers/${photographerName}/${media.image || media.video}`;
    element.alt = media.title;
    element.className = media.image ? "media-image" : "media-video";
    element.tabIndex = 0;

    const info = document.createElement("div");
    info.className = "media-info";

    const h3 = document.createElement("h3");
    h3.className = "media-title";
    h3.textContent = media.title;

    const likesDiv = document.createElement("div");
    likesDiv.className = "likes-div";

    const p = document.createElement("p");
    p.className = "media-likes";
    p.textContent = media.likes;

    const heart = document.createElement("i");
    heart.className = "fas fa-heart like-btn";
    heart.tabIndex = 0;
    heart.setAttribute("aria-label", "likes");

    // Utiliser la méthode toggleLike de totalLikesCounter
    heart.addEventListener("click", () => totalLikesCounter.toggleLike(media, p));
    heart.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        totalLikesCounter.toggleLike(media, p);
      }
    });

    likesDiv.append(p, heart);
    info.append(h3, likesDiv);
    div.append(element, info);
    return div;
  }

  return { getMediaCardDOM };
}
