import { useAppSelector } from "../../../store/hooks";
import { useSevipDataQuery } from "./useSevipQuery";

export function useSevipData() {
    const payload = useAppSelector((state) => state.livemap.sevipPayload);
    const query = useSevipDataQuery(payload);
    return query;
}