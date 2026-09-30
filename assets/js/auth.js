(() => {
  const SUPABASE_URL = "https://hibazcjvbgouksxtancz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ZfRf3HNXgSHbjEkSknJ9fw_F1WCWH09";

  if (!window.supabase) {
    console.error("Supabase client failed to load.");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.snartexAuth = sb;

  const page = document.body.dataset.page;
  const $ = (sel, root = document) => root.querySelector(sel);

  const setNote = (el, msg, type = "") => {
    if (!el) return;
    el.textContent = msg;
    el.dataset.type = type;
  };

  const signOut = async () => {
    await sb.auth.signOut();
    window.location.href = "index.html";
  };

  const renderNav = (session) => {
    const slot = $("[data-auth-slot]");
    if (!slot) return;
    if (session) {
      slot.innerHTML = `
        <a href="account.html" class="${page === "account" ? "active" : ""}">Account</a>
        <button type="button" class="nav-signout">Sign Out</button>`;
      $(".nav-signout", slot).addEventListener("click", signOut);
    } else {
      slot.innerHTML = `<a href="login.html" class="${page === "login" ? "active" : ""}">Login</a>`;
    }
  };

  const initLogin = (session) => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "account.html";
    if (session) {
      window.location.replace(next);
      return;
    }

    const tabs = document.querySelectorAll("[data-auth-tab]");
    const panels = document.querySelectorAll("[data-auth-panel]");
    const show = (name) => {
      tabs.forEach((t) => t.classList.toggle("active", t.dataset.authTab === name));
      panels.forEach((p) => (p.hidden = p.dataset.authPanel !== name));
    };
    tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.authTab)));
    if (params.get("mode") === "signup") show("signup");

    const loginForm = $("#login-form");
    loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const note = $(".form-note", loginForm);
      const btn = $("button[type=submit]", loginForm);
      btn.disabled = true;
      setNote(note, "› Authenticating...");
      const { error } = await sb.auth.signInWithPassword({
        email: loginForm.email.value.trim(),
        password: loginForm.password.value,
      });
      btn.disabled = false;
      if (error) return setNote(note, `✕ ${error.message}`, "error");
      setNote(note, "✓ Signed in. Redirecting...", "success");
      window.location.href = next;
    });

    const signupForm = $("#signup-form");
    signupForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const note = $(".form-note", signupForm);
      const btn = $("button[type=submit]", signupForm);
      if (signupForm.password.value !== signupForm.confirm.value) {
        return setNote(note, "✕ Passwords do not match.", "error");
      }
      btn.disabled = true;
      setNote(note, "› Creating account...");
      const { data, error } = await sb.auth.signUp({
        email: signupForm.email.value.trim(),
        password: signupForm.password.value,
        options: {
          data: {
            full_name: signupForm.full_name.value.trim(),
            company: signupForm.company.value.trim(),
          },
          emailRedirectTo: new URL("account.html", window.location.href).href,
        },
      });
      btn.disabled = false;
      if (error) return setNote(note, `✕ ${error.message}`, "error");
      if (data.session) {
        setNote(note, "✓ Account created. Redirecting...", "success");
        window.location.href = next;
      } else {
        signupForm.reset();
        setNote(note, "✓ Check your inbox to confirm your email, then sign in.", "success");
      }
    });
  };

  const initAccount = async (session) => {
    if (!session) {
      window.location.replace("login.html?next=account.html");
      return;
    }
    const user = session.user;
    const { data: profile } = await sb
      .from("profiles")
      .select("full_name, company, created_at")
      .eq("id", user.id)
      .maybeSingle();

    const name = profile?.full_name || user.email.split("@")[0];
    $("[data-user-name]").textContent = name;
    $("[data-user-email]").textContent = user.email;
    $("[data-user-since]").textContent = new Date(profile?.created_at || user.created_at).toLocaleDateString(
      undefined,
      { year: "numeric", month: "short", day: "numeric" }
    );
    $("[data-user-id]").textContent = user.id.slice(0, 8).toUpperCase();
    $("[data-user-initials]").textContent = name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const form = $("#profile-form");
    form.full_name.value = profile?.full_name || "";
    form.company.value = profile?.company || "";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const note = $(".form-note", form);
      setNote(note, "› Saving...");
      const full_name = form.full_name.value.trim();
      const { error } = await sb
        .from("profiles")
        .update({ full_name, company: form.company.value.trim() })
        .eq("id", user.id);
      if (error) return setNote(note, `✕ ${error.message}`, "error");
      $("[data-user-name]").textContent = full_name || user.email.split("@")[0];
      setNote(note, "✓ Profile updated.", "success");
    });

    $("[data-signout]")?.addEventListener("click", signOut);
    $("[data-account]").hidden = false;
  };

  sb.auth.getSession().then(({ data: { session } }) => {
    renderNav(session);
    if (page === "login") initLogin(session);
    if (page === "account") initAccount(session);
  });

  sb.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") renderNav(session);
    if (event === "SIGNED_OUT" && page === "account") window.location.replace("login.html");
  });
})();
