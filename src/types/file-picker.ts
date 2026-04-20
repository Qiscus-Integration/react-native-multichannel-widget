/**
 * Minimal file descriptor used internally by the widget attachment flow.
 */
export type PickedFile = {
  /** Local URI to the file. */
  uri: string;
  /** MIME type, e.g. "image/jpeg" or "application/pdf". */
  type: string | null;
  /** File name with extension, e.g. "photo.jpg". */
  name: string | null;
};
