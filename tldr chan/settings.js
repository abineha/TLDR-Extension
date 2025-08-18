// Settings page JavaScript for TLDR Chan Extension

document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        apiKey: document.getElementById('api-key'),
        toggleVisibility: document.getElementById('toggle-visibility'),
        modeSelect: document.getElementById('mode-select'),
        apiConfig: document.getElementById('api-config'),
        saveSettings: document.getElementById('save-settings'),
        testApi: document.getElementById('test-api'),
        resetSettings: document.getElementById('reset-settings'),
        statusMessage: document.getElementById('status-message')
    };

    // Default settings
    const defaultSettings = {
        mode: 'nlp', // 'nlp' | 'bart'
        apiKey: ''
    };

    // Initialize settings page
    init();

    async function init() {
        loadSettings();
        setupEventListeners();
    }

    function loadSettings() {
        chrome.storage.local.get(['settings'], function(result) {
            const settings = result.settings || defaultSettings;
            
            elements.apiKey.value = settings.apiKey || '';
            elements.modeSelect.value = settings.mode || defaultSettings.mode;
            toggleApiVisibility();
        });
    }

    function setupEventListeners() {
        // Toggle API key visibility
        elements.toggleVisibility.addEventListener('click', function() {
            const type = elements.apiKey.type === 'password' ? 'text' : 'password';
            elements.apiKey.type = type;
            elements.toggleVisibility.textContent = type === 'password' ? '👁️' : '🙈';
        });

        // Save settings
        elements.saveSettings.addEventListener('click', saveSettings);

        // Test API
        elements.testApi.addEventListener('click', testApiConnection);

        // Reset settings
        elements.resetSettings.addEventListener('click', resetToDefaults);

        // Auto-save on input changes
        [elements.apiKey, elements.modeSelect].forEach(element => {
            element.addEventListener('change', () => {
                if (element === elements.modeSelect) toggleApiVisibility();
                autoSave();
            });
        });
    }

    function saveSettings() {
        const settings = {
            mode: elements.modeSelect.value,
            apiKey: elements.apiKey.value.trim()
        };

        chrome.storage.local.set({ settings: settings }, function() {
            showStatus('Settings saved successfully!', 'success');
        });
    }

    function autoSave() {
        // Debounce auto-save to avoid too many storage operations
        clearTimeout(autoSave.timeout);
        autoSave.timeout = setTimeout(() => {
            saveSettings();
        }, 1000);
    }

    async function testApiConnection() {
        const apiKey = elements.apiKey.value.trim();
        if (elements.modeSelect.value !== 'bart') {
            showStatus('Switch mode to BART to test API.', 'info');
            return;
        }
        
        if (!apiKey) {
            showStatus('Please enter your API key first.', 'error');
            return;
        }

        if (!apiKey.startsWith('hf_')) {
            showStatus('Invalid API key format. Hugging Face keys start with "hf_".', 'error');
            return;
        }

        showStatus('Testing API connection...', 'info');
        elements.testApi.disabled = true;
        elements.testApi.textContent = 'Testing...';

        try {
            const testText = "This is a test text to verify the API connection is working properly.";
            const summary = await callHuggingFaceAPI(testText, apiKey);
            
            if (summary && summary.length > 0) {
                showStatus('✅ API connection successful! Your key is working.', 'success');
            } else {
                showStatus('❌ API returned empty response. Please check your key.', 'error');
            }
        } catch (error) {
            console.error('API test error:', error);
            
            if (error.message.includes('401')) {
                showStatus('❌ Invalid API key. Please check your Hugging Face token.', 'error');
            } else if (error.message.includes('429')) {
                showStatus('⚠️ API rate limit reached. Please try again later.', 'error');
            } else if (error.message.includes('503')) {
                showStatus('⚠️ Model is currently loading. Please try again in a moment.', 'error');
            } else {
                showStatus('❌ API connection failed: ' + error.message, 'error');
            }
        } finally {
            elements.testApi.disabled = false;
            elements.testApi.textContent = '🧪 Test API';
        }
    }

    async function callHuggingFaceAPI(text, apiKey) {
        const response = await fetch(`https://api-inference.huggingface.co/models/facebook/bart-large-cnn`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: text,
                parameters: {
                    max_length: 200,
                    min_length: 30,
                    do_sample: false,
                    num_beams: 4,
                    early_stopping: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            return data[0].summary_text || data[0].generated_text || '';
        } else if (data.summary_text) {
            return data.summary_text;
        } else if (data.generated_text) {
            return data.generated_text;
        } else {
            throw new Error('Unexpected API response format');
        }
    }

    function resetToDefaults() {
        if (confirm('Are you sure you want to reset settings?')) {
            chrome.storage.local.set({ settings: defaultSettings }, function() {
                loadSettings();
                showStatus('Settings reset to defaults.', 'success');
            });
        }
    }

    function toggleApiVisibility() {
        if (!elements.apiConfig) return;
        if (elements.modeSelect.value === 'bart') {
            elements.apiConfig.classList.remove('hidden');
        } else {
            elements.apiConfig.classList.add('hidden');
        }
    }

    function showStatus(message, type) {
        elements.statusMessage.textContent = message;
        elements.statusMessage.className = `status-message ${type}`;
        elements.statusMessage.classList.remove('hidden');
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                elements.statusMessage.classList.add('hidden');
            }, 3000);
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + S to save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            saveSettings();
        }
        
        // Escape to go back
        if (event.key === 'Escape') {
            window.close();
        }
    });
});
