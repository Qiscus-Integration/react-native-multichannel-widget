import { buildSecureSession, getSessionIdForInitiate } from './secure-session';
import type { SecureSession } from '../types';

describe('secure session handling', () => {
  const session: SecureSession = {
    id: 'session-123',
    appId: 'app-1',
    channelId: '126962',
    userId: 'user-1',
  };

  it('returns a session id only for the same app, user, and channel', () => {
    expect(
      getSessionIdForInitiate(session, {
        appId: 'app-1',
        userId: 'user-1',
        channelId: 126962,
      })
    ).toBe('session-123');

    expect(
      getSessionIdForInitiate(session, {
        appId: 'app-1',
        userId: 'user-1',
        channelId: 999999,
      })
    ).toBeUndefined();
  });

  it('persists the session returned for a secure channel', () => {
    expect(
      buildSecureSession(
        {
          is_secure: true,
          customer_room: {
            session_id: 'session-456',
            channel_id: 126962,
          },
        },
        { appId: 'app-1', userId: 'user-1' }
      )
    ).toEqual({
      id: 'session-456',
      appId: 'app-1',
      channelId: '126962',
      userId: 'user-1',
    });

    expect(
      buildSecureSession(
        {
          is_secure: false,
          customer_room: {
            session_id: 'session-789',
            channel_id: 126962,
          },
        },
        { appId: 'app-1', userId: 'user-1' }
      )
    ).toBeNull();
  });
});
