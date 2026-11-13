const heroPromo = document.getElementById("hero-promo");
const heroServices = document.getElementById("hero-services");
const promoStart = Date.parse("2026-11-01T00:00:00-06:00");
const promoEnd = Date.parse("2026-12-01T00:00:00-06:00");
let promoTimer;

function updatePromotion() {
  clearTimeout(promoTimer);
  const now = Date.now();
  const active = now >= promoStart && now < promoEnd;
  heroPromo.hidden = !active;
  heroServices.hidden = active;
  if (now < promoEnd) {
    const nextChange = now < promoStart ? promoStart : promoEnd;
    promoTimer = setTimeout(updatePromotion, Math.min(nextChange - now, 2_147_483_647));
  }
}

window.addEventListener("pageshow", updatePromotion);
document.addEventListener("visibilitychange", updatePromotion);
updatePromotion();

const serviceAssetUrls = globalThis.expressCareAssets ?? {};
const services = [
  {
    id: "aceite",
    label: "Aceite",
    title: "Cambio de aceite con servicio completo",
    image: "aceite.jpg",
    alt: "Aceite de motor vertiéndose en el motor de un auto",
    price: "$899 MXN",
    description: "Renovación del aceite y del filtro de aceite. El tipo y la cantidad de aceite dependen del vehículo.",
    options: [
      ["Aceite de motor", "Según la especificación del vehículo"],
      ["Filtro de aceite", "Compatible con el motor"],
      ["Nivel de aceite", "Comprobación después del cambio"]
    ]
  },
  {
    id: "filtros",
    label: "Filtros",
    title: "Cambio de filtros de aire",
    image: "filtros.jpg",
    alt: "Filtros de aire nuevos junto al motor de un auto",
    price: "Desde $349 MXN",
    description: "El filtro de motor protege la admisión de aire. El filtro de cabina ayuda a retener partículas del aire que entra al interior del auto.",
    options: [
      ["Filtro de aire del motor", "$349 MXN de ejemplo"],
      ["Filtro de aire de la cabina", "$449 MXN de ejemplo"]
    ]
  },
  {
    id: "limpiaparabrisas",
    label: "Limpiaparabrisas",
    title: "Cambio de limpiaparabrisas",
    image: "limpiaparabrisas.jpg",
    alt: "Instalación de una escobilla de limpiaparabrisas",
    price: "Desde $299 MXN",
    description: "Reemplazo de escobillas desgastadas con medidas compatibles con el parabrisas del vehículo.",
    options: [["Escobilla delantera", "Precio de ejemplo por pieza"]]
  },
  {
    id: "radiador",
    label: "Radiador",
    title: "Servicio del radiador",
    image: "radiador.jpg",
    alt: "Revisión del depósito de refrigerante en el motor de un auto",
    price: "Desde $749 MXN",
    description: "Revisión del nivel y del estado del refrigerante. El centro puede confirmar el servicio adecuado para tu vehículo.",
    options: [["Sistema de enfriamiento", "Revisión del refrigerante"]]
  },
  {
    id: "llantas",
    label: "Llantas",
    title: "Ajuste de presión de las llantas",
    image: "llantas.jpg",
    alt: "Medición de presión en la válvula de una llanta",
    price: "$99 MXN",
    description: "Medición y ajuste de la presión de las llantas según las indicaciones del fabricante del vehículo.",
    options: [["Llantas del vehículo", "Medición y ajuste de presión"]]
  }
];

function icon(name, className = "") {
  return `<svg class="icon ${className}" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}

const panels = document.getElementById("service-panels");
panels.innerHTML = services.map((service, index) => `
  <h3 class="accordion-heading">
    <button type="button" id="accordion-${service.id}" class="accordion-toggle"
      aria-expanded="${index === 0}" aria-controls="panel-${service.id}" data-service="${service.id}">
      ${icon(service.id)} <span>${service.label}</span> ${icon("down", "accordion-chevron")}
    </button>
  </h3>
  <div id="panel-${service.id}" class="service-panel" role="tabpanel"
    aria-labelledby="tab-${service.id}" tabindex="0" ${index ? "hidden" : ""}>
    <button class="zoom-trigger service-media" type="button" aria-label="Ampliar imagen de ${service.label.toLowerCase()}" aria-haspopup="dialog">
      <img class="service-image" src="${serviceAssetUrls[service.image] ?? `./assets/${service.image}`}" alt="${service.alt}" width="500" height="500" loading="lazy" decoding="async">
      <span class="zoom-indicator">${icon("expand")}</span>
    </button>
    <div class="service-copy">
      <h3 class="service-title">${service.title}</h3>
      <p class="service-price">${service.price} <span>Precio de ejemplo</span></p>
      <p class="service-description">${service.description}</p>
      <div class="service-options">
        ${service.options.map(([title, description]) => `
          <div class="service-option"><p class="service-option-title">${title}</p><p class="service-option-description">${description}</p></div>
        `).join("")}
      </div>
      <a class="button button-navy" href="#contacto">Buscar un centro ${icon("down", "direction-icon")}</a>
      <p class="service-note">Ficha de demostración. Consulta el precio y la disponibilidad con tu centro.</p>
    </div>
  </div>
`).join("");

const desktopTabs = Array.from(document.querySelectorAll('[role="tab"]'));
const accordionButtons = Array.from(document.querySelectorAll(".accordion-toggle"));
const mobileLayout = matchMedia("(max-width: 730px)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let selectedService = services[0].id;

function selectService(id, focusTab = false) {
  selectedService = id;
  for (const [index, service] of services.entries()) {
    const active = service.id === id;
    const tab = desktopTabs[index];
    const accordion = accordionButtons[index];
    const panel = document.getElementById(`panel-${service.id}`);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    accordion.setAttribute("aria-expanded", String(active));
    panel.hidden = !active;
    if (active && focusTab) tab.focus({ preventScroll: true });
  }
}

function syncPanelLabels() {
  for (const { id } of services) {
    const panel = document.getElementById(`panel-${id}`);
    panel.setAttribute("role", mobileLayout.matches ? "region" : "tabpanel");
    panel.setAttribute("aria-labelledby", `${mobileLayout.matches ? "accordion" : "tab"}-${id}`);
    panel.tabIndex = mobileLayout.matches ? -1 : 0;
    panel.querySelector(".service-title").setAttribute("aria-level", mobileLayout.matches ? "4" : "3");
  }
  if (!mobileLayout.matches && !selectedService) selectService(services[0].id);
}

desktopTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectService(tab.dataset.service));
  tab.addEventListener("keydown", (event) => {
    const lastIndex = desktopTabs.length - 1;
    const destination = {
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      ArrowRight: index === lastIndex ? 0 : index + 1,
      Home: 0,
      End: lastIndex
    }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    selectService(desktopTabs[destination].dataset.service, true);
  });
});

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.service;
    selectService(selectedService === id ? null : id);
    if (selectedService && button.getBoundingClientRect().top < 0) {
      button.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "instant" : "smooth" });
    }
  });
});
mobileLayout.addEventListener("change", syncPanelLabels);
syncPanelLabels();

document.querySelectorAll("[data-service-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const id = link.dataset.serviceLink;
    selectService(id);
    const control = document.getElementById(`${mobileLayout.matches ? "accordion" : "tab"}-${id}`);
    control.focus({ preventScroll: true });
    const destination = mobileLayout.matches ? control : document.getElementById("servicios");
    destination.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "instant" : "smooth" });
  });
});

const menuButton = document.querySelector(".mobile-menu");
const navigation = document.getElementById("navigation");
function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
}
menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || menuButton.getAttribute("aria-expanded") !== "true") return;
  setMenu(false);
  const href = link.getAttribute("href");
  if (href.startsWith("#")) document.getElementById(href.slice(1))?.focus({ preventScroll: true });
});
document.addEventListener("pointerdown", (event) => {
  if (menuButton.getAttribute("aria-expanded") === "true" && !event.target.closest(".header")) setMenu(false);
});
document.addEventListener("focusin", (event) => {
  if (menuButton.getAttribute("aria-expanded") === "true" && !event.target.closest(".header")) setMenu(false);
});
mobileLayout.addEventListener("change", () => setMenu(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = document.getElementById("lightbox-caption");
let lightboxTrigger;

document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".zoom-trigger");
  if (!trigger || lightbox.open) return;
  const image = trigger.querySelector("img");
  lightboxTrigger = trigger;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxCaption.textContent = image.alt;
  lightbox.showModal();
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  lightboxTrigger?.focus({ preventScroll: true });
});

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -24px 0px", threshold: 0.08 });
  document.querySelectorAll(".overview, .services, .contact, .share").forEach((section) => {
    if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
  });
}

const shareUrl = new URL(location.href);
shareUrl.hash = "";
shareUrl.search = "";
const canShareUrl = ["https:", "http:"].includes(shareUrl.protocol);
const shareStatus = document.getElementById("share-status");
const localShareMessage = "Comparte el archivo del demo para que otra persona pueda abrirlo.";
const encodedUrl = encodeURIComponent(shareUrl.href);
const encodedTitle = encodeURIComponent("Express Care México | Demo");
const shareTargets = {
  whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
};
document.querySelectorAll("[data-share]").forEach((link) => {
  if (canShareUrl) {
    link.href = shareTargets[link.dataset.share];
    return;
  }
  link.href = "#share-title";
  link.removeAttribute("target");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    shareStatus.textContent = localShareMessage;
  });
});
const copyLink = document.getElementById("copy-link");
const copyIcon = copyLink.querySelector("use");
let copyFeedback;
copyLink.addEventListener("click", async () => {
  if (!canShareUrl) {
    shareStatus.textContent = localShareMessage;
    return;
  }
  try {
    await navigator.clipboard.writeText(shareUrl.href);
    shareStatus.textContent = "Enlace copiado.";
    copyIcon.setAttribute("href", "#icon-check");
    copyLink.classList.add("is-copied");
    clearTimeout(copyFeedback);
    copyFeedback = setTimeout(() => {
      copyIcon.setAttribute("href", "#icon-copy");
      copyLink.classList.remove("is-copied");
    }, 2200);
  } catch {
    shareStatus.textContent = shareUrl.href;
  }
});

const backTop = document.querySelector(".back-top");
function updateBackTop() {
  backTop.hidden = window.scrollY < 500;
}
window.addEventListener("scroll", updateBackTop, { passive: true });
updateBackTop();

const branchPicker = document.querySelector(".branch-picker");
if (branchPicker) {
  const branchName = document.getElementById("branch-name");
  const branchAddress = document.getElementById("branch-address");
  const branchPhone = document.getElementById("branch-phone");
  const branchHours = document.getElementById("branch-hours");
  const branchMap = document.getElementById("branch-map");
  const branchMapPreview = document.getElementById("branch-map-preview");
  const branchMapName = document.getElementById("branch-map-name");
  const branchMapLink = document.getElementById("branch-map-link");
  const branchDirections = document.getElementById("branch-directions");
  let activeBranch = branchPicker.querySelector('[aria-pressed="true"]');
  const servedOverHttp = ["http:", "https:"].includes(location.protocol);
  const browserPage = window.self === window.top || window.frameElement !== null;
  let canEmbed = servedOverHttp && browserPage && window.origin !== "null";

  function updateBranchMap() {
    const name = activeBranch.textContent.trim();
    const destination = encodeURIComponent(activeBranch.dataset.address);
    branchMapName.textContent = name;
    branchMapLink.href = `https://www.google.com/maps/search/?api=1&query=${destination}`;
    if (!canEmbed) return;

    branchMap.title = `Google Maps: sucursal ${name}`;
    const mapUrl = `https://www.google.com/maps?q=${destination}&z=17&hl=es&output=embed`;
    if (branchMap.getAttribute("src") !== mapUrl) branchMap.src = mapUrl;
    branchMap.hidden = false;
    branchMapPreview.hidden = true;
  }

  if (canEmbed) {
    document.addEventListener("securitypolicyviolation", (event) => {
      const googleMapsBlocked = /^https:\/\/www\.google\.com(?:\/|$)/.test(event.blockedURI);
      if (event.effectiveDirective !== "frame-src" || !googleMapsBlocked) return;

      canEmbed = false;
      branchMap.hidden = true;
      branchMap.removeAttribute("src");
      branchMapPreview.hidden = false;
    });
  }
  if (canEmbed && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      updateBranchMap();
    });
    observer.observe(branchMap.parentElement);
  } else {
    updateBranchMap();
  }

  branchPicker.addEventListener("click", (event) => {
    const branch = event.target.closest(".branch-option");
    if (!branch || branch === activeBranch) return;

    const name = branch.textContent.trim();
    const { address, phone, hours } = branch.dataset;
    const destination = encodeURIComponent(address);

    activeBranch.setAttribute("aria-pressed", "false");
    branch.setAttribute("aria-pressed", "true");
    activeBranch = branch;
    branchName.textContent = name;
    branchAddress.textContent = address;
    branchPhone.textContent = phone;
    branchPhone.href = `tel:+52${phone.replace(/\D/g, "")}`;
    branchHours.textContent = hours;
    branchDirections.href = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    updateBranchMap();
  });
}
