import axios from 'axios';
import { useAtomCallback } from 'jotai/utils';
import { appIdAtom } from '../state';

export function useGetSessions() {
  const cb = useAtomCallback(async (get): Promise<boolean> => {
    const appId = get(appIdAtom);
    const url = `https://qismo.qiscus.com/${appId}/get_session`;

    const resp = await axios.get(url).then((r) => r.data);
    return resp.data.is_sessional;
  });

  return cb;
}
