# TLDR Chrome Extension - AI-Powered Text Summarizer

A Chrome extension that provides **two summarization modes**: an offline NLP algorithm (default) and optional AI-powered summaries using Hugging Face's BART model.

<p align="center">
  <img src="tldr chan\icon128.png" alt="TLDR Logo" width="128" height="128">
</p>


## DEMO

<p align="center">
  <img src="tldr chan\output screenshots\output1.png" alt="TLDR Extension Interface" width="350">
  <br>
  <em>Main popup of chrome extension to summarize highlighted paragraph</em>
</p>

<p align="center">
  <img src="tldr chan\output screenshots\output6.png" alt="Settings Page" width="350">
  <br>
  <em>Settings page where API connection is established</em>
</p>

##  Features

- Offline NLP Mode (Default) : Works completely offline using intelligent rule-based summarization
- BART AI Mode : Optional Hugging Face API integration for high-quality AI summaries
- Simple Settings : Just two modes - no complex configuration needed
- User API Keys : Each user provides their own free Hugging Face API key (optional)
- Copy to Clipboard : One-click copying of summaries
- Modern UI : Clean, responsive design with smooth animations
- Auto-Save : Remembers selected text between sessions

---

##  Quick Start

### 1. Install the Extension

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder

### 2. Start Summarizing (Offline Mode)

1. Highlight any text on any webpage
2. Click the TLDR Chan extension icon
3. Get instant offline summaries! (No setup required)

### 3. Optional: Enable AI Mode

1. Click the settings gear icon (⚙️) in the extension
2. Select "BART CNN (Hugging Face API)" mode
3. Get your free API key from [Hugging Face](https://huggingface.co/settings/tokens)
4. Enter your API key and save
5. Test the connection with the "Test API" button

## Two Modes Explained

### Mode 1: Offline NLP (Default) 
- **Works offline** - no internet connection required
- **Instant results** - no waiting for API calls
- **Smart algorithm** - extracts key sentences with keyword highlighting
- **Always available** - perfect for privacy-conscious users

### Mode 2: BART AI (Optional) 
- **High-quality summaries** - uses Facebook's BART Large CNN model
- **Requires API key** - free Hugging Face account needed
- **Better understanding** - AI comprehends context and meaning
- **Rate limited** - depends on your Hugging Face quota

## File Structure

```
tldr chan/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.js               # Popup logic with mode routing
├── popup.css              # Popup styling
├── nlp_algo.js            # Offline NLP summarization
├── settings.html          # Settings page (simplified)
├── settings.js            # Settings management
├── settings.css           # Settings styling
├── content.js             # Content script for text selection
├── tldr_bg.png           # Main popup background
├── settings_bg.png        # Settings page background
├── icon16.png             # 16x16 icon
├── icon48.png             # 48x48 icon
├── icon128.png            # 128x128 icon
└── README.md              # This file
```


## Technical Details

### Offline NLP Algorithm
- **Location**: `nlp_algo.js`
- **Method**: Rule-based sentence extraction with keyword scoring
- **Features**: Position analysis, keyword frequency, smart highlighting
- **Output**: One bullet point per original sentence with bold keywords

### AI Integration (Optional)
- **Model**: `facebook/bart-large-cnn`
- **API**: Hugging Face Inference API
- **Fallback**: Automatically uses offline mode if API fails

### Storage
- **Settings**: Mode preference and API key (if provided)
- **Cache**: Selected text between sessions
- **Security**: API keys stored locally in `chrome.storage.local`

### Permissions
- `activeTab`: Access to current tab for text selection
- `storage`: Save settings and cached data
- `https://api-inference.huggingface.co/*`: Hugging Face API access (only when BART mode is used)

## How It Works

1. **Text Selection**: Content script detects highlighted text on any webpage
2. **Mode Check**: Extension checks if user has selected BART mode with API key
3. **Summarization**:
   - **Offline Mode**: Uses `nlp_algo.js` for instant rule-based summaries
   - **BART Mode**: Sends text to Hugging Face API for AI-powered summaries
4. **Formatting**: Summary is formatted into bullet points with key word highlighting
5. **Display**: Clean interface shows original text and summary

## Privacy & Security

- **Offline Mode**: Your text never leaves your browser
- **AI Mode**: Text only sent to Hugging Face when explicitly enabled
- **User Control**: You choose which mode to use
- **Local Storage**: All settings stored locally in your browser
- **Secure API**: Uses HTTPS for all API communications

## Mode Comparison

| Feature | Offline NLP | BART AI |
|---------|-------------|---------|
| **Speed** | Instant | 2-10 seconds |
| **Quality** | Good (rule-based) | Excellent (AI-powered) |
| **Privacy** | 100% offline | Text sent to API |
| **Reliability** | Always works | Requires internet |
| **Setup** | None needed | API key required |
| **Cost** | Free | Free (your API quota) |

## Troubleshooting

### Offline Mode Issues
- **No summary generated**: Try highlighting longer text (at least 10 characters)
- **Extension not working**: Check that it's enabled in `chrome://extensions/`

### BART Mode Issues
- **"Testing..." stuck**: Wait up to 1 minute for first API call, refresh if longer
- **"Invalid API key"**: Check your Hugging Face token at https://huggingface.co/settings/tokens
- **"API rate limit"**: Wait a few minutes or upgrade your Hugging Face plan
- **"Model loading"**: Try again in 30-60 seconds

## Addition Information
## Custom Pixel Art Backgrounds

This extension features **hand-drawn pixel art backgrounds** created with:
- **Wacom tablet** for precise digital drawing
- **Aseprite** for pixel-perfect art creation

### Background Images:
- **`tldr_bg.png`**: Main popup background
- **`settings_bg.png`**: Settings page background 

Background is a pixel art design that is simple and enhances the user experience while maintaining readability and modern functionality.

### Pixel Art

**`tldr_bg.png`** - Main Extension Background
- **Purpose**: Creates engaging visual experience for text summarization
- **Technique**: Hand-drawn with Wacom + Aseprite

**`settings_bg.png`** - Settings Page Background  
- **Purpose**: Maintains visual consistency across the extension
- **Technique**: Pixel-perfect art using Aseprite

<p align="center">
  <img src="tldr chan/tldr_bg.png" alt="TLDR Extension Interface" width="350">
  <br>
  <em>Main popup with custom pixel art background</em>
</p>

<p align="center">
  <img src="tldr chan/settings_bg.png" alt="Settings Page" width="350">
  <br>
  <em>Settings page with complementary pixel art design</em>
</p>


## License

This project is open source and available under the MIT License.

## Acknowledgments

- Hugging Face for providing free AI models
- Chrome Extensions API for the platform
- The open source community for inspiration and tools

---

**Default Mode**: Works offline, no setup required  
**AI Mode**: Optional upgrade for premium summaries
