import { useAppSelector } from "../../../../store/hooks";
import { useVtipImageQuery } from "../useQuery/useVtipImageQuery";

export function useVtipHistImageData (enabled?: boolean) {
    const payload = useAppSelector((state) => state.vtip_histchart.vtipPayload);
    const query = useVtipImageQuery(payload, enabled);
    return query;
}