import { useAppSelector } from "../../../store/hooks";
import { useVtipDataQuery } from "./useVtipDataQuery";

export function useVtipData() {
  const payload = useAppSelector((state) => state.vtipchart.vtipPayload);
  const query = useVtipDataQuery(payload);
  return query;
}