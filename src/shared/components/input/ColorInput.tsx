import {memo, useEffect, useState} from 'react';

type ColorInputProps = {
    label?: string;
    initialColor: string;
    onColorCommit: (color: string) => void;
}

/**
 * Memoized color input component that only commits color changes onBlur.
 * @param initialColor - The initial color value.
 * @param onColorCommit - Callback function to commit the color change.
 * @param label - label for the color input.    
 * @returns 
 */
const ColorInput = ({
    initialColor,
    onColorCommit,
    label
}: ColorInputProps) => {

    // Prevent rerenders on color change until mouse up

    const [value, setValue] = useState(initialColor);
  
    useEffect(() => {
      setValue(initialColor);
    }, [initialColor]);
  
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      setValue(evt.target.value);
    };
  
    const handleBlur = () => {
        onColorCommit(value);
    };

  return (
    <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-start capitalize items-center">
      
        <small>{label}:</small>
        <input 
            onChange={handleChange}
            onBlur={handleBlur}
            type="color" 
            name={`${label}-input`}
            id={label} 
            value={value}
            className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'
        />

    </div>
  )
}

export default memo(ColorInput);
