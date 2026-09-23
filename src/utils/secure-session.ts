import type { SecureSession } from '../types';

type SessionContext = {
  appId: string;
  userId: string;
  channelId?: string | number;
};

type InitiateChatResponse = {
  is_secure?: boolean;
  customer_room?: {
    session_id?: string | null;
    channel_id?: string | number | null;
  };
};

function normalizeChannelId(channelId: string | number | null | undefined) {
  if (channelId == null) return undefined;

  const normalized = String(channelId).trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function getSessionIdForInitiate(
  session: SecureSession | null | undefined,
  context: SessionContext
) {
  if (
    session == null ||
    session.id.length === 0 ||
    session.appId !== context.appId ||
    session.userId !== context.userId
  ) {
    return undefined;
  }

  const sessionChannelId = normalizeChannelId(session.channelId);
  const contextChannelId = normalizeChannelId(context.channelId);

  if (sessionChannelId == null || sessionChannelId !== contextChannelId) {
    return undefined;
  }

  return session.id;
}

export function buildSecureSession(
  response: InitiateChatResponse,
  context: Omit<SessionContext, 'channelId'>
): SecureSession | null {
  const sessionId = response.customer_room?.session_id;
  const channelId = normalizeChannelId(response.customer_room?.channel_id);

  if (
    response.is_secure !== true ||
    sessionId == null ||
    sessionId.length === 0 ||
    channelId == null
  ) {
    return null;
  }

  return {
    id: sessionId,
    appId: context.appId,
    channelId,
    userId: context.userId,
  };
}
