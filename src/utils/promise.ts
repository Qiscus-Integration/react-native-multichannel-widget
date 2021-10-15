export async function p_try<T>(fn: () => Promise<T>): Promise<[T?, unknown?]> {
  try {
    const res = await fn();
    return [res, undefined];
  } catch (e) {
    return [undefined, e];
  }
}
