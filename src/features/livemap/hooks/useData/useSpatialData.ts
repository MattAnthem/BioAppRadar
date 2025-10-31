import { useAppSelector } from "../../../store/hooks";
import { useSpatialDataQuery } from "./useSpatialDataQuery";

export function useSpatialData() {
    const payload = useAppSelector((state) => state.livemap.spatialPayload);
    const query = useSpatialDataQuery(payload);
    return query;
}