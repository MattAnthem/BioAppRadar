import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const useValidateDate = (dateString: string, format: string = 'YYYY-MM-DD HH:mm:ss'): boolean => {
  return dayjs(dateString, format, true).isValid();
};