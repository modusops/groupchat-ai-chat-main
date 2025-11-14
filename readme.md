# Creator AI Assistant - POC

A proof-of-concept AI-powered chat interface for creators to understand their social commerce business through natural conversation.

## 🎯 What This Does

This POC demonstrates a **template-based AI assistant** (Phase 1) that helps creators:
- Understand their product performance
- Track earnings and growth
- Get personalized recommendations
- Analyze their content strategy

**No LLM/API required** - uses smart templates and pattern matching!

## 📁 Project Structure

```
creator-ai-chat/
├── index.html          # Main chat interface
├── styles.css          # All styling
├── app.js             # Chat interaction logic
├── mock-data.js       # Sample business data
├── agent.js           # AI agent "brain"
└── README.md          # This file
```

## 🚀 Quick Start

### Option 1: Simple Local Setup (Easiest)

1. **Download all files** to a folder called `creator-ai-chat`
2. **Open `index.html`** in your web browser
3. **Start chatting!** Try the quick action buttons or type your own questions

That's it! No installation, no server, no dependencies.

### Option 2: Using a Local Server (Recommended for Development)

If you want to develop further, use a local server:

**Using Python:**
```bash
# Navigate to project folder
cd creator-ai-chat

# Python 3
python -m http.server 8000

# Open browser to: http://localhost:8000
```

**Using Node.js:**
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
http-server

# Open browser to: http://localhost:8080
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## 💬 Try These Questions

Once the chat is open, try asking:

- "How are my top products performing?"
- "How am I doing this month?"
- "How is my follower growth?"
- "What are my earnings?"
- "What are my best posts?"
- "What should I focus on?"

## 🎨 Customizing the Data

Want to test with different creator data? Edit `mock-data.js`:

```javascript
// Change creator info
creatorInfo: {
  name: "Your Name",
  username: "@yourhandle",
  totalFollowers: 50000  // Change this
}

// Modify product performance
products: [
  {
    name: "Your Product Name",
    unitsSold: 200,
    revenue: 5000,
    // ... customize any values
  }
]
```

## 🧠 How It Works

### Simple Flow

```
User Question
    ↓
Intent Detection (keyword matching)
    ↓
Data Retrieval (from mock-data.js)
    ↓
Template Response (formatted naturally)
    ↓
Display in Chat
```

### Example

**User:** "How are my top products performing?"

**Agent Process:**
1. Detects "top products" intent
2. Sorts products by revenue
3. Gets top 3 products
4. Formats response using template
5. Displays with emojis and insights

**Result:** Natural conversational answer with real data!

## 🔧 Technical Details

### Technologies Used
- **Pure HTML/CSS/JavaScript** - No frameworks needed
- **Vanilla JS** - Works in any modern browser
- **Responsive Design** - Works on desktop, tablet, and mobile

### Browser Support
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

### File Descriptions

**index.html**
- Main structure
- Links all files together
- Chat interface markup

**styles.css**
- All visual styling
- Responsive design
- Animations and transitions

**app.js**
- Chat interface logic
- Message handling
- Typing indicators
- User input processing

**mock-data.js**
- Sample creator business data
- Product performance metrics
- Follower/earnings trends
- Helper functions

**agent.js**
- Intent detection (keyword matching)
- Data retrieval logic
- Response template generation
- Business insights

## 🎯 What Questions Can Be Asked?

| Intent | Keywords | What It Shows |
|--------|----------|---------------|
| Top Products | "top product", "best product" | Best sellers by revenue |
| Overview | "how am i doing", "overview" | Full business summary |
| Follower Growth | "follower", "growing", "community" | Community growth metrics |
| Earnings | "earning", "money", "income" | Revenue and commissions |
| Top Posts | "best posts", "top posts" | Highest performing content |
| Recommendations | "what should i", "recommendation" | Personalized advice |
| Help | Any unmatched query | Available commands |

## 📈 Next Steps / Future Enhancements

### Phase 2: Enhanced Pattern Matching
- Use regex for more flexible question detection
- Handle typos and variations
- Support follow-up questions

### Phase 3: Add LLM Integration
- OpenAI GPT-3.5/4 for natural language
- Claude API for complex reasoning
- More conversational responses

### Phase 4: Multi-Agent System
- Multiple specialized agents
- Supervisor agent for orchestration
- Complex multi-step queries

### Phase 5: Real Data Integration
- Connect to actual database
- API integration with your platform
- Real-time data updates
- User authentication

### Additional Features to Consider
- Data visualizations (charts/graphs)
- Export conversation history
- Share insights via email/SMS
- Voice input support
- Multi-language support

## 🐛 Troubleshooting

**Chat doesn't load:**
- Make sure all 5 files are in the same folder
- Check browser console for errors (F12)
- Try a different browser

**Styling looks broken:**
- Ensure `styles.css` is in the same folder as `index.html`
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

**Agent doesn't respond:**
- Check if `mock-data.js` and `agent.js` are loaded
- Look for JavaScript errors in console
- Verify all files are in the same directory

**Quick actions don't work:**
- Make sure `app.js` is loaded after `agent.js`
- Check the script order in `index.html`

## 💡 Tips for Testing

1. **Test with Real Questions**: Ask questions as if you're a real creator
2. **Try Edge Cases**: Type gibberish, ask unrelated questions
3. **Test on Mobile**: Check responsiveness on phone/tablet
4. **Customize the Data**: Change values to test different scenarios
5. **Track What Doesn't Work**: Note questions that don't get good answers

## 📝 Development Notes

### Adding New Question Types

1. **Add intent detection** in `agent.js`:
```javascript
if (lowerMessage.includes('your_keyword')) {
  return 'your_intent';
}
```

2. **Add data fetching** in `fetchData()`:
```javascript
case 'your_intent':
  return data.yourDataSource;
```

3. **Add response template** in `generateResponse()`:
```javascript
case 'your_intent':
  return this.formatYourResponse(data);
```

4. **Create template function**:
```javascript
formatYourResponse(data) {
  let response = `Your custom template...`;
  return response;
}
```

### Modifying Styling

All styles are in `styles.css`. Key sections:
- `.chat-container` - Main chat box
- `.message` - Message bubbles
- `.quick-action-btn` - Quick action buttons
- `@media` queries - Responsive breakpoints

## 🤝 Contributing / Feedback

This is a POC, so feel free to:
- Modify any part of the code
- Add new features
- Change the design
- Test with different data

## 📄 License

This is a proof-of-concept for educational purposes. Use freely!

## 🎉 You're Ready!

Just open `index.html` and start chatting with your AI assistant!

Questions? Issues? Need help customizing? Let me know!