import { useAppSelector } from "../../../../store/hooks";
import { useVtipHistDataQuery } from "../useQuery/useVtipHistDataQuery";


export function useVtipHistData() {
  const payload = useAppSelector((state) => state.vtip_histchart.vtipPayload);
  const query = useVtipHistDataQuery(payload);
  return query;
}