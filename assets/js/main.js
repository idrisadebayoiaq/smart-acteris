(() => {
  const GEAR_PATH = (() => {
    const teeth = 12, outer = 49, inner = 40, pts = [];
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2, s = (Math.PI * 2) / teeth;
      [[inner, 0], [outer, 0.18], [outer, 0.48], [inner, 0.66]].forEach(([r, f]) => {
        const t = a + s * f;
        pts.push(`${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`);
      });
    }
    return `M${pts.join("L")}Z`;
  })();

  const gearSVG = (hole = 16) =>
    `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="${GEAR_PATH} M${50 - hole} 50a${hole} ${hole} 0 1 0 ${hole * 2} 0a${hole} ${hole} 0 1 0 -${hole * 2} 0z"/></svg>`;

  const arrow =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

  const page = document.body.dataset.page;
  const links = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["services.html", "Services", "services"],
    ["projects.html", "Projects", "projects"],
    ["contact.html", "Contact", "contact"],
  ];

  const header = document.getElementById("site-header");
  if (header) {
    header.outerHTML = `
      <div class="topbar">
        <div class="container">
          <span><b>●</b> ISO 9001:2015 CERTIFIED ENGINEERING</span>
          <span class="hide-sm">MON–SAT 07:00–19:00 &nbsp;|&nbsp; +1 (800) 762-7839</span>
        </div>
      </div>
      <header class="header">
        <div class="container">
          <a href="index.html" class="logo" aria-label="SNARTEX home">
            <span class="logo-mark">${gearSVG(18)}</span>
            <span class="logo-text">SNAR<span>TEX</span></span>
          </a>
          <nav class="nav" aria-label="Main">
            ${links
              .map(([href, label, key]) => `<a href="${href}" class="${key === page ? "active" : ""}">${label}</a>`)
              .join("")}
            <a href="contact.html" class="btn btn-primary">Get a Quote</a>
          </nav>
          <button class="menu-toggle" aria-label="Toggle menu"><span></span></button>
        </div>
      </header>`;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.outerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="about">
              <a href="index.html" class="logo">
                <span class="logo-mark">${gearSVG(18)}</span>
                <span class="logo-text">SNAR<span>TEX</span></span>
              </a>
              <p>Precision mechanical engineering, fabrication and maintenance for the industries that keep the world moving.</p>
              <div class="socials">
                <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>
                <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.3-7-6.1 7H1.4l7.9-9L1 2h7l4.8 6.4zm-1.2 18h1.9L7.1 3.9H5.1z"/></svg></a>
                <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/></svg></a>
              </div>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="about.html#team">Leadership</a></li>
                <li><a href="contact.html">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5>Services</h5>
              <ul>
                <li><a href="services.html#design">Mechanical Design</a></li>
                <li><a href="services.html#cnc">CNC Machining</a></li>
                <li><a href="services.html#fabrication">Fabrication</a></li>
                <li><a href="services.html#maintenance">Maintenance</a></li>
              </ul>
            </div>
            <div>
              <h5>Headquarters</h5>
              <ul>
                <li>1200 Forge Avenue, Unit 7<br>Detroit, MI 48201</li>
                <li><a href="mailto:hello@snartex.com">hello@snartex.com</a></li>
                <li><a href="tel:+18007627839">+1 (800) 762-7839</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${new Date().getFullYear()} SNARTEX ENGINEERING. ALL RIGHTS RESERVED.</span>
          <span>ENGINEERED WITH PRECISION ⚙</span>
        </div>
      </footer>`;
  }

  document.querySelectorAll("[data-gear]").forEach((el) => {
    el.innerHTML = gearSVG(Number(el.dataset.gear) || 16);
  });
  document.querySelectorAll("[data-arrow]").forEach((el) => el.insertAdjacentHTML("beforeend", arrow));

  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => document.body.classList.toggle("menu-open"));

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const counterIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 1600, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }),
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

  const filters = document.querySelectorAll(".filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      document.querySelectorAll(".project").forEach((p) => {
        p.classList.toggle("hide", cat !== "all" && p.dataset.cat !== cat);
      });
    })
  );

  const form = document.querySelector("#quote-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = form.querySelector(".form-note");
    note.textContent = "› Transmitting request...";
    setTimeout(() => {
      note.textContent = "✓ Request received. An engineer will contact you within 24 hours.";
      form.reset();
    }, 900);
  });
})();
