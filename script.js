const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".product-card");
const departmentLinks = document.querySelectorAll("[data-jump-filter]");
const savedCount = document.querySelector("[data-saved-count]");
const modal = document.querySelector(".product-modal");
const modalImage = document.querySelector(".modal-image");
const modalCategory = document.querySelector(".modal-category");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector(".modal-description");
const modalPrice = document.querySelector(".modal-price");
const modalOrder = document.querySelector(".modal-order");
const closeModalControls = document.querySelectorAll("[data-close-modal]");

const savedItems = new Set();

const selectFilter = (selected) => {
  filters.forEach((item) => item.classList.toggle("active", item.dataset.filter === selected));
  cards.forEach((card) => {
    card.hidden = selected !== "all" && card.dataset.category !== selected;
  });
};

const updateSavedCount = () => {
  if (savedCount) savedCount.textContent = savedItems.size;
};

const getProductData = (card) => {
  const title = card.querySelector("h3")?.textContent.trim() || "Product";
  const category = card.querySelector(".category")?.textContent.trim() || "Catalogue";
  const description = card.querySelector("p:not(.category)")?.textContent.trim() || "Available from Charie's Delightful Homes.";
  const price = card.querySelector("strong")?.textContent.trim() || "Ask for price";
  const image = card.querySelector("img");
  const orderHref = `https://wa.me/263773066530?text=${encodeURIComponent(`Hi Charie's Delightful Homes, I want to order ${title}.`)}`;

  return {
    title,
    category,
    description,
    price,
    imageSrc: image?.getAttribute("src") || "",
    imageAlt: image?.getAttribute("alt") || title,
    orderHref,
  };
};

const openProductModal = (card) => {
  if (!modal) return;
  const product = getProductData(card);

  modalImage.src = product.imageSrc;
  modalImage.alt = product.imageAlt;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;
  modalOrder.href = product.orderHref;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const closeProductModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

cards.forEach((card) => {
  const product = getProductData(card);
  const tools = document.createElement("div");
  const favorite = document.createElement("button");
  const preview = document.createElement("button");
  const action = document.createElement("a");

  tools.className = "card-tools";
  favorite.className = "icon-button favorite-button";
  favorite.type = "button";
  favorite.setAttribute("aria-label", `Save ${product.title}`);
  favorite.textContent = "♡";
  preview.className = "icon-button quick-view-button";
  preview.type = "button";
  preview.setAttribute("aria-label", `Preview ${product.title}`);
  preview.textContent = "↗";

  action.href = product.orderHref;
  action.target = "_blank";
  action.rel = "noreferrer";
  action.textContent = "Order item";

  favorite.addEventListener("click", () => {
    if (savedItems.has(product.title)) {
      savedItems.delete(product.title);
      favorite.classList.remove("is-saved");
      favorite.textContent = "♡";
    } else {
      savedItems.add(product.title);
      favorite.classList.add("is-saved");
      favorite.textContent = "♥";
    }
    updateSavedCount();
  });

  preview.addEventListener("click", () => openProductModal(card));

  tools.append(favorite, preview);
  card.prepend(tools);
  card.querySelector("div")?.append(action);
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    selectFilter(button.dataset.filter);
  });
});

departmentLinks.forEach((link) => {
  link.addEventListener("click", () => {
    selectFilter(link.dataset.jumpFilter);
  });
});

closeModalControls.forEach((control) => {
  control.addEventListener("click", closeProductModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductModal();
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  cards.forEach((card) => observer.observe(card));
} else {
  cards.forEach((card) => card.classList.add("is-visible"));
}
