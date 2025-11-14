// app.js
// Handles the chat interface interactions

// Initialize the agent with mock data
const agent = new GroupChatAssistant(mockGroupChatData);

// Get DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');
const welcomeScreen = document.getElementById('welcomeScreen');
const welcomeInput = document.getElementById('welcomeInput');
const inputContainer = document.getElementById('inputContainer');
const groupChatFeed = document.getElementById('groupChatFeed');
const aiAssistantView = document.getElementById('aiAssistantView');
const aiMessages = document.getElementById('aiMessages');
const channelAvatar = document.getElementById('channelAvatar');
const channelName = document.getElementById('channelName');
const feedHeader = document.getElementById('feedHeader');
const assistantHeader = document.getElementById('assistantHeader');

// Track current view
let currentView = 'feed'; // 'feed' or 'assistant'

// Voice Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isVoiceSupported = !!SpeechRecognition;
let recognition = null;
let isRecording = false;
let gradientCycleInterval = null;
let currentGradientIndex = 1;

// Initialize chat on page load
window.addEventListener('load', () => {
    // Set channel info
    channelAvatar.textContent = mockGroupChatData.creator.avatar;
    channelName.textContent = mockGroupChatData.creator.name;
    
    // Render group chat feed by default
    renderGroupChatFeed();
    showFeedView();
    
    // Initialize voice recognition
    initVoiceRecognition();
    
    // Setup input listeners for button state management
    if (userInput) {
        userInput.addEventListener('input', () => updateInputButton('main'));
    }
    if (welcomeInput) {
        welcomeInput.addEventListener('input', () => updateInputButton('welcome'));
    }
    
    // Initialize button states
    updateInputButton('main');
    updateInputButton('welcome');
});

/**
 * Initialize voice recognition
 */
function initVoiceRecognition() {
    if (!isVoiceSupported) {
        // Hide microphone buttons if not supported
        const micButtons = document.querySelectorAll('.mic-button');
        micButtons.forEach(btn => btn.style.display = 'none');
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        // Recognition started
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleTranscription(transcript);
    };
    
    recognition.onerror = (event) => {
        // Only alert for permission errors
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            alert('Microphone access denied. Please allow microphone access in browser settings.');
        }
        // Silently handle network errors and other issues
        stopVoiceRecording();
    };
    
    recognition.onend = () => {
        stopVoiceRecording();
    };
}

/**
 * Start voice recording
 */
function startVoiceRecording(inputType = 'main') {
    if (!isVoiceSupported || isRecording) return;
    
    try {
        isRecording = true;
        recognition.start();
        
        // Add recording state to input wrapper
        const wrapper = inputType === 'welcome' 
            ? document.querySelector('.welcome-input-field')
            : document.querySelector('.input-wrapper');
        
        if (wrapper) {
            wrapper.classList.add('recording');
        }
        
        // Store which input is being used
        recognition.currentInputType = inputType;
        
        // Update button to show recording state
        updateInputButton(inputType);
        
        // Start gradient animation if in assistant view
        if (currentView === 'assistant') {
            startGradientAnimation();
        }
    } catch (error) {
        isRecording = false;
    }
}

/**
 * Stop voice recording
 */
function stopVoiceRecording() {
    if (!isRecording) return;
    
    const inputType = recognition.currentInputType || 'main';
    isRecording = false;
    
    try {
        recognition.stop();
    } catch (error) {
        console.error('Error stopping recognition:', error);
    }
    
    // Remove recording state from both inputs
    const wrappers = document.querySelectorAll('.welcome-input-field, .input-wrapper');
    wrappers.forEach(wrapper => wrapper.classList.remove('recording'));
    
    // Update button to show normal state
    updateInputButton(inputType);
    
    // Stop gradient animation
    stopGradientAnimation();
}

/**
 * Handle transcription result
 */
function handleTranscription(text) {
    const inputType = recognition.currentInputType || 'main';
    const input = inputType === 'welcome' ? welcomeInput : userInput;
    
    if (input) {
        input.value = text;
        updateInputButton(inputType);
        input.focus();
    }
}

/**
 * Start gradient animation during voice recording
 */
function startGradientAnimation() {
    const gradientElement = document.getElementById('voiceGradient');
    if (!gradientElement) return;
    
    // Reset to first gradient
    currentGradientIndex = 1;
    
    // Show the gradient overlay
    gradientElement.classList.remove('hidden');
    gradientElement.classList.add('active', 'gradient-1');
    
    // Cycle through gradients every 600ms
    gradientCycleInterval = setInterval(() => {
        cycleGradient();
    }, 600);
}

/**
 * Stop gradient animation
 */
function stopGradientAnimation() {
    const gradientElement = document.getElementById('voiceGradient');
    if (!gradientElement) return;
    
    // Clear the interval
    if (gradientCycleInterval) {
        clearInterval(gradientCycleInterval);
        gradientCycleInterval = null;
    }
    
    // Hide the gradient overlay
    gradientElement.classList.remove('active');
    
    // After fade out animation, hide and remove all gradient classes
    setTimeout(() => {
        gradientElement.classList.add('hidden');
        gradientElement.classList.remove('gradient-1', 'gradient-2', 'gradient-3', 'gradient-4');
        currentGradientIndex = 1;
    }, 300);
}

/**
 * Cycle to the next gradient
 */
function cycleGradient() {
    const gradientElement = document.getElementById('voiceGradient');
    if (!gradientElement) return;
    
    // Remove current gradient class
    gradientElement.classList.remove(`gradient-${currentGradientIndex}`);
    
    // Move to next gradient (1 -> 2 -> 3 -> 4 -> 1)
    currentGradientIndex = (currentGradientIndex % 4) + 1;
    
    // Add new gradient class
    gradientElement.classList.add(`gradient-${currentGradientIndex}`);
}

/**
 * Toggle voice recording on/off
 * Note: Only starts recording. Stops automatically on silence detection.
 */
function toggleVoiceRecording(inputType = 'main') {
    // Only start recording if not already recording
    // Recording will stop automatically when silence is detected
    if (!isRecording) {
        startVoiceRecording(inputType);
    }
    // If already recording, do nothing - let it continue until silence is detected
}

/**
 * Update input button state (mic vs send)
 */
function updateInputButton(inputType = 'main') {
    const input = inputType === 'welcome' ? welcomeInput : userInput;
    const button = inputType === 'welcome' 
        ? document.getElementById('welcomeSendButton')
        : document.getElementById('sendButton');
    
    if (!input || !button) return;
    
    const hasText = input.value.trim().length > 0;
    
    if (hasText) {
        // Show send icon
        button.classList.remove('mic-button');
        button.classList.add('send-button');
        button.onclick = inputType === 'welcome' ? sendWelcomeMessage : sendMessage;
        button.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 0L12 6L6 12L5.25 11.25L9.75 6.75H0V5.25H9.75L5.25 0.75L6 0Z" fill="currentColor"/>
        </svg>`;
    } else if (isVoiceSupported) {
        // Show microphone icon
        button.classList.remove('send-button');
        button.classList.add('mic-button');
        button.onclick = () => toggleVoiceRecording(inputType);
        
        // Get recording state from wrapper
        const wrapper = inputType === 'welcome'
            ? document.querySelector('.welcome-input-field')
            : document.querySelector('.input-wrapper');
        const isActiveRecording = wrapper && wrapper.classList.contains('recording');
        
        if (isActiveRecording) {
            // Solid microphone icon (recording)
            button.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13C11.6569 13 13 11.6569 13 10V4C13 2.34315 11.6569 1 10 1C8.34315 1 7 2.34315 7 4V10C7 11.6569 8.34315 13 10 13Z" fill="currentColor"/>
                <path d="M5 9V10C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 15V19M10 19H7M10 19H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        } else {
            // Light microphone icon (not recording)
            button.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="7" y="1" width="6" height="12" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M5 9V10C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 15V19M10 19H7M10 19H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        }
    } else {
        // Voice not supported, show send button as default
        button.classList.remove('mic-button');
        button.classList.add('send-button');
        button.onclick = inputType === 'welcome' ? sendWelcomeMessage : sendMessage;
        button.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 0L12 6L6 12L5.25 11.25L9.75 6.75H0V5.25H9.75L5.25 0.75L6 0Z" fill="currentColor"/>
        </svg>`;
    }
}

/**
 * Render the group chat feed
 */
function renderGroupChatFeed() {
    groupChatFeed.innerHTML = '';
    
    mockGroupChatData.chatMessages.forEach(message => {
        const messageEl = createChatMessageElement(message);
        groupChatFeed.appendChild(messageEl);
    });
}

/**
 * Create a chat message element
 */
function createChatMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    // Timestamp
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = message.timestamp;
    messageDiv.appendChild(timestampDiv);
    
    // Message header with avatar and content
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'creator-avatar';
    avatarDiv.textContent = mockGroupChatData.creator.avatar;
    headerDiv.appendChild(avatarDiv);
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content-wrapper';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message.content;
    contentWrapper.appendChild(textDiv);
    
    headerDiv.appendChild(contentWrapper);
    messageDiv.appendChild(headerDiv);
    
    // Reactions
    if (message.reactions) {
        const reactionsDiv = document.createElement('div');
        reactionsDiv.className = 'message-reactions';
        
        const emojiMap = {
            heart: '❤️',
            fire: '🔥',
            smile: '😊',
            hundred: '💯',
            thumbsUp: '👍'
        };
        
        Object.entries(message.reactions).forEach(([key, count]) => {
            if (count > 0) {
                const pill = document.createElement('div');
                pill.className = 'reaction-pill';
                
                const emoji = document.createElement('span');
                emoji.className = 'reaction-emoji';
                emoji.textContent = emojiMap[key];
                pill.appendChild(emoji);
                
                const countSpan = document.createElement('span');
                countSpan.className = 'reaction-count';
                countSpan.textContent = count;
                pill.appendChild(countSpan);
                
                reactionsDiv.appendChild(pill);
            }
        });
        
        messageDiv.appendChild(reactionsDiv);
    }
    
    // Replies
    if (message.replies && message.replies.length > 0) {
        const repliesSection = document.createElement('div');
        repliesSection.className = 'replies-section';
        
        message.replies.forEach(reply => {
            const replyEl = createReplyElement(reply);
            repliesSection.appendChild(replyEl);
        });
        
        // Leave a reply button
        const leaveReplyBtn = document.createElement('button');
        leaveReplyBtn.className = 'leave-reply-btn';
        leaveReplyBtn.textContent = 'Leave a reply';
        repliesSection.appendChild(leaveReplyBtn);
        
        messageDiv.appendChild(repliesSection);
    }
    
    return messageDiv;
}

/**
 * Create a reply element
 */
function createReplyElement(reply) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'reply-item';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'reply-header';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'reply-avatar';
    avatarDiv.textContent = reply.avatar;
    headerDiv.appendChild(avatarDiv);
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'reply-content-wrapper';
    
    // Header with username and timestamp inline
    const headerText = document.createElement('div');
    headerText.style.marginBottom = '4px';
    
    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'reply-username';
    usernameSpan.textContent = reply.username;
    headerText.appendChild(usernameSpan);
    
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'reply-timestamp';
    timestampSpan.textContent = '1d'; // You can make this dynamic based on reply.timestamp
    headerText.appendChild(timestampSpan);
    
    contentWrapper.appendChild(headerText);
    
    const textDiv = document.createElement('div');
    textDiv.className = 'reply-text';
    textDiv.textContent = reply.content;
    contentWrapper.appendChild(textDiv);
    
    // Reply reactions with reply count first
    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'reply-reactions';
    
    // Reply count pill (if there are replies)
    if (reply.replyCount > 0) {
        const replyPill = document.createElement('div');
        replyPill.className = 'reaction-pill';
        
        const replyIcon = document.createElement('span');
        replyIcon.className = 'reaction-emoji';
        replyIcon.textContent = '💬';
        replyPill.appendChild(replyIcon);
        
        const countSpan = document.createElement('span');
        countSpan.className = 'reaction-count';
        countSpan.textContent = reply.replyCount;
        replyPill.appendChild(countSpan);
        
        reactionsDiv.appendChild(replyPill);
    }
    
    // Emoji reactions
    if (reply.reactions) {
        const emojiMap = {
            heart: '❤️',
            fire: '🔥',
            smile: '😊',
            hundred: '💯',
            thumbsUp: '👍'
        };
        
        Object.entries(reply.reactions).forEach(([key, count]) => {
            if (count > 0) {
                const pill = document.createElement('div');
                pill.className = 'reaction-pill';
                
                const emoji = document.createElement('span');
                emoji.className = 'reaction-emoji';
                emoji.textContent = emojiMap[key];
                pill.appendChild(emoji);
                
                const countSpan = document.createElement('span');
                countSpan.className = 'reaction-count';
                countSpan.textContent = count;
                pill.appendChild(countSpan);
                
                reactionsDiv.appendChild(pill);
            }
        });
    }
    
    contentWrapper.appendChild(reactionsDiv);
    
    headerDiv.appendChild(contentWrapper);
    replyDiv.appendChild(headerDiv);
    
    return replyDiv;
}

/**
 * Show the feed view
 */
function showFeedView() {
    currentView = 'feed';
    groupChatFeed.classList.remove('hidden');
    aiAssistantView.classList.add('hidden');
    inputContainer.classList.add('hidden');
    
    // Switch headers
    feedHeader.classList.remove('hidden');
    assistantHeader.classList.add('hidden');
}

/**
 * Show the assistant view
 */
function showAssistantView() {
    currentView = 'assistant';
    groupChatFeed.classList.add('hidden');
    aiAssistantView.classList.remove('hidden');
    
    // Switch headers
    feedHeader.classList.add('hidden');
    assistantHeader.classList.remove('hidden');
    
    // Show welcome screen if no messages
    if (conversationHistory.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
    }
    
    // Update button states when entering assistant view
    updateInputButton('welcome');
    updateInputButton('main');
}

/**
 * Close assistant view and return to feed
 */
function closeAssistantView() {
    showFeedView();
}

/**
 * Handle back button - return to feed if in assistant view
 */
function handleBackButton() {
    if (currentView === 'assistant') {
        showFeedView();
    } else {
        // In feed view, go back to previous screen (would close the app)
        window.history.back();
    }
}

/**
 * Show empty state (welcome screen)
 */
function showEmptyState() {
    if (welcomeScreen) {
        welcomeScreen.classList.add('active');
    }
    if (inputContainer) {
        inputContainer.classList.add('hidden');
    }
}

/**
 * Hide empty state and show normal chat interface
 */
function hideEmptyState() {
    if (welcomeScreen) {
        welcomeScreen.classList.remove('active');
    }
    if (inputContainer) {
        inputContainer.classList.remove('hidden');
    }
}

/**
 * Handle welcome input key press
 */
function handleWelcomeKeyPress(event) {
    if (event.key === 'Enter') {
        sendWelcomeMessage();
    }
}

/**
 * Send message from welcome input
 */
function sendWelcomeMessage() {
    const message = welcomeInput.value.trim();
    if (message) {
        hideEmptyState();
        sendMessage(message);
        welcomeInput.value = '';
        updateInputButton('welcome');
    }
}

/**
 * Load conversation history from localStorage
 */
function loadConversationHistory() {
    conversationHistory.forEach(entry => {
        addMessage(entry.role, entry.content);
    });
}

/**
 * Go back to welcome screen (clear chat and reset)
 */
function goBackToWelcome() {
    // Clear all messages from AI assistant view
    aiMessages.innerHTML = '';
    
    // Clear conversation history
    conversationHistory.length = 0;
    localStorage.removeItem('chatHistory');
    
    // Show empty state
    showEmptyState();
    
    // Clear inputs
    if (userInput) userInput.value = '';
    if (welcomeInput) welcomeInput.value = '';
}

/**
 * Add a message to the chat interface (AI assistant view)
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 */
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    // Add sender name for user messages
    if (role === 'user') {
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = 'Dave';
        messageDiv.appendChild(senderDiv);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Convert **text** to <strong>text</strong> for bold formatting
    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks to <br> tags
    const htmlContent = formattedContent.replace(/\n/g, '<br>');
    messageContent.innerHTML = htmlContent;
    
    messageDiv.appendChild(messageContent);
    
    // Add disclaimer and autocompletes for assistant messages
    if (role === 'assistant') {
        const disclaimerDiv = document.createElement('div');
        disclaimerDiv.className = 'message-disclaimer';
        disclaimerDiv.innerHTML = 'LTK AI can make mistakes.<br>Please double check responses.';
        messageDiv.appendChild(disclaimerDiv);
        
        // Add autocompletes
        const autocompletesDiv = document.createElement('div');
        autocompletesDiv.className = 'message-autocompletes';
        
        const autocompleteOptions = [
            'Summarize today\'s discussion',
            'What questions do followers have?',
            'Suggest topics for next chat',
            'What topic was most liked?'
        ];
        
        autocompleteOptions.forEach(option => {
            const chip = document.createElement('button');
            chip.className = 'autocomplete-chip';
            chip.onclick = () => sendQuickAction(option);
            
            const chipText = document.createElement('span');
            chipText.className = 'autocomplete-chip-text';
            chipText.textContent = option;
            
            chip.appendChild(chipText);
            autocompletesDiv.appendChild(chip);
        });
        
        messageDiv.appendChild(autocompletesDiv);
    }
    
    aiMessages.appendChild(messageDiv);
    
    // Scroll behavior: for assistant messages, scroll to show user question at top
    // For user messages, scroll to bottom
    if (role === 'assistant') {
        // Use setTimeout to ensure DOM is updated before scrolling
        setTimeout(() => {
            scrollToUserQuestion();
        }, 50);
    } else {
        scrollToBottom();
    }
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator active';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(indicator);
    aiMessages.appendChild(typingDiv);
    scrollToBottom();
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Scroll messages container to bottom
 */
function scrollToBottom() {
    aiAssistantView.scrollTop = aiAssistantView.scrollHeight;
}

/**
 * Scroll to show the user's question at the top (below the header)
 */
function scrollToUserQuestion() {
    // Get all user messages
    const userMessages = aiMessages.querySelectorAll('.message.user');
    
    // Get the last user message (most recent question)
    if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        
        // Calculate scroll position to show question at top of visible area
        // We need to account for the padding at the top of the messages container
        const messageOffsetInContainer = lastUserMessage.offsetTop - aiAssistantView.offsetTop;
        
        // Scroll so the question appears at the very top of the scrollable area
        // Adding a small padding (20px) for visual comfort
        aiAssistantView.scrollTop = messageOffsetInContainer - 20;
    }
}

/**
 * Send a message from user input
 */
function sendMessage(messageText = null) {
    const message = messageText || userInput.value.trim();
    
    // Don't send empty messages
    if (!message) return;
    
    // Hide empty state if it's showing
    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
        hideEmptyState();
    }
    
    // Add user message to chat
    addMessage('user', message);
    
    // Clear input
    userInput.value = '';
    updateInputButton('main');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate processing delay (makes it feel more natural)
    setTimeout(() => {
        removeTypingIndicator();
        
        // Get response from agent
        const response = agent.processQuery(message);
        
        // Add assistant response
        addMessage('assistant', response);
    }, 800);
}

/**
 * Send a quick action message
 * @param {string} message - The pre-defined message
 */
function sendQuickAction(message) {
    userInput.value = message;
    sendMessage();
}

/**
 * Handle Enter key press in input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * Optional: Add conversation history tracking
 */
const conversationHistory = [];

function addToHistory(role, content) {
    conversationHistory.push({
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // Optional: Save to localStorage for persistence
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

/**
 * Optional: Load conversation history
 */
function loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        const history = JSON.parse(savedHistory);
        history.forEach(msg => {
            addMessage(msg.role, msg.content);
        });
    }
}

/**
 * Optional: Clear conversation
 */
function clearConversation() {
    messagesContainer.innerHTML = '';
    conversationHistory.length = 0;
    localStorage.removeItem('chatHistory');
    
    // Re-send welcome message
    const welcomeMessage = agent.processQuery('help');
    addMessage('assistant', welcomeMessage);
}

// Optional: Expose clear function to window for debugging
window.clearConversation = clearConversation;