import { useAppSelector } from "../../../../../store/hooks";
import { useVtipDataQuery } from "../useQuery/useVtipDataQuery";


export function useVtipData(enabled?: boolean) {
  const payload = useAppSelector((state) => state.vtipchart.vtipPayload);
  const query = useVtipDataQuery(payload, enabled);
  return query;
}