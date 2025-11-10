import { useCallback } from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const KIGALI_TZ = 'Africa/Kigali';

/**
 * Utility hook to handle dates on input and display as Africa/Kigali
 * time
 */
export const useKigaliDate = () => {

    // Converts backend 'YYYY-MM-DD HH:mm:ss' to Kigali date
    const parse = useCallback((backendDate: string) => {
        return dayjs.tz(backendDate, KIGALI_TZ);
    }, []);

    // Format display date
    const formatInputValue = useCallback((date: string | Date, format = "YYYY-MM-DD HH:mm:ss") => {
        return dayjs.tz(date, KIGALI_TZ).format(format);
    }, []);

    // Format input
    const toInputValue = useCallback((inputVal: string) => {
        return dayjs.tz(inputVal, KIGALI_TZ).format("YYYY-MM-DD HH:mm:ss");
    }, []);

    // Gets an UTC date value
    const toUTC = useCallback((date: string | Date) => {
        return dayjs.tz(date, KIGALI_TZ).utc().format();
    }, []);

    return { parse, formatInputValue, toInputValue, toUTC }
}