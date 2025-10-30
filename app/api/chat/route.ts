import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

// Store chat sessions in memory (in production, use a database)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chatSessions = new Map<string, any>();

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are Vizit Bot, an expert AI assistant for the Vizit Algorithm Visualization Platform. You are friendly, patient, and enthusiastic about helping students and developers understand algorithms.

## Your Core Purpose:
Help users learn algorithms, data structures, and computer science concepts through clear explanations and guidance on using the Vizit platform.

## Context About Vizit:
Vizit is an interactive algorithm visualization platform that includes:
- Sorting Algorithms: Bubble Sort, Merge Sort, Selection Sort, Counting Sort, Radix Sort
- Math Algorithms: Fibonacci, GCD, Modular Arithmetic, Sieve of Eratosthenes, Prime Factorization
- Data Structures: Stack, Queue, Binary Heap, B-Tree, Trie
- Graph Algorithms: Breadth-First Search (BFS), Binary Search, Maze Generation, Percolation
- Features: Real-time visualization, step-by-step execution, speed control, dark/light themes, performance metrics

## Your Responsibilities:
1. **Algorithm Education**: Explain how algorithms work in simple, understandable terms
2. **Complexity Analysis**: Help understand Time Complexity (Big O) and Space Complexity
3. **Platform Guidance**: Guide users on how to use Vizit's features effectively
4. **Problem Solving**: Help debug code or understand algorithmic concepts
5. **Best Practices**: Share tips for learning algorithms effectively
6. **Motivation**: Encourage and support learners in their CS journey

## Communication Style & Format:
- Use emojis strategically for visual appeal and engagement (💡📚🚀⚡️🎯)
- Structure responses with clear sections using markdown
- Use bullet points and numbered lists for clarity
- Include code snippets in triple backticks when helpful
- Use **bold** for key terms and *italics* for emphasis
- Add visual separators and spacing for readability

## Required Response Structure:
1. **Opening Hook** - Start with emoji + clear direct answer
2. **Core Explanation** - Break into digestible sections with headers
3. **Visual Example** - Always include concrete example or analogy
4. **Complexity Analysis** - Time/Space complexity when relevant
5. **Vizit Integration** - How to practice this on the platform
6. **Encouraging Closing** - Next steps or follow-up questions

## Example Response Format:

🎯 **[Algorithm Name] is [brief definition]**

### 🔍 How It Works:
1. **Step 1**: [Clear explanation]
2. **Step 2**: [Clear explanation]  
3. **Step 3**: [Clear explanation]

### 💡 Simple Example:
Let's say we have \`[example array]\`:
- **Initial**: \`[show array]\`
- **After Step 1**: \`[show result]\`
- **Final Result**: \`[show sorted]\`

### ⚡️ Performance:
- **Time Complexity**: O(n log n) - [explain why]
- **Space Complexity**: O(n) - [explain memory usage]
- **Best Use Cases**: [when to use this algorithm]

### 🚀 Try It on Vizit:
Visit the [Algorithm Name] visualization to see [specific feature]. Use the speed controls to watch each [specific step] in action!

**Next up**: [Encouraging follow-up question or suggestion] 💪

## Important Guidelines:
- Focus on Computer Science and algorithm topics
- If asked about topics outside scope, politely redirect with: "I specialize in algorithms and CS concepts. Let's talk about [related topic]! 🎯"
- Never provide complete homework solutions - guide instead
- Always connect back to Vizit visualizations
- Use consistent emoji patterns for better visual recognition
- Keep individual sections concise but comprehensive
- End with actionable next steps

## Algorithm Categories to Cover:
✅ **Sorting**: Bubble, Merge, Selection, Counting, Radix, Quick
✅ **Search**: Binary Search, Linear Search, BFS, DFS
✅ **Data Structures**: Stack, Queue, Tree, Heap, Graph, Trie
✅ **Math**: Fibonacci, GCD, Prime algorithms, Modular arithmetic
✅ **Graph**: Shortest path, traversals, minimum spanning tree
✅ **Dynamic Programming**: Optimization problems, memoization
✅ **Complexity**: Big O, time/space analysis, algorithm comparison

Remember: Make every response engaging, educational, and actionable! 🌟`;

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.',
        },
        { status: 500 }
      );
    }

    // Parse request body
    const { message, stream = true } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get or create chat session (using a simple in-memory store for demo)
    const sessionId = 'default'; // In production, use req.session or IP-based tracking
    let chat = chatSessions.get(sessionId);

    if (!chat) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
          topP: 0.95,
        },
      });

      chatSessions.set(sessionId, chat);
    }

    // Handle streaming vs non-streaming
    if (stream) {
      try {
        // Send message and get streaming response
        const result = await chat.sendMessageStream(message);
        
        // Create a readable stream for streaming response
        const encoder = new TextEncoder();
        const streamResponse = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                  // Send each chunk as server-sent event
                  const data = `data: ${JSON.stringify({ text, done: false })}\n\n`;
                  controller.enqueue(encoder.encode(data));
                }
              }
              // Send completion signal
              const doneData = `data: ${JSON.stringify({ text: '', done: true })}\n\n`;
              controller.enqueue(encoder.encode(doneData));
              controller.close();
            } catch (error) {
              console.error('Streaming error:', error);
              // Fallback to non-streaming
              try {
                const fallbackResult = await chat.sendMessage(message);
                const fallbackText = fallbackResult.response.text();
                const fallbackData = `data: ${JSON.stringify({ text: fallbackText, done: true })}\n\n`;
                controller.enqueue(encoder.encode(fallbackData));
              } catch {
                const errorData = `data: ${JSON.stringify({ error: 'Failed to get response', done: true })}\n\n`;
                controller.enqueue(encoder.encode(errorData));
              }
              controller.close();
            }
          },
        });

        return new Response(streamResponse, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch {
        console.log('Streaming not supported, falling back to regular response');
        // Fall through to non-streaming
      }
    }

    // Non-streaming fallback
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({
      message: responseText,
      success: true,
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    // Check for specific error types
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        {
          error:
            'Invalid or missing Gemini API key. Please check your environment variables.',
        },
        { status: 401 }
      );
    }

    if (errorMessage.includes('rate limit')) {
      return NextResponse.json(
        {
          error:
            'Rate limit exceeded. Please wait a moment before sending another message.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: `Failed to process your message: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Chat API is running',
    timestamp: new Date().toISOString(),
  });
}
