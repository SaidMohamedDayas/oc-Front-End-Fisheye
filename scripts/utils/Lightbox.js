export let sortedMediaList = [];

export default class Lightbox {
  constructor(index, photographerName) {
    this.index = index;
    this.photographerName = photographerName;
    this.mediaList = sortedMediaList;
    this.createLightbox();
    document.addEventListener("keydown", this.handleKeydown);
  }

  createLightbox() {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.tabIndex = 0;
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-button";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.title = "Fermer";
    closeBtn.addEventListener("click", this.closeLightbox.bind(this));

    const content = document.createElement("div");
    content.className = "lightbox-media";
    content.innerHTML = this.mediaList[this.index].innerHTML;

    const title = document.createElement("p");
    title.className = "lightbox-title";
    content.appendChild(title);
    this.title = title;

    const prev = document.createElement("button");
    prev.className = "prev-button";
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prev.title = "Média précédent";
    prev.addEventListener("click", this.previousMedia.bind(this));

    const next = document.createElement("button");
    next.className = "next-button";
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';
    next.title = "Média suivant";
    next.addEventListener("click", this.nextMedia.bind(this));

    lightbox.append(closeBtn, content, prev, next);
    lightbox.focus();

    this.updateMedia();
  }

  updateMedia() {
    const mediaDiv = this.mediaList[this.index];
    const lightboxMedia = this.lightbox.querySelector(".lightbox-media");
    lightboxMedia.innerHTML = mediaDiv.innerHTML;

    const img = lightboxMedia.querySelector(".media-image");
    if (img) img.classList.replace("media-image", "lightbox-image");

    const vid = lightboxMedia.querySelector(".media-video");
    if (vid) {
      vid.classList.replace("media-video", "lightbox-video");
      vid.controls = true;
    }

    const mediaInfo = lightboxMedia.querySelector(".media-info");
    if (mediaInfo) {
      mediaInfo.classList.replace("media-info", "lightbox-info");
    }

    const mediaTitle = lightboxMedia.querySelector(".media-title");
    if (mediaTitle) {
      this.title.textContent = mediaTitle.textContent;
    }

    const likes = lightboxMedia.querySelector(".likes-div");
    if (likes) likes.remove();
  }

  previousMedia() {
    this.index = (this.index - 1 + this.mediaList.length) % this.mediaList.length;
    this.updateMedia();
  }

  nextMedia() {
    this.index = (this.index + 1) % this.mediaList.length;
    this.updateMedia();
  }

  closeLightbox() {
    this.lightbox.remove();
    document.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown = (e) => {
    if (e.key === "Escape") this.closeLightbox();
    if (e.key === "ArrowRight") this.nextMedia();
    if (e.key === "ArrowLeft") this.previousMedia();
  };
}