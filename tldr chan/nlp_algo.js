// Offline NLP summarization logic exposed as a simple namespace for reuse in popup

(function() {
	function generateSummary(text) {
		try {
			const cleanText = text.replace(/\s+/g, ' ').trim();
			// Split into sentences and keep punctuation; do not omit any sentences
			const sentences = (cleanText.match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim());
			if (sentences.length === 0) {
				return ['No meaningful content found to summarize.'];
			}
			// Map each original sentence to a single highlighted bullet
			return sentences
				.filter(s => s.length > 0)
				.map(s => boldKeyWords(s, cleanText));
		} catch (error) {
			console.error('Rule-based summarization error:', error);
			return ['Unable to generate summary. Please try with different text.'];
		}
	}

	function calculateSentenceScore(sentence, fullText) {
		let score = 0;
		const words = sentence.toLowerCase().split(/\s+/);
		const idealLength = 20;
		const lengthScore = 1 - Math.abs(words.length - idealLength) / idealLength;
		score += lengthScore * 0.2;
		const sentences = fullText.split(/[.!?]+/);
		const position = sentences.findIndex(s => s.includes(sentence));
		if (position === 0 || position === sentences.length - 1) {
			score += 0.3;
		}
		const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those']);
		const meaningfulWords = words.filter(word => word.length > 3 && !commonWords.has(word));
		meaningfulWords.forEach(word => {
			const frequency = (fullText.toLowerCase().match(new RegExp(word, 'g')) || []).length;
			score += frequency * 0.1;
		});
		const capitalizedWords = sentence.match(/[A-Z][a-z]+/g) || [];
		score += capitalizedWords.length * 0.15;
		if (/\d+/.test(sentence)) score += 0.2;
		if (/[A-Z]{2,}/.test(sentence)) score += 0.1;
		return score;
	}

	function extractKeyPhrases(text) {
		const phrases = [];
		const words = text.split(/\s+/);
		const chunks = text.split(/[,;.!?]/).filter(chunk => chunk.trim().length > 5);
		chunks.forEach(chunk => {
			const trimmed = chunk.trim();
			if (trimmed.length > 10 && trimmed.length < 100) {
				phrases.push(trimmed);
			}
		});
		if (phrases.length === 0) {
			for (let i = 0; i < words.length; i += 8) {
				const chunk = words.slice(i, i + 8).join(' ');
				if (chunk.trim().length > 10) {
					phrases.push(chunk.trim());
				}
			}
		}
		return phrases.slice(0, 4).map(phrase => boldKeyWords(phrase, text));
	}

	function boldKeyWords(sentence, fullText) {
		try {
			const allWords = fullText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
			const wordFreq = {};
			allWords.forEach(word => { wordFreq[word] = (wordFreq[word] || 0) + 1; });
			const commonWords = new Set([
				'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'was', 'one', 'our', 'has', 'have',
				'this', 'that', 'with', 'from', 'they', 'she', 'her', 'his', 'him', 'been', 'than', 'who', 'oil', 'its',
				'now', 'find', 'may', 'say', 'use', 'way', 'will', 'each', 'which', 'their', 'time', 'what', 'about',
				'would', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'want', 'because', 'any',
				'these', 'give', 'day', 'most', 'us', 'or', 'just', 'where', 'much', 'good', 'some', 'come', 'very',
				'when', 'how', 'many', 'them', 'being', 'if', 'should', 'said', 'get', 'here', 'more', 'like', 'take',
				'into', 'year', 'your', 'know', 'work', 'than', 'only', 'think', 'over', 'also', 'back', 'see', 'go',
				'make', 'even', 'before', 'look', 'too', 'means', 'people', 'such', 'through', 'under', 'does'
			]);
			const wordsToHighlight = new Set();
			const words = sentence.match(/\b[\w']+\b/g) || [];
			words.forEach(word => {
				const lowerWord = word.toLowerCase();
				if (commonWords.has(lowerWord) || word.length < 3) return;
				if (/^[A-Z]/.test(word) && word.length > 3) wordsToHighlight.add(word);
				if (wordFreq[lowerWord] && wordFreq[lowerWord] >= 2) wordsToHighlight.add(word);
				if (/\d/.test(word)) wordsToHighlight.add(word);
				if (/^[A-Z]{2,}$/.test(word)) wordsToHighlight.add(word);
				if (word.length >= 7 && !commonWords.has(lowerWord)) wordsToHighlight.add(word);
			});
			let highlightedCount = 0;
			const maxHighlights = Math.min(4, Math.ceil(words.length / 4));
			let result = sentence;
			const sortedWords = Array.from(wordsToHighlight).sort((a, b) => {
				const freqA = (wordFreq[a.toLowerCase()] || 0);
				const freqB = (wordFreq[b.toLowerCase()] || 0);
				if (freqA !== freqB) return freqB - freqA;
				return b.length - a.length;
			});
			for (const word of sortedWords) {
				if (highlightedCount >= maxHighlights) break;
				const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'g');
				if (regex.test(result)) {
					result = result.replace(regex, `<strong>${word}</strong>`);
					highlightedCount++;
				}
			}
			return result;
		} catch (error) {
			console.error('Bold formatting error:', error);
			return sentence;
		}
	}

	window.nlpAlgo = {
		summarize: generateSummary
	};
})();
// Popup JavaScript for TLDR Chan Extension

document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        noText: document.getElementById('no-text'),
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        errorMessage: document.getElementById('error-message'),
        summaryContainer: document.getElementById('summary-container'),
        originalText: document.getElementById('original-text'),
        summaryList: document.getElementById('summary-list'),
        copyButton: document.getElementById('copy-summary'),
        newButton: document.getElementById('new-summary')
    };

    // Initialize popup
    init();

    async function init() {
        try {
            const selectedText = await getSelectedText();
            if (selectedText && selectedText.trim().length > 10) {
                showLoading();
                const summary = await summarizeText(selectedText);
                displaySummary(selectedText, summary);
            } else {
                showNoText();
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to load selected text. Please try again.');
        }
    }

    async function getSelectedText() {
        return new Promise((resolve) => {
            // First try to get text from current tab
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, function(response) {
                    if (chrome.runtime.lastError) {
                        // Fallback to storage
                        chrome.storage.local.get(['selectedText'], function(result) {
                            resolve(result.selectedText || '');
                        });
                    } else {
                        resolve(response ? response.text : '');
                    }
                });
            });
        });
    }

    function summarizeText(text) {
        return new Promise((resolve) => {
            // Simulate processing time for better UX
            setTimeout(() => {
                const summary = generateSummary(text);
                resolve(summary);
            }, 1000);
        });
    }

    function generateSummary(text) {
        try {
            // Clean and prepare text
            const cleanText = text.replace(/\s+/g, ' ').trim();
            
            // Split into sentences
            const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
            
            if (sentences.length === 0) {
                return ['No meaningful content found to summarize.'];
            }

            // If text is short, return key phrases
            if (sentences.length <= 2) {
                return extractKeyPhrases(cleanText);
            }

            // For longer text, use extractive summarization
            const scoredSentences = sentences.map(sentence => ({
                text: sentence.trim(),
                score: calculateSentenceScore(sentence, cleanText)
            }));

            // Sort by score and take top sentences
            scoredSentences.sort((a, b) => b.score - a.score);
            
            const summaryCount = Math.min(5, Math.max(2, Math.ceil(sentences.length * 0.3)));
            const topSentences = scoredSentences.slice(0, summaryCount);
            
            // Sort back to original order
            const originalOrder = topSentences.sort((a, b) => {
                return cleanText.indexOf(a.text) - cleanText.indexOf(b.text);
            });

            // Apply bold formatting to key words in each sentence
            return originalOrder.map(item => boldKeyWords(item.text.trim(), cleanText)).filter(s => s.length > 0);
        } catch (error) {
            console.error('Summarization error:', error);
            return ['Unable to generate summary. Please try with different text.'];
        }
    }

    function calculateSentenceScore(sentence, fullText) {
        let score = 0;
        const words = sentence.toLowerCase().split(/\s+/);
        
        // Length preference (not too short, not too long)
        const idealLength = 20;
        const lengthScore = 1 - Math.abs(words.length - idealLength) / idealLength;
        score += lengthScore * 0.2;

        // Position bonus (first and last sentences often important)
        const sentences = fullText.split(/[.!?]+/);
        const position = sentences.findIndex(s => s.includes(sentence));
        if (position === 0 || position === sentences.length - 1) {
            score += 0.3;
        }

        // Keyword frequency
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those']);
        
        const meaningfulWords = words.filter(word => 
            word.length > 3 && !commonWords.has(word)
        );

        // Word frequency in document
        meaningfulWords.forEach(word => {
            const frequency = (fullText.toLowerCase().match(new RegExp(word, 'g')) || []).length;
            score += frequency * 0.1;
        });

        // Capitalized words (often important)
        const capitalizedWords = sentence.match(/[A-Z][a-z]+/g) || [];
        score += capitalizedWords.length * 0.15;

        // Numbers and specific terms
        if (/\d+/.test(sentence)) score += 0.2;
        if (/[A-Z]{2,}/.test(sentence)) score += 0.1; // Acronyms

        return score;
    }

    function extractKeyPhrases(text) {
        const phrases = [];
        const words = text.split(/\s+/);
        
        // Extract noun phrases and important terms
        const chunks = text.split(/[,;.!?]/).filter(chunk => chunk.trim().length > 5);
        
        chunks.forEach(chunk => {
            const trimmed = chunk.trim();
            if (trimmed.length > 10 && trimmed.length < 100) {
                phrases.push(trimmed);
            }
        });

        if (phrases.length === 0) {
            // Fallback: split into meaningful chunks
            for (let i = 0; i < words.length; i += 8) {
                const chunk = words.slice(i, i + 8).join(' ');
                if (chunk.trim().length > 10) {
                    phrases.push(chunk.trim());
                }
            }
        }

        // Apply bold formatting to key phrases
        return phrases.slice(0, 4).map(phrase => boldKeyWords(phrase, text));
    }

    function boldKeyWords(sentence, fullText) {
        try {
            // Get all meaningful words from the full text for frequency analysis
            const allWords = fullText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
            const wordFreq = {};
            allWords.forEach(word => {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            });

            // Common words to ignore
            const commonWords = new Set([
                'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'was', 'one', 'our', 'has', 'have',
                'this', 'that', 'with', 'from', 'they', 'she', 'her', 'his', 'him', 'been', 'than', 'who', 'oil', 'its',
                'now', 'find', 'may', 'say', 'use', 'way', 'will', 'each', 'which', 'their', 'time', 'what', 'about',
                'would', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'want', 'because', 'any',
                'these', 'give', 'day', 'most', 'us', 'or', 'just', 'where', 'much', 'good', 'some', 'come', 'very',
                'when', 'how', 'many', 'them', 'being', 'if', 'should', 'said', 'get', 'here', 'more', 'like', 'take',
                'into', 'year', 'your', 'know', 'work', 'than', 'only', 'think', 'over', 'also', 'back', 'see', 'go',
                'make', 'even', 'before', 'look', 'too', 'means', 'people', 'such', 'through', 'under', 'does'
            ]);

            // Identify words to bold based on multiple criteria
            const wordsToHighlight = new Set();
            const words = sentence.match(/\b[\w']+\b/g) || [];

            words.forEach(word => {
                const lowerWord = word.toLowerCase();
                
                // Skip common words
                if (commonWords.has(lowerWord) || word.length < 3) return;

                // Criteria for bolding:
                // 1. Capitalized words (likely proper nouns)
                if (/^[A-Z]/.test(word) && word.length > 3) {
                    wordsToHighlight.add(word);
                }
                
                // 2. Words that appear multiple times in the document
                if (wordFreq[lowerWord] && wordFreq[lowerWord] >= 2) {
                    wordsToHighlight.add(word);
                }
                
                // 3. Numbers and percentages
                if (/\d/.test(word)) {
                    wordsToHighlight.add(word);
                }
                
                // 4. Technical terms or acronyms
                if (/^[A-Z]{2,}$/.test(word)) {
                    wordsToHighlight.add(word);
                }
                
                // 5. Important action words
                const actionWords = ['developed', 'created', 'implemented', 'designed', 'built', 'established', 'achieved', 'improved', 'increased', 'decreased', 'reduced', 'enhanced', 'optimized', 'launched', 'published', 'completed', 'successful', 'effective', 'significant', 'important', 'critical', 'essential', 'innovative', 'advanced', 'revolutionary', 'breakthrough', 'solution', 'problem', 'challenge', 'opportunity', 'strategy', 'approach', 'method', 'technique', 'process', 'system', 'technology', 'platform', 'framework', 'model', 'theory', 'concept', 'principle', 'factor', 'element', 'component', 'feature', 'benefit', 'advantage', 'result', 'outcome', 'impact', 'effect', 'consequence'];
                if (actionWords.includes(lowerWord)) {
                    wordsToHighlight.add(word);
                }
                
                // 6. Long, potentially important words
                if (word.length >= 7 && !commonWords.has(lowerWord)) {
                    wordsToHighlight.add(word);
                }
            });

            // Apply bold formatting (limit to 3-4 words per sentence to avoid over-highlighting)
            let highlightedCount = 0;
            const maxHighlights = Math.min(4, Math.ceil(words.length / 4));
            
            let result = sentence;
            
            // Sort words by importance (longer words first, then frequency)
            const sortedWords = Array.from(wordsToHighlight).sort((a, b) => {
                const freqA = wordFreq[a.toLowerCase()] || 0;
                const freqB = wordFreq[b.toLowerCase()] || 0;
                
                if (freqA !== freqB) return freqB - freqA;
                return b.length - a.length;
            });

            for (const word of sortedWords) {
                if (highlightedCount >= maxHighlights) break;
                
                // Use word boundary regex to avoid partial matches
                const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
                if (regex.test(result)) {
                    result = result.replace(regex, `<strong>${word}</strong>`);
                    highlightedCount++;
                }
            }

            return result;
        } catch (error) {
            console.error('Bold formatting error:', error);
            return sentence; // Return original sentence if formatting fails
        }
    }

    function showNoText() {
        hideAll();
        elements.noText.classList.remove('hidden');
    }

    function showLoading() {
        hideAll();
        elements.loading.classList.remove('hidden');
    }

    function showError(message) {
        hideAll();
        elements.errorMessage.textContent = message;
        elements.error.classList.remove('hidden');
    }

    function displaySummary(originalText, summaryPoints) {
        hideAll();
        
        // Display original text (truncated if too long)
        const truncatedText = originalText.length > 200 
            ? originalText.substring(0, 200) + '...' 
            : originalText;
        elements.originalText.textContent = truncatedText;

        // Display summary points
        elements.summaryList.innerHTML = '';
        summaryPoints.forEach((point, index) => {
            const li = document.createElement('li');
            li.innerHTML = point; // Use innerHTML to render bold tags
            li.style.animationDelay = `${index * 0.1}s`;
            elements.summaryList.appendChild(li);
        });

        elements.summaryContainer.classList.remove('hidden');
    }

    function hideAll() {
        [elements.noText, elements.loading, elements.error, elements.summaryContainer]
            .forEach(el => el.classList.add('hidden'));
    }

    // Event listeners
    elements.copyButton.addEventListener('click', function() {
        const summaryText = Array.from(elements.summaryList.children)
            .map(li => '• ' + li.textContent) // textContent strips HTML formatting for clean copy
            .join('\n');
        
        navigator.clipboard.writeText(summaryText).then(() => {
            const originalText = elements.copyButton.textContent;
            elements.copyButton.textContent = '✔ Copied!';
            setTimeout(() => {
                elements.copyButton.textContent = originalText;
            }, 2000);
        }).catch(() => {
            showError('Failed to copy to clipboard');
        });
    });

    elements.newButton.addEventListener('click', function() {
        // Clear storage and reset
        chrome.storage.local.clear();
        showNoText();
    });
}); 