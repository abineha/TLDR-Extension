// Content script to detect text selection
let selectedText = '';

// Function to get selected text
function getSelectedText() {
  const selection = window.getSelection();
  return selection.toString().trim();
}

// Listen for text selection
document.addEventListener('mouseup', function() {
  const text = getSelectedText();
  if (text.length > 0) {
    selectedText = text;
    // Store selected text in Chrome storage for popup access
    chrome.storage.local.set({ selectedText: text }, function() {
      console.log('Selected text stored:', text);
    });
  }
});

// Listen for keyboard shortcuts (Ctrl+C, etc.)
document.addEventListener('keyup', function(event) {
  if (event.ctrlKey || event.metaKey) {
    const text = getSelectedText();
    if (text.length > 0) {
      selectedText = text;
      chrome.storage.local.set({ selectedText: text });
    }
  }
});

// Function to handle messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getSelectedText') {
    const currentSelection = getSelectedText();
    if (currentSelection.length > 0) {
      sendResponse({ text: currentSelection });
    } else {
      // Return last stored selection if no current selection
      chrome.storage.local.get(['selectedText'], function(result) {
        sendResponse({ text: result.selectedText || '' });
      });
    }
    return true; // Indicates we will send a response asynchronously
  }
}); 