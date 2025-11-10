import { useState } from "react";
import { useKigaliDate } from "../../hooks/dates/useKigaliDate";


const DateUtc = () => {
    const [testDate, setTestDate] = useState('2020-11-10 12:10:00');

    const { parse, formatInputValue, toInputValue, toUTC } = useKigaliDate();

    const changeTest = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const dateKigali = formatInputValue(evt.target.value)
        
        console.log("FORMATTED KIGALI ", dateKigali)
        // setTestDate(dateKigali)
    }

    const test = (evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("NOT KIGALI ", evt.target.value)
    }
  return (
    <div>
      
      <input onChange={changeTest} value={toInputValue(testDate)} step={1} className="w-full p-2 rounded-sm border" type="datetime-local" name="date" id="end-time" />
      <small>NO parse</small>
      <input onChange={test} value={testDate} step={1} className="w-full p-2 rounded-sm border" type="datetime-local" name="date" id="end-time" />
    </div>
  )
}

export default DateUtc
