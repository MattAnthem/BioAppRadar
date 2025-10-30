import  { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useTheme } from '../../hooks/useTheme';
import type { SelectOption, SelectProps } from './types';
import '../../css/select.css'
import { useHandleKeyDown } from '../../hooks/useHandleKeyDown';



interface SimpleSelectProps extends SelectProps {
    options: SelectOption[];
    responsive?: boolean;
    title?: string;
}

/**
 * @param options: Select options 
 * @param defaultOption: Used to display the currently selected element
 * @param icon: If defined, show an icon on the left side of the select element
 * @param width: Select width (tailwind w-** class)
 * @param responsive: If true, the select element Width will adapt to its parent element
 * @returns React.JSX.Element
 */
const SimpleSelect = ({icon, options, value, width='w-40', responsive, ariaControls, onSelectValue, className, title} : SimpleSelectProps) => {
    // Theme
    const themes = useTheme();
    const { simpleSelect } = themes.theme;
    const { bg, border, hover, icon_color, option_hover, options_bg, text, selected_option, secondary_text } = simpleSelect;
    const simpleSelectRef = useRef<HTMLDivElement | null>(null);

    const { 
        handleKeyDown,
        focusedIndex, 
        isOpen,
        setIsOpen,
    } = useHandleKeyDown(options, onSelectValue);
    
    useClickOutside(simpleSelectRef, () => {
        if (isOpen) {
            setIsOpen(false);
        }
    })

  return (
    <fieldset className={`${width} ${border} ${title ? 'px-2 pb-2 rounded-sm border-2' : ''}`}>

        {
            title && <legend className={`${secondary_text} px-2 ml-2 text-sm`}>{title}</legend>
        }

        <div ref={simpleSelectRef} className={`flex flex-col relative ${width}`}>
            <button 
                aria-haspopup="listbox" 
                aria-expanded={isOpen} 
                aria-controls={ariaControls}
                onKeyDown={handleKeyDown}
                onClick={() => setIsOpen(!isOpen)}  
                className={`${bg} ${border} ${hover} ${className} focus-visible:outline-2 outline-offset-1 outline-blue-800 rounded-sm w-full border-1 p-2 flex justify-between items-center gap-2 cursor-pointer`}
            >

                <span className={`${text} flex gap-3`}>
                {icon && <span className={text}>{icon}</span>}
                    <span className={`${responsive? 'hidden 2xl:block xl:block md:block lg:block' : ''}`}>
                        {value}
                    </span>
                </span>

                <ChevronDown className={`${isOpen ? '-rotate-180' : 'rotate-0'} ${icon_color} ${responsive? 'hidden lg:block' : ''}  transition-transform ease-in-out duration-300`} />

            </button>
            {isOpen && (
                <div id={ariaControls} tabIndex={-1} className={`${options_bg} ${responsive ? '' : 'w-full'} custom_select border shadow-lg z-15 absolute max-h-[200px] top-full lg:left-0 right-0 rounded-b-sm overflow-y-scroll flex flex-col items-start  p-2`}>
                    <div className='w-full'>
                        {
                            options?.map((option, i) => (
                                    
                                <option 
                                    key={option.id}
                                    id={`option-${i}`}
                                    aria-selected={value === option.displayText}
                                    className={`${option_hover} ${text} ${
                                    value === option.displayText ? `${selected_option}` : ""
                                    } ${
                                    focusedIndex === i ? "ring-1 ring-blue-500" : ""
                                    } rounded-sm cursor-pointer text-start my-1 p-2`}
                                    onClick={() => {
                                        onSelectValue(option);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.displayText}
                                </option>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    </fieldset>
  )
}

export default SimpleSelect;