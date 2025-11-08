const editor = document.getElementById('editor');
const saveBtn = document.getElementById('save');
const downloadBtn = document.getElementById('download');
const clearBtn = document.getElementById('clear');

let videoId = null;

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const url = new URL(tabs[0].url);
  videoId = url.searchParams.get('v');
  loadCode(videoId);
});

let typingTimer;
editor.addEventListener('input', () => {
  chrome.runtime.sendMessage({ action: 'pauseVideo' });
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => chrome.runtime.sendMessage({ action: 'resumeVideo' }), 1000);
});

saveBtn.addEventListener('click', () => saveCode(videoId, editor.value));
clearBtn.addEventListener('click', () => { editor.value = ''; saveCode(videoId, ''); });
downloadBtn.addEventListener('click', () => downloadFile(editor.value, `youtube_notes_${videoId || 'untitled'}.txt`));

function loadCode(id) {
  if (!id) return;
  chrome.storage.local.get(id, data => { editor.value = data[id] || ''; });
}

function saveCode(id, text) {
  if (!id) return;
  chrome.storage.local.set({ [id]: text });
}

function downloadFile(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
