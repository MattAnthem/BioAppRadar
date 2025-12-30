import { useMemo } from "react";
import type { TemporalCovResponse } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";
import dayjs from "dayjs";

/**
 * Hook that provide functions to handle temporal coverage dates
 * 
 * Functions:
 *  - adjustedStartEndTime - Gets one hour adjusted time interval (Start, End) in UTC+2
 *  - createdTimeFrames - Creates timerange from the last time available in a 5 minutes steps
 * 
 * @param times temporal coverage time interval (UTC times)
 * @param startEndOffset The interval of time to get by substracting it with the end time
 */
export function useFreshDates (times?: TemporalCovResponse, startEndOffset: number = 1, TIME_FORMAT: string = "YYYY-MM-DD HH:mm:ss") {

    const adjustedStartEndTime = useMemo(() => {

        if (!times) return;

        const fresh_end = dayjs(times.end_time).add(2, 'hour').format(TIME_FORMAT);
        const fresh_start = dayjs(fresh_end).subtract(startEndOffset, 'hour').format(TIME_FORMAT);

        return { fresh_end, fresh_start }
    }, [times, TIME_FORMAT, startEndOffset]);

    const createdTimeFrames = useMemo(() => {
        if (!times) return;
        const fresh_end = dayjs(times.end_time).add(2, 'hour').format(TIME_FORMAT);
        const fresh_start = dayjs(fresh_end).subtract(startEndOffset, 'hour').format(TIME_FORMAT);

        const start = dayjs(fresh_start);
        const end = dayjs(fresh_end);
        
        const diffMinutes = end.diff(start, 'minute');
        const steps = Math.floor(diffMinutes / 5);

        const timeFrame = Array.from({ length: steps + 1 }, (_, i) =>
            start.add(i * 5, 'minute').format(TIME_FORMAT)
        );

        return { timeFrame }
    }, [times, TIME_FORMAT, startEndOffset])

    return { adjustedStartEndTime, createdTimeFrames }

}