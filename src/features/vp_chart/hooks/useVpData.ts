import { useAppSelector } from "../../../store/hooks";
import { useVpDataQuery } from "./useVpDataQuery";

export function useVpData(enabled?: boolean) {
   const payload = useAppSelector((state) => state.vpchart.vpPayload);
   const query = useVpDataQuery(payload, enabled);
   return query;
}