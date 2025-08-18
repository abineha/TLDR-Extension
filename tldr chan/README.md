# TLDR Chan - AI-Powered Text Summarizer

A Chrome extension that uses **Hugging Face's AI models** to generate high-quality summaries of highlighted text. Features intelligent summarization with user-configurable settings and fallback to rule-based summarization.

## ✨ Features

- **🤖 AI-Powered Summaries**: Uses Hugging Face's BART models for intelligent text summarization
- **🔑 User API Keys**: Each user provides their own free Hugging Face API key (no account limits)
- **⚙️ Customizable Settings**: Adjust summary length, model selection, and behavior
- **🔄 Fallback Mode**: Automatic fallback to rule-based summarization if API fails
- **📋 Copy to Clipboard**: One-click copying of summaries
- **🎨 Modern UI**: Clean, responsive design with smooth animations
- **💾 Auto-Save**: Remembers selected text between sessions

## 🚀 Quick Start

### 1. Install the Extension

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder

### 2. Get Your Free API Key

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a free account (takes 2 minutes)
3. Generate a new API token
4. Copy the token (starts with `hf_`)

### 3. Configure the Extension

1. Click the TLDR Chan icon in your browser toolbar
2. Click the settings gear icon (⚙️)
3. Paste your API key in the settings page
4. Test the connection with the "Test API" button
5. Save your settings

### 4. Start Summarizing

1. Highlight any text on any webpage
2. Click the TLDR Chan extension icon
3. Get instant AI-powered summaries!

## 🛠️ Settings Configuration

### AI Models Available

- **BART Large CNN** (Recommended): Best quality summaries
- **BART Base**: Faster processing, good quality
- **DistilBART CNN**: Lightweight, quick summaries

### Summary Settings

- **Maximum Length**: 100-300 characters
- **Minimum Length**: 30-80 characters
- **Fallback Mode**: Use rule-based summarization if API fails
- **Auto-Save**: Remember selected text between sessions

## 📁 File Structure

```
tldr chan/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.js               # Popup logic with AI integration
├── popup.css              # Popup styling
├── settings.html          # Settings page
├── settings.js            # Settings management
├── settings.css           # Settings styling
├── content.js             # Content script for text selection
├── icon16.png             # 16x16 icon
├── icon48.png             # 48x48 icon
├── icon128.png            # 128x128 icon
└── README.md              # This file
```

## 🔧 Technical Details

### API Integration

The extension uses Hugging Face's Inference API with the following models:
- `facebook/bart-large-cnn` (default)
- `facebook/bart-base`
- `sshleifer/distilbart-cnn-12-6`

### Storage

- API keys and settings stored in `chrome.storage.local`
- Selected text cached for better performance
- Secure handling of user credentials

### Permissions

- `activeTab`: Access to current tab for text selection
- `storage`: Save settings and cached data
- `https://api-inference.huggingface.co/*`: Hugging Face API access

## 🎯 How It Works

1. **Text Selection**: Content script detects highlighted text on any webpage
2. **API Call**: Sends text to Hugging Face's AI model for summarization
3. **Processing**: AI generates intelligent summary based on user settings
4. **Formatting**: Summary is formatted into bullet points with key word highlighting
5. **Display**: Clean, modern interface shows original text and summary
6. **Fallback**: If API fails, uses rule-based summarization (if enabled)

## 🔒 Privacy & Security

- **No Data Collection**: Your text never leaves your browser except for API calls
- **User API Keys**: Each user manages their own Hugging Face account
- **Local Storage**: All settings stored locally in your browser
- **Secure API**: Uses HTTPS for all API communications

## 🆚 Comparison: AI vs Rule-Based

| Feature | AI-Powered | Rule-Based |
|---------|------------|------------|
| **Quality** | High-quality, contextual summaries | Basic keyword extraction |
| **Speed** | 2-5 seconds (API dependent) | Instant |
| **Cost** | Free (user's API quota) | Free |
| **Reliability** | Requires internet connection | Works offline |
| **Customization** | Multiple models, length settings | Fixed algorithm |

## 🐛 Troubleshooting

### Common Issues

**"API key not configured"**
- Go to settings and enter your Hugging Face API key
- Make sure the key starts with `hf_`

**"Invalid API key"**
- Check your Hugging Face token at https://huggingface.co/settings/tokens
- Generate a new token if needed

**"API rate limit reached"**
- Hugging Face has rate limits on free accounts
- Wait a few minutes and try again
- Consider upgrading to a paid plan for higher limits

**"Model is currently loading"**
- Some models take time to load on Hugging Face servers
- Try again in 30-60 seconds
- Consider switching to a faster model in settings

**Extension not working**
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the webpage
- Check browser console for error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Hugging Face for providing free AI models
- Chrome Extensions API for the platform
- The open source community for inspiration and tools

---

**Made with ❤️ for better reading experiences**
