import { qiscus } from '../state';

export function generatePostbackMessage({
  roomId,
  content,
  payload,
}: {
  roomId: number;
  content: string;
  payload: Record<string, unknown>;
}) {
  let comment = qiscus.generateMessage({ roomId, text: content });
  comment.payload = payload;
  // @ts-ignore
  comment.type = 'button_postback_response';

  return comment;
}
