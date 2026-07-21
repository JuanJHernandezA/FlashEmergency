import axios, { AxiosError } from 'axios';
import type { IChatMessage } from '../types';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const REQUEST_TIMEOUT_MS = 30000;

const SYSTEM_PROMPT = `You are FlashEmergency AI, an emergency first aid assistant. Your role is to help people during emergencies by providing clear, step-by-step first aid instructions.

CRITICAL BEHAVIOR - GUIDED TRIAGE:
When a user describes an emergency, you MUST first ask brief triage questions to provide better guidance. Ask ONE question at a time. Key questions include:
- Is the person conscious?
- Is the person breathing?
- Is there severe bleeding?
- What exactly happened?
- How long ago did this happen?
- Is the person an adult or a child?

Do NOT ask all questions at once. Ask the most critical one first based on the situation described. After gathering enough information (2-3 answers), provide your full emergency guidance.

If the situation sounds life-threatening from the start, provide immediate critical instructions FIRST, then ask follow-up questions.

Rules you MUST follow:
- Stay calm and provide concise, actionable instructions.
- Always recommend contacting emergency services.
- Never diagnose diseases or medical conditions.
- Never prescribe medication.
- Never replace a doctor or medical professional.
- Clearly state when immediate professional assistance is required.
- Give step-by-step instructions numbered clearly.
- Include safety precautions and things to avoid.
- Format your detailed response with these sections when applicable:
  1. **Immediate Actions** - What to do right now
  2. **Safety Precautions** - How to stay safe while helping
  3. **Things to Avoid** - What NOT to do
  4. **Next Steps** - What to do after initial response

Always end your detailed response with a reminder to seek professional medical help.`;

function getApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) {
    throw new Error('Groq API key is not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }
  return key;
}

// OpenAI-compatible message interface
interface IGroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// OpenAI-compatible chat completion response
interface IGroqChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string;
  };
  finish_reason: string;
}

interface IGroqChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: IGroqChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface IGroqErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

let activeController: AbortController | null = null;

export function cancelActiveRequest(): void {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}

export async function sendMessage(
  messages: IChatMessage[],
  userMessage: string,
  options?: { signal?: AbortSignal; country?: string; emergencyNumber?: string; language?: string },
): Promise<string> {
  // Cancel any previous in-flight request
  cancelActiveRequest();

  const controller = new AbortController();
  activeController = controller;

  if (options?.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  const apiKey = getApiKey();

  // Build system prompt with country context
  let systemContent = SYSTEM_PROMPT;
  if (options?.country && options?.emergencyNumber) {
    systemContent += `\n\nIMPORTANT CONTEXT:\n- The user is located in: ${options.country}\n- The local emergency number is: ${options.emergencyNumber}\n- Always recommend calling ${options.emergencyNumber} (not 911 unless that IS the local number).`;
  }
  if (options?.language) {
    systemContent += `\n\nRespond in the following language: ${options.language === 'es' ? 'Spanish' : 'English'}.`;
  }

  // Build OpenAI-compatible message array
  const groqMessages: IGroqMessage[] = [
    { role: 'system', content: systemContent },
  ];

  messages.forEach((msg) => {
    groqMessages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    });
  });

  groqMessages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    const response = await axios.post<IGroqChatCompletionResponse>(
      `${GROQ_BASE_URL}/chat/completions`,
      {
        model: GROQ_MODEL,
        messages: groqMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS,
      },
    );

    const text = response.data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('No response received from AI. Please try again.');
    }

    return text;
  } catch (err) {
    if (axios.isCancel(err)) {
      throw new Error('Request was cancelled.');
    }

    if (err instanceof AxiosError) {
      const status = err.response?.status;
      const errorBody = err.response?.data as IGroqErrorResponse | undefined;
      const serverMessage = errorBody?.error?.message;

      if (status === 429) {
        throw new Error('Too many requests. Please wait a moment before trying again.');
      }

      if (status === 401) {
        throw new Error('Invalid API key. Check your VITE_GROQ_API_KEY.');
      }

      if (status === 403) {
        throw new Error('Access denied. Your API key may lack permissions.');
      }

      if (status === 503 || status === 502) {
        throw new Error('AI service is temporarily unavailable. Please try again shortly.');
      }

      if (err.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }

      if (serverMessage) {
        throw new Error(serverMessage);
      }
    }

    throw err;
  } finally {
    if (activeController === controller) {
      activeController = null;
    }
  }
}
