(function () {
  "use strict";

  const SUPABASE_URL = "https://bvjobwsdxbcwbasyfcmt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_mUgyYadWyXA-fRq1BAy4PA_SM9NWQMt";

  if (!window.supabase) {
    console.error("Supabase client failed to load.");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  window.acterisAuth = sb;

  const $ = (sel, root = document) => root.querySelector(sel);
  const pageUrl = (path) => new URL(path, window.location.href).href;
  const params = new URLSearchParams(window.location.search);

  const initials = (name, email) => {
    const src = (name || email || "?").trim();
    const parts = src.split(/[\s@._-]+/).filter(Boolean);
    return ((parts[0] || "?")[0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  const friendlyError = (err) => {
    const msg = (err && err.message) || "Something went wrong. Please try again.";
    if (/invalid login credentials/i.test(msg)) return "Incorrect email or password.";
    if (/email not confirmed/i.test(msg)) return "Please confirm your email first. Check your inbox for the link.";
    if (/already registered|already been registered/i.test(msg)) return "An account with this email already exists. Try signing in.";
    if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a minute and try again.";
    return msg;
  };

  function updateHeader(session) {
    const btn = $("[data-account]");
    if (!btn) return;
    if (session) {
      const u = session.user;
      btn.href = "account.html";
      btn.setAttribute("aria-label", "My account");
      btn.classList.add("signed-in");
      btn.textContent = initials(u.user_metadata && u.user_metadata.full_name, u.email);
    } else {
      btn.href = "auth.html";
      btn.setAttribute("aria-label", "Sign in");
      btn.classList.remove("signed-in");
    }
  }

  /* ---------- Auth page (sign in / sign up / forgot / reset) ---------- */
  function initAuthPage(session) {
    const root = $("#auth-root");
    if (!root) return;

    const next = params.get("next") || "account.html";
    let mode = params.get("mode") || "signin";

    if (session && mode !== "reset") {
      window.location.replace(next);
      return;
    }

    const alertBox = $("#auth-alert");
    const setAlert = (type, text) => {
      alertBox.className = "auth-alert " + (type ? "show " + type : "");
      alertBox.textContent = text || "";
    };

    function show(newMode) {
      mode = newMode;
      root.querySelectorAll("[data-mode]").forEach((el) => {
        el.hidden = !el.dataset.mode.split(" ").includes(mode);
      });
      root.querySelectorAll(".auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === mode));
      setAlert();
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      history.replaceState(null, "", url);
    }

    root.addEventListener("click", (e) => {
      const link = e.target.closest("[data-goto]");
      if (link) {
        e.preventDefault();
        show(link.dataset.goto);
      }
      const toggle = e.target.closest("[data-toggle-pw]");
      if (toggle) {
        const input = toggle.parentElement.querySelector("input");
        input.type = input.type === "password" ? "text" : "password";
        toggle.textContent = input.type === "password" ? "Show" : "Hide";
      }
    });

    const busy = (form, on, label) => {
      const btn = form.querySelector("button[type=submit]");
      if (on) {
        btn.dataset.label = btn.textContent;
        btn.textContent = label;
      } else if (btn.dataset.label) {
        btn.textContent = btn.dataset.label;
      }
      btn.disabled = on;
    };

    $("#form-signin").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      setAlert();
      busy(f, true, "Signing in…");
      const { error } = await sb.auth.signInWithPassword({
        email: f.email.value.trim(),
        password: f.password.value,
      });
      busy(f, false);
      if (error) return setAlert("error", friendlyError(error));
      window.location.href = next;
    });

    $("#form-signup").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      setAlert();
      if (f.password.value.length < 8) return setAlert("error", "Password must be at least 8 characters.");
      if (f.password.value !== f.confirm.value) return setAlert("error", "Passwords don't match.");
      busy(f, true, "Creating account…");
      const { data, error } = await sb.auth.signUp({
        email: f.email.value.trim(),
        password: f.password.value,
        options: {
          data: { full_name: f.full_name.value.trim() },
          emailRedirectTo: pageUrl("account.html"),
        },
      });
      busy(f, false);
      if (error) return setAlert("error", friendlyError(error));
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return setAlert("error", "An account with this email already exists. Try signing in.");
      }
      if (data.session) {
        window.location.href = next;
        return;
      }
      f.reset();
      setAlert("success", "Account created! Check your inbox and click the confirmation link to activate it.");
    });

    $("#form-forgot").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      setAlert();
      busy(f, true, "Sending…");
      const { error } = await sb.auth.resetPasswordForEmail(f.email.value.trim(), {
        redirectTo: pageUrl("auth.html?mode=reset"),
      });
      busy(f, false);
      if (error) return setAlert("error", friendlyError(error));
      setAlert("success", "If an account exists for that email, a reset link is on its way.");
    });

    $("#form-reset").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      setAlert();
      const { data } = await sb.auth.getSession();
      if (!data.session) return setAlert("error", "This reset link is invalid or has expired. Request a new one.");
      if (f.password.value.length < 8) return setAlert("error", "Password must be at least 8 characters.");
      if (f.password.value !== f.confirm.value) return setAlert("error", "Passwords don't match.");
      busy(f, true, "Updating…");
      const { error } = await sb.auth.updateUser({ password: f.password.value });
      busy(f, false);
      if (error) return setAlert("error", friendlyError(error));
      setAlert("success", "Password updated. Redirecting to your account…");
      setTimeout(() => (window.location.href = "account.html"), 1500);
    });

    sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") show("reset");
    });

    show(["signin", "signup", "forgot", "reset"].includes(mode) ? mode : "signin");
  }

  /* ---------- Account page (protected) ---------- */
  async function initAccountPage(session) {
    const root = $("#account-root");
    if (!root) return;

    if (!session) {
      window.location.replace("auth.html?mode=signin&next=account.html");
      return;
    }

    const user = session.user;
    const { data: profile, error } = await sb.from("profiles").select("full_name, created_at").eq("id", user.id).maybeSingle();
    if (error) console.error(error);

    const name = (profile && profile.full_name) || (user.user_metadata && user.user_metadata.full_name) || "";
    $("#acc-avatar").textContent = initials(name, user.email);
    $("#acc-name").textContent = name || "Acteris member";
    $("#acc-email").textContent = user.email;
    $("#acc-since").textContent = new Date((profile && profile.created_at) || user.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    $("#acc-verified").textContent = user.email_confirmed_at ? "Verified" : "Pending verification";

    const form = $("#form-profile");
    form.full_name.value = name;
    const msg = $("#profile-msg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const full_name = form.full_name.value.trim();
      msg.className = "auth-alert";
      const [{ error: pErr }, { error: uErr }] = await Promise.all([
        sb.from("profiles").update({ full_name }).eq("id", user.id),
        sb.auth.updateUser({ data: { full_name } }),
      ]);
      if (pErr || uErr) {
        msg.className = "auth-alert show error";
        msg.textContent = friendlyError(pErr || uErr);
        return;
      }
      $("#acc-name").textContent = full_name || "Acteris member";
      $("#acc-avatar").textContent = initials(full_name, user.email);
      msg.className = "auth-alert show success";
      msg.textContent = "Profile saved.";
    });

    $("#form-password").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      const out = $("#password-msg");
      if (f.password.value.length < 8) {
        out.className = "auth-alert show error";
        out.textContent = "Password must be at least 8 characters.";
        return;
      }
      const { error: err } = await sb.auth.updateUser({ password: f.password.value });
      out.className = "auth-alert show " + (err ? "error" : "success");
      out.textContent = err ? friendlyError(err) : "Password changed.";
      if (!err) f.reset();
    });

    $("#sign-out").addEventListener("click", async () => {
      await sb.auth.signOut();
      window.location.href = "index.html";
    });

    root.hidden = false;
    $("#account-loading").hidden = true;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await sb.auth.getSession();
    updateHeader(data.session);
    initAuthPage(data.session);
    initAccountPage(data.session);

    sb.auth.onAuthStateChange((event, session) => {
      updateHeader(session);
      if (event === "SIGNED_OUT" && $("#account-root")) window.location.href = "auth.html";
    });
  });
})();
