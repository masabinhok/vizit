# 🤖 Vizit Chatbot Setup Guide

## Overview
The Vizit Chatbot is an AI-powered assistant that helps users learn algorithms through real-time conversations. It uses Google's Gemini API to provide intelligent, context-aware responses about algorithms, data structures, and CS concepts.

## ✨ Features
- 💬 **Real-time Chat Interface** - Floating chatbot widget on all pages
- 🎨 **Dark/Light Theme Support** - Matches Vizit's theme preference
- 📱 **Responsive Design** - Works on desktop and mobile
- 🚀 **Smart System Prompt** - Expertly crafted to guide algorithm learning
- 💾 **Conversation History** - Maintains context across messages
- ⚡ **Fast Response** - Uses Google's Gemini 2.0 Flash model
- 🛡️ **Error Handling** - Graceful fallbacks and user-friendly messages

## 🔧 Setup Instructions

### Step 1: Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### Step 2: Update Environment Variables
1. Open `.env.local` file in the project root
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

### Step 3: Install Dependencies
```bash
npm install
```

The `@google/generative-ai` package has been added to `package.json`.

### Step 4: Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and look for the chatbot button in the bottom-right corner!

## 📁 File Structure

```
vizit/
├── utils/
│   └── gemini-service.ts          # Gemini API integration
├── contexts/
│   ├── ThemeContext.tsx           # Theme management
│   └── ChatbotContext.tsx         # Chatbot state management
├── components/
│   ├── ChatbotWidget.tsx          # Main chatbot UI component
│   └── ...
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # Chat API endpoint
│   ├── layout.tsx                 # Updated with chatbot provider
│   └── ...
├── .env.local                     # API key configuration
└── ...
```

## 🎯 System Prompt Highlights

The chatbot uses a sophisticated system prompt that:
- 🎓 Focuses on algorithm education and CS concepts
- 📊 Helps explain Big O notation and complexity analysis
- 🛠️ Provides guidance on using Vizit's features
- 💡 Offers problem-solving help without direct solutions
- 🌟 Encourages hands-on learning through visualization
- ✅ Redirects off-topic questions politely

## 💬 Example Questions to Ask

### Algorithm Education
- "How does Bubble Sort work?"
- "What's the difference between BFS and DFS?"
- "Can you explain Big O notation?"
- "How do stacks and queues differ?"

### Complexity Analysis
- "What's the time complexity of Merge Sort?"
- "Why is quicksort faster than bubble sort?"
- "What does O(n²) mean?"

### Platform Guidance
- "How do I use the speed control in Vizit?"
- "How can I visualize binary search?"
- "What algorithm should I learn first?"

### Learning Tips
- "What's the best way to learn algorithms?"
- "How long does it take to master DSA?"
- "What should I practice after bubble sort?"

## 🔑 API Details

### POST `/api/chat`
Send a message and get a response from the chatbot.

**Request:**
```json
{
  "message": "How does Bubble Sort work?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bubble Sort works by..."
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## ⚙️ Configuration

### Model Settings (in `app/api/chat/route.ts`)
- **Model**: `gemini-2.0-flash` (fast, efficient)
- **Max Tokens**: 1024 (reasonable response length)
- **Temperature**: 0.7 (balanced creativity & accuracy)
- **Top P**: 0.95 (diversity in responses)

### Styling
- Uses Tailwind CSS for styling
- Integrates with existing Vizit theme system
- Supports dark and light modes seamlessly

## 🐛 Troubleshooting

### "Gemini API key is not configured"
- **Solution**: Check if `.env.local` exists and has the correct API key
- Make sure the key is not wrapped in quotes

### "Rate limit exceeded"
- **Solution**: Wait a moment before sending another message
- Gemini has rate limits on free tier

### Chatbot not responding
- **Solution**: 
  1. Check browser console for errors (F12)
  2. Verify API key is valid
  3. Check if `/api/chat` is accessible (try visiting http://localhost:3000/api/chat in browser)

### Styling issues
- **Solution**: Clear browser cache (Ctrl+Shift+Delete)
- Restart development server (npm run dev)

## 🚀 Deployment

### For Vercel
1. Set environment variable in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` with your key
   - Redeploy

### For Other Platforms
1. Set the same environment variable in your hosting platform
2. Ensure `.env.local` is NOT committed to git
3. Add `.env.local` to `.gitignore`

## 📊 Usage Analytics

Currently, the chatbot stores conversation history in memory. For production:
- Consider adding database persistence
- Track chat metrics and popular questions
- Implement user authentication if needed

## 🔐 Security Notes

- `NEXT_PUBLIC_GEMINI_API_KEY` is publicly accessible (necessary for browser API calls)
- For production, consider using a backend proxy
- Never commit `.env.local` to git
- Rotate API keys regularly

## 🎨 Customization

### Changing the System Prompt
Edit `app/api/chat/route.ts` and update the `SYSTEM_PROMPT` variable.

### Changing Chatbot Appearance
Edit `components/ChatbotWidget.tsx`:
- Change colors in className strings
- Modify button position (bottom-6 right-6)
- Adjust chat window size (w-96 h-[600px])

### Changing Model
Replace `gemini-2.0-flash` with:
- `gemini-2.0-pro` (more capable, slower)
- `gemini-1.5-flash` (older version)
- `gemini-1.5-pro` (most capable)

## 📚 Resources

- [Google Gemini API Docs](https://ai.google.dev/gemini-api)
- [Gemini JavaScript SDK](https://github.com/google/generative-ai-js)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vizit Documentation](./README.md)

## 💡 Future Enhancements

- [ ] Add streaming responses for longer answers
- [ ] Implement conversation export (PDF/JSON)
- [ ] Add suggested questions based on current page
- [ ] Integrate with user profiles for personalized responses
- [ ] Add voice input/output
- [ ] Multi-language support
- [ ] Analytics dashboard

## 🤝 Contributing

Found a bug or have a suggestion for the chatbot? 
- Create an issue on [GitHub](https://github.com/masabinhok/vizit/issues)
- Submit a PR with improvements
- Share feedback in discussions

---

**Happy Learning! 🎓** 

If you have any questions, feel free to ask the chatbot or check the [Vizit GitHub](https://github.com/masabinhok/vizit).
