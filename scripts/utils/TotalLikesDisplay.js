export default class TotalLikesDisplay {
  constructor(initial, price) {
    this.total = initial;
    this.price = price;
    this.display = this.createDisplay();
  }

  createDisplay() {
    const main = document.getElementById("main");
    const wrapper = document.createElement("div");
    wrapper.className = "total-likes-div";

    const p = document.createElement("p");
    p.className = "total-likes";
    const span = document.createElement("span");
    span.textContent = this.total;
    const icon = document.createElement("i");
    icon.className = "fas fa-heart like-icon";
    p.append(span, icon);

    const priceP = document.createElement("p");
    priceP.className = "photographer-price";
    priceP.textContent = `${this.price}€ / jour`;

    wrapper.append(p, priceP);
    main.appendChild(wrapper);
    return span;
  }

  updateLikes(n) {
    this.total += n;
    this.display.textContent = this.total;
  }

  toggleLike(media, likeElement) {
    if (!media.liked) {
      media.likes++;
      this.updateLikes(1);
    } else {
      media.likes--;
      this.updateLikes(-1);
    }
    media.liked = !media.liked;
    likeElement.textContent = media.likes;
  }
}