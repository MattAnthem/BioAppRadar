import { useAppSelector } from "../../../store/hooks";
import { useVpDataQuery } from "../../vp_chart/hooks/useVpDataQuery";

export function useVpHistData() {
   const payload = useAppSelector((state) => state.vp_histchart.vpPayload);
   const query = useVpDataQuery(payload);
   return query;
}