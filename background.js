// background.js

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

// 👇 NEW FUNCTION — opens persistent floating window
function openDictionaryWindow() {
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 375,
    height: 550  });
}

// When shortcut (Alt+K) is pressed
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "lookup-selection") {
    const tab = await getActiveTab();
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      { type: "GET_SELECTION" },
      async (response) => {
        const selectedText = (response && response.text) || "";

        await chrome.storage.local.set({
          lastSelection: selectedText,
          autoLookup: true
        });

        // 👇 Instead of default popup, open floating window
        openDictionaryWindow();
      }
    );
  }
});

// When clicking the extension icon
chrome.action.onClicked.addListener(() => {
  openDictionaryWindow();
});
