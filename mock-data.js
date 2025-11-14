// mock-data.js
// This file contains sample data for a group chat
// In a real app, this would come from your database

const mockGroupChatData = {
  // Creator info
  creator: {
    name: "Dave Chan",
    username: "@davechan",
    avatar: "DC",
    followers: 1234
  },

  // Chat messages from creator with follower replies
  chatMessages: [
    {
      id: 1,
      timestamp: "Today, 9:30 AM",
      content: "Ok team - the new Zara collection is a good one and I just found this dress (that is very Valentino) with a nautical style collar. ZARA WOMAN COLLECTION Short dress made of cotton and 15% linen. Square bib neckline and long sleeves...",
      reactions: {
        heart: 12,
        fire: 12,
        smile: 12,
        hundred: 12,
        thumbsUp: 12
      },
      replies: [
        {
          id: 101,
          username: "JessicaM",
          avatar: "JM",
          content: "I need some swim suits it's summer here already.",
          replyCount: 3,
          reactions: {
            heart: 12
          }
        },
        {
          id: 102,
          username: "SarahK",
          avatar: "SK",
          content: "Can't wait please share discount code!",
          replyCount: 2,
          reactions: {
            heart: 12
          }
        }
      ]
    },
    {
      id: 2,
      timestamp: "Today, 11:15 AM",
      content: "Hey everyone! Quick question - what topics would you like me to cover this week? Fashion hauls, styling tips, or seasonal favorites? Drop your thoughts below! 👇",
      reactions: {
        heart: 44,
        fire: 50,
        smile: 208,
        hundred: 12,
        thumbsUp: 100
      },
      replies: [
        {
          id: 201,
          username: "EmilyR",
          avatar: "ER",
          content: "Styling tips please! Especially for work outfits.",
          replyCount: 0,
          reactions: {
            heart: 8,
            thumbsUp: 5
          }
        },
        {
          id: 202,
          username: "MikeT",
          avatar: "MT",
          content: "Would love to see seasonal favorites for fall!",
          replyCount: 1,
          reactions: {
            heart: 15
          }
        },
        {
          id: 203,
          username: "LisaW",
          avatar: "LW",
          content: "Fashion hauls are always my favorite!",
          replyCount: 0,
          reactions: {
            heart: 6,
            fire: 3
          }
        }
      ]
    },
    {
      id: 3,
      timestamp: "Yesterday, 3:45 PM",
      content: "Just dropped a new video on my favorite fall accessories. Check it out and let me know what you think! Also, which piece should I style next? 🍂",
      reactions: {
        heart: 89,
        fire: 120,
        smile: 45,
        hundred: 78,
        thumbsUp: 34
      },
      replies: [
        {
          id: 301,
          username: "AmyP",
          avatar: "AP",
          content: "The leather bag is gorgeous! Where can I find it?",
          replyCount: 0,
          reactions: {
            heart: 4
          }
        },
        {
          id: 302,
          username: "TomH",
          avatar: "TH",
          content: "Great video! Can you do one on winter boots next?",
          replyCount: 2,
          reactions: {
            heart: 11,
            thumbsUp: 8
          }
        }
      ]
    },
    {
      id: 4,
      timestamp: "Yesterday, 7:20 PM",
      content: "Remember: confidence is the best accessory you can wear. What made you feel confident today? Share below! 💪✨",
      reactions: {
        heart: 156,
        fire: 89,
        smile: 234,
        hundred: 45,
        thumbsUp: 67
      },
      replies: [
        {
          id: 401,
          username: "RachelB",
          avatar: "RB",
          content: "Wore that dress you recommended last week. Got so many compliments!",
          replyCount: 1,
          reactions: {
            heart: 23,
            fire: 5
          }
        },
        {
          id: 402,
          username: "MarkJ",
          avatar: "MJ",
          content: "Finally tried that styling tip with layering. Game changer!",
          replyCount: 0,
          reactions: {
            heart: 18,
            hundred: 3
          }
        },
        {
          id: 403,
          username: "NinaL",
          avatar: "NL",
          content: "Love this positivity! Keep inspiring us Dave!",
          replyCount: 0,
          reactions: {
            heart: 34
          }
        }
      ]
    }
  ]
};

// Helper function to get chat data for analysis
function getChatData(queryType) {
  const messages = mockGroupChatData.chatMessages;
  
  switch(queryType) {
    case 'all_messages':
      return messages;
    
    case 'all_replies':
      return messages.flatMap(msg => msg.replies);
    
    case 'most_engaged':
      return messages
        .sort((a, b) => {
          const aTotal = Object.values(a.reactions).reduce((sum, val) => sum + val, 0);
          const bTotal = Object.values(b.reactions).reduce((sum, val) => sum + val, 0);
          return bTotal - aTotal;
        })[0];
    
    case 'recent_questions':
      const allReplies = messages.flatMap(msg => msg.replies);
      return allReplies.filter(reply => reply.content.includes('?'));
    
    default:
      return messages;
  }
}

// No export needed for browser - data is available globally