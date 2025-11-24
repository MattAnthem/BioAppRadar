import React, { useState, useEffect, memo, lazy, Suspense } from "react";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import { useAppSelector } from "../../../store/hooks";
import { Calendar } from "lucide-react";

const Datetime = lazy(() => import('react-datetime'));

type DateTimeProps = {
  value?: string;
  onChange?: (val: string) => void;
  minDate?: string | moment.Moment;
  maxDate?: string | moment.Moment;
};

const FORMAT = "YYYY-MM-DD HH:mm:ss";

const ReactDatetimePicker: React.FC<DateTimeProps> = ({ value, onChange, minDate, maxDate }) => {

  const [internalValue, setInternalValue] = useState<moment.Moment | undefined>(
    value ? moment(value, FORMAT, true) : undefined
  );
  const [manualInput, setManualInput] = useState<string>(
    value ? moment(value, FORMAT).format(FORMAT) : ""
  );
  const [isValid, setIsValid] = useState(true);

  const pickerTheme = useAppSelector((state) => state.theme.currentTheme.datePicker);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const minMoment = minDate ? moment(minDate, FORMAT, true) : undefined;
  const maxMoment = maxDate ? moment(maxDate, FORMAT, true) : undefined;


  useEffect(() => {
    if (value) {
      const parsed = moment(value, FORMAT, true);
      setInternalValue(parsed);
      setManualInput(parsed.format(FORMAT));
    }
  }, [value]);

  const validateDate = (val: string): boolean => {
    const parsed = moment(val, FORMAT, true);
    if (!parsed.isValid()) return false;

    const [date, time] = val.split(" ");
    const [hour, min, sec] = time.split(":").map(Number);

    const validTime =
      hour >= 0 && hour < 24 && min >= 0 && min < 60 && sec >= 0 && sec < 60;
    const validDate = moment(date, "YYYY-MM-DD", true).isValid();
    const afterMinDate = minMoment ? parsed.isSameOrAfter(minMoment) : true;
    const beforeMaxDate = maxMoment ? parsed.isSameOrBefore(maxMoment) : true;

    return validTime && validDate && afterMinDate && beforeMaxDate;
  };

  const applyValidValue = (parsed: moment.Moment) => {
    let finalVal = parsed;
    if (minMoment && parsed.isBefore(minMoment)) {
      finalVal = minMoment.clone();
    }
    if (maxMoment && parsed.isAfter(maxMoment)) {
      finalVal = maxMoment.clone();
    }
    const formatted = finalVal.format(FORMAT);
    setInternalValue(finalVal);
    setManualInput(formatted);
    setIsValid(true);
    onChange?.(formatted);
  };

  const handleChange = (newVal: moment.Moment | string) => {
    if (typeof newVal === "string") return;
    applyValidValue(newVal);
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualInput(val);
    setIsValid(validateDate(val));
  };

  const handleBlur = () => {
    const parsed = moment(manualInput, FORMAT, true);
    if (!parsed.isValid()) return;
    applyValidValue(parsed);
  };

  const isValidCalendarDate = (currentDate: moment.Moment) => {
    if (minMoment && currentDate.isBefore(minMoment, "day")) return false;
    if (maxMoment && currentDate.isAfter(maxMoment, "day")) return false;
    return true;
  };

  return (
    <div
      className={`relative rounded-sm border ${
        isDarkMode ? "dark" : "light"
      } ${pickerTheme.border} ${pickerTheme.bg}`}
    >
      <Suspense>
        <Datetime
          value={internalValue}
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          onChange={handleChange}
          isValidDate={isValidCalendarDate}
          inputProps={{
            value: manualInput,
            onChange: handleManualChange,
            onBlur: handleBlur,
            placeholder: "YYYY-MM-DD HH:mm:ss",
            className: `rounded-[2px] p-1.5  text-sm w-full outline-none transition-opacity ${
              isValid
                ? "border-gray-400 focus:ring-1 focus:ring-offset-2 focus:ring-blue-700"
                : "border-red-500 focus:ring-1 focus:ring-offset-2 focus:ring-red-400"
            } ${pickerTheme.text}`,
          }}
          closeOnSelect
        />
      </Suspense>
      <Calendar className="absolute w-4 h-4 right-2 bottom-2"/>
    </div>
  );
};

export default memo(ReactDatetimePicker);
