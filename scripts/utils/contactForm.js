// Récupérer le nom du photographe dans data.json
async function getPhotographerName() {
  try {
    // Récupérer l'ID du photographe depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get("id");

    // Récupérer les données des photographes
    const response = await fetch("data/photographers.json");
    const { photographers } = await response.json();

    // Trouver le photographe par son ID
    const photographer = photographers.find(
      (p) => p.id === parseInt(photographerId)
    );

    // Renvoyer le nom du photographe, ou une valeur par défaut si non trouvé
    return photographer ? photographer.name : "Photographe Inconnu";
  } catch (error) {
    console.error("Erreur lors de la récupération du nom: ", error);
    return "Photographe Inconnu"; // Renvoyer un nom par défaut en cas d'erreur
  }
}

// Fonction pour afficher le modal de contact
function displayModal() {
  // Récupérer le backdrop
  const backdropModal = document.getElementById("backdrop_modal");
  // Récupérer le modal
  const modal = document.getElementById("contact_modal");
  // Afficher le modal
  modal.style.display = "block";
  // Afficher le backdrop
  backdropModal.style.display = "block";
  // focus sur le modal
  modal.focus();
}

const contactBtn = document.getElementById("contact_button");
contactBtn.addEventListener("click", displayModal);

// Fonction pour créer le formulaire de contact
async function createContactForm(photographerId) {
  try {
    // Récupérer le nom du photographe
    const name = await getPhotographerName(photographerId);

    const backdropModal = document.createElement("div");
    backdropModal.id = "backdrop_modal";
    backdropModal.style.display = "none";
    document.body.appendChild(backdropModal);

    // Créer le div principal et définir son ID et son style
    const contactModal = document.createElement("div");
    contactModal.id = "contact_modal";
    contactModal.setAttribute("role", "dialog");
    contactModal.setAttribute("aria-labelledby", "contact_modal");
    contactModal.style.display = "none";
    contactModal.setAttribute("tabindex", "0");

    // Créer le div interne et ajouter la classe 'modal'
    const modal = document.createElement("div");
    modal.className = "modal";

    // Créer le header
    const header = document.createElement("header");
    header.className = "modal_header";

    // Ajouter le titre du header
    const h1 = document.createElement("h1");
    h1.id = "photographer-name";
    h1.setAttribute("tabindex", "0");
    h1.appendChild(document.createTextNode("Contactez-moi"));

    // Ajouter un br entre le titre et le nom du photographe
    const br = document.createElement("br");
    h1.appendChild(br);

    // Ajouter le nom du photographe
    h1.appendChild(document.createTextNode(name));

    // Ajouter l'image pour fermer le modal et ajouter un événement onclick
    const closeBtn = document.createElement("img");
    closeBtn.src = "assets/icons/close.svg";
    closeBtn.setAttribute("aria-label", "Close Contact form");
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("tabindex", "0");
    closeBtn.onclick = closeModal;
    closeBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        closeModal();
      }
    });

    // Ajouter un écouteur d'événement à la touche Echap
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });

    // Assembler le header
    header.appendChild(h1);
    header.appendChild(closeBtn);

    // Créer le formulaire
    const form = document.createElement("form");
    // form.onsubmit = sendForm;

    // Création et ajout du champ 'Prénom'
    createInputField(form, "firstname", "Prénom", "First name");
    // Création et ajout du champ 'Nom'
    createInputField(form, "lastname", "Nom", "Last name");
    // Création et ajout du champ 'Email'
    createInputField(form, "email", "Email", "Email");
    // Création et ajout du champ 'Votre message'
    createTextAreaField(form, "message", "Votre message", "Your message");

    // Créer le bouton d'envoi
    const sendBtn = document.createElement("button");
    sendBtn.className = "contact_button";
    sendBtn.textContent = "Envoyer";
    sendBtn.type = "submit";
    sendBtn.setAttribute("aria-label", "Send"); // Ajouter un attribut aria-label
    sendBtn.onclick = sendForm;

    // Ajouter le bouton d'envoi au formulaire

    // Assembler le modal complet
    modal.appendChild(header);
    modal.appendChild(form);
    form.appendChild(sendBtn);

    // Ajouter le modal au div principal
    contactModal.appendChild(modal);

    // Ajouter le div principal au corps du document
    backdropModal.appendChild(contactModal);
  } catch (error) {
    console.error(
      "Erreur lors de la création du formulaire de contact: ",
      error
    );
  }
}

// Fonction pour créer un champ de saisie
function createInputField(form, id, labelText, ariaLabel) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = labelText;
  label.setAttribute("for", id);

  const input = document.createElement("input");
  input.type = labelText === "Email" ? "email" : "text"; // Définir le type dynamiquement
  input.name = id;
  input.id = id;
  input.setAttribute("aria-label", ariaLabel);
  input.setAttribute("autocomplete", "on");

  div.appendChild(label);
  div.appendChild(input);
  form.appendChild(div);
}

// Fonction pour créer un champ de texte étendu
function createTextAreaField(form, id, labelText, ariaLabel) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = labelText;
  label.setAttribute("for", id);
  const textarea = document.createElement("textarea");
  textarea.name = id;
  textarea.id = id;
  textarea.setAttribute("aria-label", ariaLabel);
  textarea.setAttribute("autocomplete", "on");
  div.appendChild(label);
  div.appendChild(textarea);
  form.appendChild(div);
}

// Fonction pour envoyer le formulaire
async function sendForm(event) {
  // Empêcher le rechargement de la page
  event.preventDefault();
  // Récupérer les valeurs des inputs
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Si les champs ne sont pas remplis, afficher un message d'erreur
  if (!firstname || !lastname || !email || !message) {
    // Afficher un message d'erreur
    alert("Veuillez remplir tous les champs");
    return;
  } else if (!emailRegex.test(email)) {
    // Afficher un message d'erreur
    alert("Veuillez entrer une adresse email valide");
    return;
  } else {
    // Afficher un message de succès
    alert("Votre message a bien été envoyé !");
    // Afficher les valeurs en console
    console.log("Prénom : ", firstname);
    console.log("Nom : ", lastname);
    console.log("Email : ", email);
    console.log("Message : ", message);
  }

  // Vider les champs du formulaire
  document.getElementById("firstname").value = "";
  document.getElementById("lastname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";

  // Fermer le modal
  closeModal();
}

// Fonction pour fermer le modal
function closeModal() {
  const modal = document.getElementById("contact_modal");
  const backdropModal = document.getElementById("backdrop_modal");
  modal.style.display = "none";
  backdropModal.style.display = "none";
}

// Appeler la fonction pour créer le formulaire de contact
createContactForm();
