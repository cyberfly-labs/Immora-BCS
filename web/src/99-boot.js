/* Start-up. */
(async function boot() {
  let th = "light"; try { th = localStorage.getItem("immora-bcs-theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) { /* ignore */ }
  document.documentElement.dataset.theme = th;
  let l = "en"; try { l = localStorage.getItem("immora-bcs-lang") || "en"; } catch (e) { /* ignore */ }
  setLang(l);
  if (BUILD_MODE === "server") { try { window.__INFO = await (await fetch("api/info")).json(); } catch (e) { window.__INFO = {}; } }
  ME = await Backend.me();
  if (ME) { if (ME.lang) setLang(ME.lang); await start(); } else renderLogin();
  window.__ready = true;
})();
