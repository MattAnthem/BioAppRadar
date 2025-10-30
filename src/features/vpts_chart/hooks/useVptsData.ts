import { useAppSelector } from "../../../store/hooks";
import { useVptsDataQuery } from "./useVptsDataQuery";

export function useVptsData() {
    const payload = useAppSelector((state) => state.vptschart.vptsPayload);
    const query = useVptsDataQuery(payload)
    return query;
}