const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".product-card");
const departmentLinks = document.querySelectorAll("[data-jump-filter]");

const selectFilter = (selected) => {
  filters.forEach((item) => item.classList.toggle("active", item.dataset.filter === selected));
  cards.forEach((card) => {
    card.hidden = selected !== "all" && card.dataset.category !== selected;
  });
};

cards.forEach((card) => {
  const title = card.querySelector("h3")?.textContent.trim();
  const action = document.createElement("a");
  action.href = `https://wa.me/263773066530?text=${encodeURIComponent(`Hi Charie's Delightful Homes, I want to order ${title}.`)}`;
  action.target = "_blank";
  action.rel = "noreferrer";
  action.textContent = "Order item";
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
