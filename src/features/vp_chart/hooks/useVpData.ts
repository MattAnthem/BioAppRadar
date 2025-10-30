import { useAppSelector } from "../../../store/hooks";
import { useVpDataQuery } from "./useVpDataQuery";

export function useVpData() {
   const payload = useAppSelector((state) => state.vpchart.vpPayload);
   const query = useVpDataQuery(payload);
   return query;
}