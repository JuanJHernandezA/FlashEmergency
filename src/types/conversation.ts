export interface IConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface IConversation {
  id: string;
  title: string;
  messages: IConversationMessage[];
  createdAt: string;
  updatedAt: string;
  language: string;
}
