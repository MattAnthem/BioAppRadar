
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTheme } from "../../hooks/useTheme";
import { ChevronDown } from "lucide-react";
import type { SelectProps } from "./types";


interface CheckboxSelectProps extends SelectProps  {
    options: string[];
    title?: string;
    values: string[];
}

const CheckboxSelect = (
    {
        options,
        title,
        width,
        onSelectValue,
        ariaControls,
        className,
        icon,
        values,
        
    }: CheckboxSelectProps
) => {

    // Theme
    const themes = useTheme();
    const { simpleSelect } = themes.theme;
    const {  border, hover, icon_color, option_hover, options_bg, text, selected_option, secondary_text } = simpleSelect;
    const checkboxSelectRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    
    useClickOutside(checkboxSelectRef, () => {
        if (isOpen) {
            setIsOpen(false);
        }
    })

  return (
    <fieldset className={`${width} ${border} ${title ? 'px-2 pb-2 rounded-sm border-2' : ''}`}>

        {
            title && <legend className={`${secondary_text} px-2 ml-2 text-sm`}>{title}</legend>
        }

        <div ref={checkboxSelectRef} className={`flex flex-col relative ${width}`}>
            <button 
                    aria-haspopup="listbox" 
                    aria-expanded={isOpen} 
                    aria-controls={ariaControls}
                    onClick={() => setIsOpen(!isOpen)}  
                    className={` ${border} ${hover} ${className} focus-visible:outline-2 outline-offset-1 outline-blue-800 rounded-sm w-full border p-2 flex justify-between items-center gap-2 cursor-pointer`}
                >

                <span className={`${text} flex gap-3`}>
                    {icon && <span className={text}>{icon}</span>}
                    <span className={`${''}`}>
                        {values.join(' / ')}
                    </span>
                </span>

                <ChevronDown className={`${isOpen ? '-rotate-180' : 'rotate-0'} ${icon_color}  transition-transform ease-in-out duration-300`} />

            </button>

            {
                isOpen && (
                    <div id={ariaControls} tabIndex={-1} className={`${options_bg} custom_select border shadow-lg z-8 absolute max-h-[200px] top-full lg:left-0 right-0 rounded-b-sm overflow-y-scroll flex flex-col items-start  p-2`}>
                        <div className="w-full">
                        {
                            options.map((option, i) => (
                                <div key={option} className={`${option_hover} ${text} px-2 rounded-sm flex items-center gap-2`}>
                                    <input
                                        onChange={() => onSelectValue(option)}
                                        type="checkbox"
                                        name={option}
                                        id={`option-${i}`}
                                        checked={values.includes(option)}
                                        // disabled={!values.includes(option)}
                                        className={`
                                            
                                            ${
                                                values.includes(option) ? `${selected_option}` : ""
                                            } 
                                            rounded-sm cursor-pointer text-start my-2 p-2`
                                        }
                                    />
                                    <label htmlFor={`option-${i}`} className="w-full">{option}</label>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                )
            }
        </div>
        
    </fieldset>
  )
}

export default CheckboxSelect
