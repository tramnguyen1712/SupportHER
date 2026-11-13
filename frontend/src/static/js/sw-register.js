if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered");
    } catch (e) {
      console.log("Service Worker registration failed", e);
    }
  });
}