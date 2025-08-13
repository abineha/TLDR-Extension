# TLDR - Chrome Extension

A Chrome extension that summarizes highlighted text and displays key points in bullet format.

## Features

- **Smart Text Summarization**: Automatically extracts key points from selected text
- **Bullet Point Display**: Clean, organized summary in easy-to-read bullet points
- **Copy to Clipboard**: One-click copying of summaries
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Fast Processing**: Instant summarization using advanced algorithms

## Installation

1. Download or clone this repository
2. Create placeholder icons:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels) 
   - `icon128.png` (128x128 pixels)
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extension folder
6. The TLDR Chan extension will appear in your toolbar

## How to Use

1. **Select Text**: Highlight any text on any webpage
2. **Open Extension**: Click the TLDR Chan icon in your browser toolbar
3. **View Summary**: The extension will automatically summarize the selected text into bullet points
4. **Copy Summary**: Click the "Copy Summary" button to copy the summary to your clipboard
5. **New Text**: Click "New Text" to clear and select different text

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `activeTab`, `storage`
- **Content Script**: Detects text selection across all websites
- **Summarization**: Custom algorithm using extractive summarization techniques
- **Storage**: Uses Chrome's local storage for selected text persistence

## Files Structure

```
tldr-chan/
├── manifest.json       # Extension configuration
├── content.js          # Content script for text selection
├── popup.html          # Extension popup interface
├── popup.css           # Styling for the popup
├── popup.js            # Popup logic and summarization
├── icon16.png          # 16x16 icon (create this)
├── icon48.png          # 48x48 icon (create this)
├── icon128.png         # 128x128 icon (create this)
└── README.md           # This file
```

## Summarization Algorithm

The extension uses a sophisticated extractive summarization approach:

1. **Text Preprocessing**: Cleans and normalizes the input text
2. **Sentence Scoring**: Evaluates sentences based on:
   - Position in text (first/last sentences often important)
   - Word frequency and importance
   - Presence of capitalized words and numbers
   - Sentence length optimization
3. **Selection**: Chooses top-scoring sentences (up to 5 key points)
4. **Ordering**: Maintains original text order for coherence

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Privacy

- No data is sent to external servers
- All processing happens locally in your browser
- Selected text is only stored temporarily in local browser storage
- No tracking or analytics
