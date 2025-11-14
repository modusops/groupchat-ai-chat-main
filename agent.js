// agent.js
// This is the "brain" that processes user queries and generates responses
// Phase 1: Template-Based (No LLM needed)

class GroupChatAssistant {
  constructor(chatData) {
    this.chatData = chatData;
  }

  // Main function: Process a user's question
  processQuery(userMessage) {
    // Step 1: Figure out what the user is asking about
    const intent = this.detectIntent(userMessage);
    
    // Step 2: Get the relevant data
    const data = this.fetchData(intent);
    
    // Step 3: Generate a natural-sounding response
    const response = this.generateResponse(intent, data);
    
    return response;
  }

  // Detect what the user is asking about
  // This is a simple pattern matching - looking for keywords
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for different question patterns
    if (lowerMessage.includes('summarize') || 
        lowerMessage.includes('summary') ||
        lowerMessage.includes('discussion')) {
      return 'summarize_discussion';
    }
    
    if (lowerMessage.includes('question') || 
        lowerMessage.includes('asking') ||
        lowerMessage.includes('want to know')) {
      return 'follower_questions';
    }
    
    if (lowerMessage.includes('topic') && lowerMessage.includes('suggest')) {
      return 'topic_suggestions';
    }
    
    if (lowerMessage.includes('most liked') || 
        lowerMessage.includes('most popular') ||
        lowerMessage.includes('highest engagement') ||
        (lowerMessage.includes('topic') && lowerMessage.includes('liked'))) {
      return 'most_liked_topic';
    }
    
    if (lowerMessage.includes('engagement') || 
        lowerMessage.includes('active') ||
        lowerMessage.includes('participation')) {
      return 'engagement_stats';
    }
    
    // Default: if we don't understand, return general help
    return 'help';
  }

  // Fetch the relevant data based on what the user asked
  fetchData(intent) {
    const messages = this.chatData.chatMessages;
    
    switch(intent) {
      case 'summarize_discussion':
        return {
          messages: messages,
          totalMessages: messages.length,
          totalReplies: messages.reduce((sum, msg) => sum + (msg.replies?.length || 0), 0),
          recentMessages: messages.slice(0, 2)
        };
      
      case 'follower_questions':
        const questions = [];
        messages.forEach(msg => {
          msg.replies?.forEach(reply => {
            if (reply.content.includes('?')) {
              questions.push({
                username: reply.username,
                question: reply.content,
                messageContext: msg.content.substring(0, 50) + '...'
              });
            }
          });
        });
        return questions;
      
      case 'most_liked_topic':
        const sortedByReactions = messages.map(msg => {
          const totalReactions = Object.values(msg.reactions).reduce((sum, val) => sum + val, 0);
          return { ...msg, totalReactions };
        }).sort((a, b) => b.totalReactions - a.totalReactions);
        return sortedByReactions[0];
      
      case 'topic_suggestions':
        return this.generateTopicSuggestions(messages);
      
      case 'engagement_stats':
        return this.calculateEngagementStats(messages);
      
      default:
        return null;
    }
  }

  // Generate topic suggestions based on engagement patterns
  generateTopicSuggestions(messages) {
    const suggestions = [];
    
    // Analyze what types of content get the most replies
    const topicKeywords = ['fashion', 'style', 'outfit', 'accessory', 'seasonal', 'haul', 'tip'];
    const engagementByKeyword = {};
    
    messages.forEach(msg => {
      const lowerContent = msg.content.toLowerCase();
      topicKeywords.forEach(keyword => {
        if (lowerContent.includes(keyword)) {
          if (!engagementByKeyword[keyword]) {
            engagementByKeyword[keyword] = 0;
          }
          engagementByKeyword[keyword] += (msg.replies?.length || 0);
        }
      });
    });
    
    // Generate suggestions based on follower questions
    suggestions.push({
      topic: 'Work outfit styling',
      reason: 'Multiple followers asked for professional outfit ideas'
    });
    
    suggestions.push({
      topic: 'Seasonal favorites for fall',
      reason: 'High engagement on seasonal content'
    });
    
    suggestions.push({
      topic: 'Accessory styling guide',
      reason: 'Recent video on accessories got great feedback'
    });
    
    return suggestions;
  }
  
  // Calculate engagement statistics
  calculateEngagementStats(messages) {
    const totalReactions = messages.reduce((sum, msg) => {
      return sum + Object.values(msg.reactions).reduce((s, v) => s + v, 0);
    }, 0);
    
    const totalReplies = messages.reduce((sum, msg) => sum + (msg.replies?.length || 0), 0);
    
    const avgReactionsPerPost = totalReactions / messages.length;
    const avgRepliesPerPost = totalReplies / messages.length;
    
    return {
      totalMessages: messages.length,
      totalReactions,
      totalReplies,
      avgReactionsPerPost: avgReactionsPerPost.toFixed(1),
      avgRepliesPerPost: avgRepliesPerPost.toFixed(1)
    };
  }

  // Generate natural-sounding responses using templates
  generateResponse(intent, data) {
    switch(intent) {
      case 'summarize_discussion':
        return this.formatSummaryResponse(data);
      
      case 'follower_questions':
        return this.formatQuestionsResponse(data);
      
      case 'most_liked_topic':
        return this.formatMostLikedResponse(data);
      
      case 'topic_suggestions':
        return this.formatTopicSuggestionsResponse(data);
      
      case 'engagement_stats':
        return this.formatEngagementStatsResponse(data);
      
      case 'help':
      default:
        return this.formatHelpResponse();
    }
  }

  // Template: Summary Response
  formatSummaryResponse(data) {
    let response = `📊 **Today's Discussion Summary**\n\n`;
    response += `You've posted **${data.totalMessages} messages** today with **${data.totalReplies} follower replies**.\n\n`;
    
    response += `**Recent Topics:**\n`;
    data.recentMessages.forEach((msg, index) => {
      const preview = msg.content.substring(0, 60) + '...';
      const reactionCount = Object.values(msg.reactions).reduce((sum, val) => sum + val, 0);
      response += `${index + 1}. ${preview}\n`;
      response += `   💬 ${msg.replies?.length || 0} replies, ❤️ ${reactionCount} reactions\n\n`;
    });
    
    response += `💡 **Insight:** Great engagement! Your community is actively participating in discussions.`;
    
    return response;
  }

  // Template: Questions Response
  formatQuestionsResponse(questions) {
    let response = `❓ **Follower Questions**\n\n`;
    
    if (questions.length === 0) {
      response += `No direct questions found in recent replies. Your followers are mostly sharing thoughts and feedback!\n\n`;
      response += `💡 **Tip:** Consider asking open-ended questions to encourage more interaction.`;
      return response;
    }
    
    response += `Your followers have asked ${questions.length} questions:\n\n`;
    
    questions.slice(0, 5).forEach((q, index) => {
      response += `**${index + 1}. ${q.username}:**\n`;
      response += `"${q.question}"\n`;
      response += `_Context: ${q.messageContext}_\n\n`;
    });
    
    if (questions.length > 5) {
      response += `...and ${questions.length - 5} more questions.\n\n`;
    }
    
    response += `💡 **Tip:** Consider addressing these questions in your next post or video!`;
    
    return response;
  }

  // Template: Most Liked Response
  formatMostLikedResponse(data) {
    const preview = data.content.substring(0, 100);
    
    let response = `🌟 **Most Liked Topic**\n\n`;
    response += `Your most engaged post was:\n\n`;
    response += `"${preview}..."\n\n`;
    response += `**Engagement:**\n`;
    response += `• ${data.totalReactions} total reactions\n`;
    response += `• ${data.replies?.length || 0} replies\n`;
    response += `• Posted: ${data.timestamp}\n\n`;
    
    const topReaction = Object.entries(data.reactions)
      .sort((a, b) => b[1] - a[1])[0];
    const reactionEmojis = { heart: '❤️', fire: '🔥', smile: '😊', hundred: '💯', thumbsUp: '👍' };
    
    response += `💡 **Insight:** The ${reactionEmojis[topReaction[0]]} reaction was most popular (${topReaction[1]} reactions). Your community loves this type of content!`;
    
    return response;
  }

  // Template: Topic Suggestions Response
  formatTopicSuggestionsResponse(suggestions) {
    let response = `💡 **Topic Suggestions for Your Next Chat**\n\n`;
    response += `Based on follower engagement and questions, here are some great topics:\n\n`;
    
    suggestions.forEach((suggestion, index) => {
      response += `**${index + 1}. ${suggestion.topic}**\n`;
      response += `_Why: ${suggestion.reason}_\n\n`;
    });
    
    response += `🎯 **Pro Tip:** Combine multiple follower interests into a single comprehensive post for maximum engagement!`;
    
    return response;
  }

  // Template: Engagement Stats Response
  formatEngagementStatsResponse(data) {
    let response = `📈 **Engagement Statistics**\n\n`;
    response += `**Overall Activity:**\n`;
    response += `• ${data.totalMessages} chat messages posted\n`;
    response += `• ${data.totalReplies} total replies from followers\n`;
    response += `• ${data.totalReactions} total reactions\n\n`;
    
    response += `**Averages:**\n`;
    response += `• ${data.avgRepliesPerPost} replies per post\n`;
    response += `• ${data.avgReactionsPerPost} reactions per post\n\n`;
    
    response += `💡 **Insight:** `;
    if (parseFloat(data.avgRepliesPerPost) > 2) {
      response += `Excellent! Your followers are highly engaged. Keep the conversation going!`;
    } else {
      response += `Try asking more open-ended questions to encourage more replies and discussion.`;
    }
    
    return response;
  }

  // Template: Help Response
  formatHelpResponse() {
    let response = `👋 Hi! I'm your Group Chat AI assistant.\n\n`;
    response += `I can help you understand your chat discussions and follower engagement. Try asking me:\n\n`;
    response += `• "Summarize today's discussion"\n`;
    response += `• "What questions do followers have?"\n`;
    response += `• "Suggest topics for next chat"\n`;
    response += `• "What topic was most liked?"\n`;
    response += `• "Show me engagement stats"\n\n`;
    response += `What would you like to know?`;
    
    return response;
  }
}

// No export needed for browser - class is available globally