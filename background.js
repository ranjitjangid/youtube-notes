chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.includes("youtube.com/watch")) {
      chrome.sidePanel.open({ tabId }).catch(() => {});
    }
  });
  
  chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === "pauseVideo" || msg.action === "resumeVideo") {
      // Find the active YouTube tab
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0]) return;
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId },
          func: (action) => {
            const video = document.querySelector("video");
            if (!video) return;
            if (action === "pauseVideo") video.pause();
            if (action === "resumeVideo") video.play();
          },
          args: [msg.action]
        });
      });
    }
  });
  