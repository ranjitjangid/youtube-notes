let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    if (lastUrl.includes("youtube.com/watch")) {
      chrome.runtime.sendMessage({ action: "openPanel" }).catch(() => {});
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });
