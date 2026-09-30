(function () {
  "use strict";

  const PRODUCTS = window.ACTERIS_PRODUCTS || [];
  const CART_KEY = "acteris-cart";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

  const ICONS = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.1 21H2l7.3-8.3L1.5 3H8l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7.2 4.7H5.4l11 14.5z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15V9l5.8 3-5.8 3z"/></svg>',
    in: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9z"/></svg>',
  };

  /* ---------- Watch illustration ---------- */
  let watchUid = 0;

  function faceMarkup(face, id) {
    if (face === "digital") {
      return `
        <text x="99" y="108" text-anchor="middle" class="w-date" fill="#5ee7ff" font-family="Inter,sans-serif" font-size="10" font-weight="600" letter-spacing="1">MON 12</text>
        <text x="99" y="152" text-anchor="middle" class="w-time" fill="#fff" font-family="Space Grotesk,sans-serif" font-size="40" font-weight="600">10:09</text>
        <text x="72" y="186" text-anchor="middle" fill="#ff5d7a" font-family="Inter,sans-serif" font-size="11" font-weight="600">♥ 72</text>
        <text x="126" y="186" text-anchor="middle" fill="#b6ff5e" font-family="Inter,sans-serif" font-size="11" font-weight="600">8.4k</text>
        <rect x="62" y="198" width="74" height="5" rx="2.5" fill="#fff" opacity=".12"/>
        <rect x="62" y="198" width="52" height="5" rx="2.5" fill="url(#${id}g)"/>`;
    }
    if (face === "compass") {
      let ticks = "";
      for (let i = 0; i < 36; i++) {
        const long = i % 9 === 0;
        ticks += `<line x1="99" y1="${long ? 104 : 106}" x2="99" y2="112" stroke="#fff" stroke-opacity="${long ? 0.9 : 0.3}" stroke-width="${long ? 2 : 1}" transform="rotate(${i * 10} 99 150)"/>`;
      }
      return `
        ${ticks}
        <text x="99" y="124" text-anchor="middle" fill="#ff8a3d" font-family="Space Grotesk,sans-serif" font-size="12" font-weight="700">N</text>
        <g class="w-needle">
          <polygon points="99,128 105,150 99,146 93,150" fill="#ff8a3d"/>
          <polygon points="99,172 105,150 99,154 93,150" fill="#fff" opacity=".5"/>
        </g>
        <text x="99" y="206" text-anchor="middle" class="w-time" fill="#fff" font-family="Space Grotesk,sans-serif" font-size="18" font-weight="600">10:09</text>
        <text x="99" y="221" text-anchor="middle" fill="#9aa3b2" font-family="Inter,sans-serif" font-size="8" letter-spacing="1">ALT 2,418 M</text>`;
    }
    if (face === "analog") {
      let marks = "";
      for (let i = 0; i < 12; i++) {
        const major = i % 3 === 0;
        marks += `<rect x="${major ? 97.5 : 98.25}" y="92" width="${major ? 3 : 1.5}" height="${major ? 12 : 8}" rx="1" fill="#e9dcc0" transform="rotate(${i * 30} 99 150)"/>`;
      }
      return `
        <rect x="42" y="66" width="114" height="168" rx="34" fill="url(#${id}d)"/>
        ${marks}
        <text x="99" y="124" text-anchor="middle" fill="#e9dcc0" font-family="Space Grotesk,sans-serif" font-size="7" letter-spacing="2">ACTERIS</text>
        <text x="99" y="190" text-anchor="middle" fill="#5ee7ff" font-family="Inter,sans-serif" font-size="8" font-weight="600" class="w-steps">8,412 steps</text>
        <line class="w-h" x1="99" y1="150" x2="99" y2="122" stroke="#f4ecd8" stroke-width="4" stroke-linecap="round"/>
        <line class="w-m" x1="99" y1="150" x2="99" y2="106" stroke="#f4ecd8" stroke-width="2.6" stroke-linecap="round"/>
        <line class="w-s" x1="99" y1="160" x2="99" y2="100" stroke="#ff8a3d" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="99" cy="150" r="3.5" fill="#ff8a3d"/>`;
    }
    // rings (default)
    const ring = (r, color, pct) => {
      const c = 2 * Math.PI * r;
      return `<circle cx="99" cy="166" r="${r}" fill="none" stroke="${color}" stroke-opacity=".18" stroke-width="8"/>
        <circle cx="99" cy="166" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${(c * pct).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 99 166)"/>`;
    };
    return `
      <text x="99" y="104" text-anchor="middle" class="w-time" fill="#fff" font-family="Space Grotesk,sans-serif" font-size="24" font-weight="600">10:09</text>
      ${ring(40, "#ff4d6d", 0.78)}
      ${ring(30, "#b6ff5e", 0.62)}
      ${ring(20, "#5ee7ff", 0.9)}`;
  }

  function watchSVG({ strap = "#1c1f27", caseColor = "#2a2e38", face = "rings", style = "" } = {}) {
    const id = "w" + ++watchUid;
    return `
    <svg class="watch" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Smartwatch"${style ? ` style="${style}"` : ""}>
      <defs>
        <linearGradient id="${id}s" x1="0" x2="1">
          <stop offset="0" stop-color="#000" stop-opacity=".45"/>
          <stop offset=".5" stop-color="#fff" stop-opacity=".08"/>
          <stop offset="1" stop-color="#000" stop-opacity=".45"/>
        </linearGradient>
        <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
          <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".4"/>
        </linearGradient>
        <linearGradient id="${id}g" x1="0" x2="1">
          <stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#8b5cf6"/>
        </linearGradient>
        <radialGradient id="${id}d" cx=".5" cy=".4" r=".7">
          <stop offset="0" stop-color="#1d2a44"/><stop offset="1" stop-color="#070a12"/>
        </radialGradient>
        <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".14"/>
          <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M58 0H142L138 72H62Z" class="w-strap" fill="${strap}"/>
      <path d="M58 0H142L138 72H62Z" fill="url(#${id}s)"/>
      <path d="M62 228H138L142 300H58Z" class="w-strap" fill="${strap}"/>
      <path d="M62 228H138L142 300H58Z" fill="url(#${id}s)"/>
      <circle cx="100" cy="262" r="2.6" fill="#000" opacity=".35"/>
      <circle cx="100" cy="278" r="2.6" fill="#000" opacity=".35"/>
      <rect x="164" y="106" width="14" height="38" rx="5" class="w-case" fill="${caseColor}"/>
      <rect x="164" y="106" width="14" height="38" rx="5" fill="url(#${id}c)"/>
      <rect x="166" y="160" width="8" height="26" rx="3" class="w-case" fill="${caseColor}"/>
      <rect x="28" y="52" width="142" height="196" rx="46" class="w-case" fill="${caseColor}"/>
      <rect x="28" y="52" width="142" height="196" rx="46" fill="url(#${id}c)"/>
      <rect x="35" y="59" width="128" height="182" rx="40" fill="#040507"/>
      <rect x="42" y="66" width="114" height="168" rx="34" fill="#000"/>
      ${faceMarkup(face, id)}
      <rect x="35" y="59" width="128" height="182" rx="40" fill="url(#${id}r)" pointer-events="none"/>
    </svg>`;
  }

  function renderWatches(root = document) {
    $$("[data-watch]", root).forEach((el) => {
      const p = el.dataset.product ? findProduct(el.dataset.product) : null;
      const color = p ? p.colors[Number(el.dataset.color || 0)] : null;
      el.outerHTML = watchSVG({
        strap: el.dataset.strap || (color && color.strap),
        caseColor: el.dataset.case || (color && color.case),
        face: el.dataset.face || (p && p.face) || "rings",
        style: el.getAttribute("style") || "",
      });
    });
    tickClock();
  }

  function tickClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const day = now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    $$(".w-time").forEach((t) => (t.textContent = `${hh}:${mm}`));
    $$(".w-date").forEach((t) => (t.textContent = `${day} ${now.getDate()}`));
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    $$(".w-h").forEach((el) => el.setAttribute("transform", `rotate(${h * 30} 99 150)`));
    $$(".w-m").forEach((el) => el.setAttribute("transform", `rotate(${m * 6} 99 150)`));
    $$(".w-s").forEach((el) => el.setAttribute("transform", `rotate(${s * 6} 99 150)`));
    $$(".w-needle").forEach((el) => el.setAttribute("transform", `rotate(${Math.sin(now / 4000) * 18} 99 150)`));
  }

  /* ---------- Layout: header & footer ---------- */
  const NAV = [
    ["index.html", "Home", "home"],
    ["shop.html", "Shop", "shop"],
    ["technology.html", "Technology", "technology"],
    ["about.html", "About", "about"],
    ["support.html", "Support", "support"],
    ["contact.html", "Contact", "contact"],
  ];

  function renderLayout() {
    const page = document.body.dataset.page;
    const links = NAV.map(
      ([href, label, key]) => `<li><a href="${href}" class="${key === page ? "active" : ""}">${label}</a></li>`
    ).join("");

    document.body.insertAdjacentHTML(
      "afterbegin",
      `<header class="site-header">
        <nav class="container nav" aria-label="Main">
          <a href="index.html" class="logo" aria-label="Smart Acteris home">
            <span class="logo-mark">◐</span> Smart<span class="light">Acteris</span>
          </a>
          <ul class="nav-links">${links}</ul>
          <div class="nav-actions">
            <a href="shop.html" class="btn btn-ghost" style="padding:.6rem 1.2rem">Buy now</a>
            <button class="icon-btn" data-cart-open aria-label="Open cart">${ICONS.bag}<span class="cart-count">0</span></button>
            <button class="icon-btn menu-toggle" aria-label="Toggle menu">${ICONS.menu}</button>
          </div>
        </nav>
      </header>`
    );

    document.body.insertAdjacentHTML(
      "beforeend",
      `<footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <a href="index.html" class="logo"><span class="logo-mark">◐</span> Smart<span class="light">Acteris</span></a>
              <p>Precision-engineered smartwatches that understand your body, respect your time and keep you moving forward.</p>
              <div class="socials">
                <a class="icon-btn" href="#" aria-label="X">${ICONS.x}</a>
                <a class="icon-btn" href="#" aria-label="Instagram">${ICONS.ig}</a>
                <a class="icon-btn" href="#" aria-label="YouTube">${ICONS.yt}</a>
                <a class="icon-btn" href="#" aria-label="LinkedIn">${ICONS.in}</a>
              </div>
            </div>
            <div>
              <h4>Shop</h4>
              <ul>
                <li><a href="product.html?id=nova">Acteris Nova</a></li>
                <li><a href="product.html?id=pulse">Acteris Pulse</a></li>
                <li><a href="product.html?id=titan">Acteris Titan</a></li>
                <li><a href="shop.html">All watches</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="about.html">Our story</a></li>
                <li><a href="technology.html">Technology</a></li>
                <li><a href="about.html#careers">Careers</a></li>
                <li><a href="contact.html">Press</a></li>
              </ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul>
                <li><a href="support.html">FAQ</a></li>
                <li><a href="support.html#shipping">Shipping & returns</a></li>
                <li><a href="support.html#warranty">Warranty</a></li>
                <li><a href="contact.html">Contact us</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} Smart Acteris Inc. All rights reserved.</span>
            <span>Privacy · Terms · Cookies</span>
          </div>
        </div>
      </footer>
      <div class="drawer-backdrop" data-cart-close></div>
      <aside class="drawer" aria-label="Shopping cart">
        <div class="drawer-head"><h3>Your bag</h3><button class="icon-btn" data-cart-close aria-label="Close cart">${ICONS.close}</button></div>
        <div class="drawer-body"></div>
        <div class="drawer-foot">
          <div class="drawer-total"><span>Subtotal</span><span class="cart-subtotal">$0</span></div>
          <small style="color:var(--dim)">Free express shipping & 30-day returns.</small>
          <button class="btn btn-primary btn-block" data-checkout>Checkout</button>
        </div>
      </aside>
      <div class="toast" role="status" aria-live="polite"></div>`
    );

    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    $(".menu-toggle").addEventListener("click", () => document.body.classList.toggle("nav-open"));
    $$(".nav-links a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $(".toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- Cart ---------- */
  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  };
  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  };

  function addToCart(id, colorIdx = 0, size, qty = 1) {
    const p = findProduct(id);
    if (!p) return;
    size = size || p.sizes[0];
    const cart = getCart();
    const existing = cart.find((i) => i.id === id && i.color === colorIdx && i.size === size);
    if (existing) existing.qty += qty;
    else cart.push({ id, color: colorIdx, size, qty });
    saveCart(cart);
    toast(`${p.name} added to your bag`);
  }

  function renderCart() {
    const cart = getCart();
    const count = cart.reduce((n, i) => n + i.qty, 0);
    const badge = $(".cart-count");
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);

    const body = $(".drawer-body");
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><p>Your bag is empty.</p><a href="shop.html" class="btn btn-ghost">Explore watches</a></div>`;
    } else {
      body.innerHTML = cart
        .map((item, idx) => {
          const p = findProduct(item.id);
          if (!p) return "";
          const c = p.colors[item.color] || p.colors[0];
          return `<div class="cart-item">
            <div class="cart-thumb"><span data-watch data-product="${p.id}" data-color="${item.color}"></span></div>
            <div>
              <b>${p.name}</b>
              <small>${c.name} · ${item.size} · Qty ${item.qty}</small><br/>
              <button class="remove" data-remove="${idx}">Remove</button>
            </div>
            <strong>${money(p.price * item.qty)}</strong>
          </div>`;
        })
        .join("");
      renderWatches(body);
    }
    const subtotal = cart.reduce((sum, i) => sum + (findProduct(i.id)?.price || 0) * i.qty, 0);
    $(".cart-subtotal").textContent = money(subtotal);
  }

  function initCart() {
    renderCart();
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-cart-open]")) document.body.classList.add("cart-open");
      if (e.target.closest("[data-cart-close]")) document.body.classList.remove("cart-open");
      const rm = e.target.closest("[data-remove]");
      if (rm) {
        const cart = getCart();
        cart.splice(Number(rm.dataset.remove), 1);
        saveCart(cart);
      }
      const add = e.target.closest("[data-add]");
      if (add) {
        e.preventDefault();
        addToCart(add.dataset.add);
      }
      if (e.target.closest("[data-checkout]")) {
        if (!getCart().length) return toast("Your bag is empty");
        saveCart([]);
        document.body.classList.remove("cart-open");
        toast("Order placed. Thank you! (demo)");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") document.body.classList.remove("cart-open", "nav-open");
    });
  }

  /* ---------- Product cards ---------- */
  function productCard(p) {
    return `<article class="product-card reveal">
      <a href="product.html?id=${p.id}" class="product-media" aria-label="${p.name}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <span data-watch data-product="${p.id}"></span>
      </a>
      <div class="product-body">
        <span class="cat">${p.category}</span>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p>${p.tagline}</p>
        <div class="product-foot">
          <div class="price">${money(p.price)}${p.oldPrice ? `<small>${money(p.oldPrice)}</small>` : ""}</div>
          <div class="swatches">${p.colors.map((c) => `<span class="swatch" style="background:${c.strap}" title="${c.name}"></span>`).join("")}</div>
        </div>
        <button class="btn btn-ghost btn-block" style="margin-top:1rem" data-add="${p.id}">Add to bag</button>
      </div>
    </article>`;
  }

  function initProductGrids() {
    $$("[data-products]").forEach((grid) => {
      const ids = grid.dataset.products.split(",").map((s) => s.trim());
      grid.innerHTML = ids.map(findProduct).filter(Boolean).map(productCard).join("");
    });
  }

  function initShop() {
    const grid = $("#shop-grid");
    if (!grid) return;
    let category = new URLSearchParams(location.search).get("category") || "All";
    let sort = "featured";
    const sortSelect = $("#sort");
    const countEl = $("#result-count");

    function draw() {
      let list = PRODUCTS.filter((p) => category === "All" || p.category === category);
      if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
      if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
      grid.innerHTML = list.map(productCard).join("");
      countEl.textContent = `${list.length} watch${list.length === 1 ? "" : "es"}`;
      $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === category));
      renderWatches(grid);
      observeReveal(grid);
    }

    $$(".chip").forEach((chip) =>
      chip.addEventListener("click", () => {
        category = chip.dataset.cat;
        draw();
      })
    );
    sortSelect.addEventListener("change", () => {
      sort = sortSelect.value;
      draw();
    });
    draw();
  }

  /* ---------- Product detail ---------- */
  function initProductPage() {
    const root = $("#product-root");
    if (!root) return;
    const p = findProduct(new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
    document.title = `${p.name} | Smart Acteris`;
    let colorIdx = 0;
    let size = p.sizes[0];
    let qty = 1;

    root.innerHTML = `
      <div class="breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / ${p.name}</div>
      <div class="pd-grid">
        <div class="pd-stage"><span data-watch data-product="${p.id}"></span></div>
        <div class="pd-info">
          <span class="eyebrow">${p.category}</span>
          <h1>${p.name}</h1>
          <div class="rating"><span class="stars">★★★★★</span> ${p.rating} · ${p.reviews.toLocaleString()} reviews</div>
          <div class="pd-price">${money(p.price)}${p.oldPrice ? ` <small style="font-size:1rem;color:var(--dim);text-decoration:line-through;font-weight:400">${money(p.oldPrice)}</small>` : ""}</div>
          <p class="lead">${p.description}</p>
          <div class="option-group">
            <div class="option-label">Colour <b id="color-name">${p.colors[0].name}</b></div>
            <div class="color-options">
              ${p.colors.map((c, i) => `<button class="color-opt ${i === 0 ? "active" : ""}" data-ci="${i}" style="background:${c.strap}" aria-label="${c.name}"></button>`).join("")}
            </div>
          </div>
          <div class="option-group">
            <div class="option-label">Case size <b id="size-name">${size}</b></div>
            <div class="size-options">
              ${p.sizes.map((s, i) => `<button class="size-opt ${i === 0 ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}
            </div>
          </div>
          <div class="buy-row">
            <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span id="qty">1</span><button data-q="1" aria-label="Increase">+</button></div>
            <button class="btn btn-primary" id="pd-add">Add to bag · ${money(p.price)}</button>
          </div>
          <div class="perks">
            <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>Free express delivery in 2–3 days</div>
            <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a8 8 0 1014-5.3M18 3v4h-4"/></svg>30-day no-questions returns</div>
            <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>2-year Acteris Care warranty</div>
          </div>
        </div>
      </div>`;

    $("#pd-highlights").innerHTML = p.highlights
      .map((h) => `<div class="card reveal"><h3 style="font-size:1.1rem;margin:0">${h}</h3></div>`)
      .join("");
    $("#pd-specs").innerHTML = Object.entries(p.specs)
      .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
      .join("");
    const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3);
    $("#pd-related").innerHTML = related.map(productCard).join("");

    const updateAddLabel = () => ($("#pd-add").textContent = `Add to bag · ${money(p.price * qty)}`);

    root.addEventListener("click", (e) => {
      const c = e.target.closest("[data-ci]");
      if (c) {
        colorIdx = Number(c.dataset.ci);
        $$(".color-opt", root).forEach((b) => b.classList.toggle("active", b === c));
        $("#color-name").textContent = p.colors[colorIdx].name;
        $$(".pd-stage .w-strap").forEach((s) => s.setAttribute("fill", p.colors[colorIdx].strap));
        $$(".pd-stage .w-case").forEach((s) => s.setAttribute("fill", p.colors[colorIdx].case));
      }
      const s = e.target.closest("[data-size]");
      if (s) {
        size = s.dataset.size;
        $$(".size-opt", root).forEach((b) => b.classList.toggle("active", b === s));
        $("#size-name").textContent = size;
      }
      const q = e.target.closest("[data-q]");
      if (q) {
        qty = Math.min(9, Math.max(1, qty + Number(q.dataset.q)));
        $("#qty").textContent = qty;
        updateAddLabel();
      }
      if (e.target.closest("#pd-add")) addToCart(p.id, colorIdx, size, qty);
    });
  }

  /* ---------- UI helpers ---------- */
  let revealObserver;
  function observeReveal(root = document) {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal", root).forEach((el) => el.classList.add("in"));
      return;
    }
    revealObserver =
      revealObserver ||
      new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              revealObserver.unobserve(en.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    $$(".reveal:not(.in)", root).forEach((el) => revealObserver.observe(el));
  }

  function initAccordion() {
    $$(".acc-head").forEach((head) =>
      head.addEventListener("click", () => {
        const item = head.closest(".acc-item");
        const open = item.classList.toggle("open");
        head.setAttribute("aria-expanded", open);
      })
    );
  }

  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - start) / 1400);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      })
    );
    els.forEach((el) => io.observe(el));
  }

  function initForms() {
    $$("form[data-newsletter]").forEach((form) =>
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("input", form);
        if (!/^\S+@\S+\.\S+$/.test(input.value)) return toast("Please enter a valid email");
        form.reset();
        toast("You're on the list. Welcome to Acteris!");
      })
    );

    $$("form[data-validate]").forEach((form) =>
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let ok = true;
        $$(".field", form).forEach((field) => {
          const input = $("input, textarea, select", field);
          if (!input || !input.required) return;
          const val = input.value.trim();
          const valid = input.type === "email" ? /^\S+@\S+\.\S+$/.test(val) : val.length > 0;
          field.classList.toggle("invalid", !valid);
          if (!valid) ok = false;
        });
        const success = $(".form-success", form);
        if (ok) {
          form.reset();
          success.classList.add("show");
          setTimeout(() => success.classList.remove("show"), 6000);
        }
      })
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderLayout();
    initCart();
    initProductGrids();
    initShop();
    initProductPage();
    renderWatches();
    initAccordion();
    initCounters();
    initForms();
    observeReveal();
    setInterval(tickClock, 1000);
  });
})();
