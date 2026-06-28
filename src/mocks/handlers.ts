import { http, HttpResponse, delay } from 'msw';
import { mockConversations, CURRENT_AGENT } from './data/conversations';
import type { Conversation } from '../types';

let conversations: Conversation[] = structuredClone(mockConversations);
let simulateFailures = true;

function randomDelay(): number {
  return 200 + Math.random() * 300;
}

function shouldFail(): boolean {
  return simulateFailures && Math.random() < 0.3;
}

export const handlers = [
  http.get('/api/conversations', async () => {
    await delay(randomDelay());
    const active = conversations.filter((c) => c.status !== 'resolved');
    return HttpResponse.json(active);
  }),

  http.get('/api/conversations/:id', async ({ params }) => {
    await delay(150 + Math.random() * 150);
    const conversation = conversations.find((c) => c.id === params.id);
    if (!conversation) {
      return HttpResponse.json(
        { error: 'not_found', message: 'Conversation not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(conversation);
  }),

  http.patch('/api/conversations/:id/assign', async ({ params }) => {
    await delay(randomDelay());
    if (shouldFail()) {
      return HttpResponse.json(
        { error: 'internal_server_error', message: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
    const conversation = conversations.find((c) => c.id === params.id);
    if (!conversation) {
      return HttpResponse.json(
        { error: 'not_found', message: 'Conversation not found' },
        { status: 404 }
      );
    }
    conversation.status = 'assigned';
    conversation.assignedTo = CURRENT_AGENT;
    return HttpResponse.json({ success: true });
  }),

  http.patch('/api/conversations/:id/resolve', async ({ params }) => {
    await delay(randomDelay());
    if (shouldFail()) {
      return HttpResponse.json(
        { error: 'internal_server_error', message: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
    const conversation = conversations.find((c) => c.id === params.id);
    if (!conversation) {
      return HttpResponse.json(
        { error: 'not_found', message: 'Conversation not found' },
        { status: 404 }
      );
    }
    conversation.status = 'resolved';
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/toggle-failures', async () => {
    simulateFailures = !simulateFailures;
    return HttpResponse.json({ simulateFailures });
  }),

  http.get('/api/failure-status', async () => {
    return HttpResponse.json({ simulateFailures });
  }),
];
