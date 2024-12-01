// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('TwCipher extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getKeys') {
    chrome.storage.local.get(['publicKey', 'privateKey'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});
