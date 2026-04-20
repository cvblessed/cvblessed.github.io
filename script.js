const products = [
  {
    id: "miere-poliflora",
    name: "Miere polifloră crudă",
    category: "Miere crudă",
    description: "Gust floral echilibrat, recoltă de primăvară-vară, ideală pentru consum zilnic.",
    price: 120,
    unit: "borcan 720 ml",
    tag: "Recomandat",
    image: "https://picsum.photos/seed/miere1/600/400",
  },
  {
    id: "miere-salcam",
    name: "Miere de salcâm",
    category: "Miere crudă",
    description: "Miere foarte deschisă la culoare, cu gust fin și dulce, preferată de copii.",
    price: 150,
    unit: "borcan 720 ml",
    tag: "Popular",
    image: "https://picsum.photos/seed/miere2/600/400",
  },
  {
    id: "miere-floarea-soarelui",
    name: "Miere de floarea-soarelui",
    category: "Miere crudă",
    description: "Textură cremoasă, caramelizată, perfectă pentru tartine și deserturi.",
    price: 110,
    unit: "borcan 720 ml",
    tag: "Stoc limitat",
    image: "https://picsum.photos/seed/miere3/600/400",
  },
  {
    id: "propolis-tinctura",
    name: "Tinctură de propolis 30",
    category: "Propolis și polen",
    description: "Extract alcoolic de propolis, potrivit pentru întărirea imunității.",
    price: 80,
    unit: "flacon 30 ml",
    tag: "Imunitate",
    image: "https://picsum.photos/seed/propolis/600/400",
  },
  {
    id: "polen-uscat",
    name: "Polen floral uscat",
    category: "Propolis și polen",
    description: "Amestec de polenuri crude, bogat în vitamine și minerale.",
    price: 90,
    unit: "borcan 300 g",
    tag: "Energie",
    image: "https://picsum.photos/seed/polen/600/400",
  },
  {
    id: "lumanari-ceara",
    name: "Set lumânări din ceară",
    category: "Cosmetică și ceară",
    description: "Lumânări rulate manual din fagure de ceară, cu parfum natural de stupină.",
    price: 130,
    unit: "set 4 bucăți",
    tag: "Cadou",
    image: "https://picsum.photos/seed/ceara/600/400",
  },
];

const cart = [];

const productsGrid = document.getElementById("productsGrid");
const cartPanel = document.getElementById("cartPanel");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function formatPrice(value) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "MDL",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderProducts() {
  productsGrid.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-badge">${product.tag}</span>
      </div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">
            <strong>${formatPrice(product.price)}</strong>
            <span>${product.unit}</span>
          </div>
          <button type="button" class="btn-add" data-product-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="10" cy="10" r="7" />
              <path d="M10 7v6m3-3H7" />
              <path d="M16 16.5 19.5 20" />
            </svg>
            Adaugă
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="cart-empty">Coșul este gol. Adaugă câteva borcane de miere pentru a începe.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "0 MDL";
    return;
  }

  let total = 0;
  let count = 0;
  cartItems.innerHTML = "";

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-thumb">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-info">
        <strong>${item.name}</strong>
        <div class="cart-meta">
          <div class="cart-qty">
            <button type="button" aria-label="Scade cantitatea" data-action="dec" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button type="button" aria-label="Crește cantitatea" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <span>${formatPrice(item.price * item.qty)}</span>
        </div>
        <button type="button" class="cart-remove" data-action="remove" data-id="${item.id}">Șterge</button>
      </div>
    `;
    cartItems.appendChild(el);
  });

  cartCount.textContent = String(count);
  cartTotal.textContent = formatPrice(total);
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function updateCartItem(productId, action) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  if (action === "inc") {
    cart[index].qty += 1;
  } else if (action === "dec") {
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  } else if (action === "remove") {
    cart.splice(index, 1);
  }
  renderCart();
}

function toggleCart(openExplicit) {
  const isOpen = cartPanel.classList.contains("is-open");
  const shouldOpen = openExplicit ?? !isOpen;
  cartPanel.classList.toggle("is-open", shouldOpen);
  cartPanel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  productsGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-add");
    if (!button) return;
    const productId = button.getAttribute("data-product-id");
    addToCart(productId);
    toggleCart(true);
  });

  cartItems.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");
    updateCartItem(id, action);
  });

  cartToggle.addEventListener("click", () => toggleCart());
  cartClose.addEventListener("click", () => toggleCart(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleCart(false);
    }
  });

  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scroll-to");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const contactForm = document.querySelector("#contact form");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert(
      "Acesta este un exemplu de front-end. Aici poți integra logica ta de trimitere a formularului (backend sau serviciu de email)."
    );
  });
});
