import { useAppSelector } from "../../../store/hooks";
import { useVtipDataQuery } from "../../vtip_chart/hooks/useVtipDataQuery";

export function useVtipHistData() {
  const payload = useAppSelector((state) => state.vtip_histchart.vtipPayload);
  const query = useVtipDataQuery(payload);
  return query;
}