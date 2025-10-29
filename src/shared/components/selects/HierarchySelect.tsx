import { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { type SelectProps, type Hierarchy } from './types';
import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import '../../css/select.css';
import { useHandleKeyDown } from '../../hooks/useHandleKeyDown';


interface HierarchySelectProps extends SelectProps {
    options: Hierarchy[];
}

/**
 * @param options: Select options including a Parent that defines its group of childs  
 * @param defaultOption: Used to display the currently selected element
 * @param icon: If defined, show an icon on the left side of the select element
 * @returns React.JSX.Element
 */
const HierarchySelect = ({ options, value, icon, width='w-60' , ariaControls, onSelectValue}: HierarchySelectProps) => {
    // Theme
    const themes = useTheme();
    const { simpleSelect } = themes.theme;
    const { bg, hover, icon_color, option_hover, options_bg, text, secondary_text, selected_option } = simpleSelect;

    const selectRef = useRef<HTMLDivElement | null>(null);

    const { 
        handleKeyDown, 
        focusedIndex, 
        isOpen,  
        setIsOpen, 
        flatOptions
    } = useHandleKeyDown(options, onSelectValue);

    useClickOutside(selectRef, () => {
        if (isOpen) {
            setIsOpen(false)
        }
    })

  return (
    <div ref={selectRef} className={`relative flex flex-col ${width}`}>

        <button 
            aria-haspopup="listbox"
            aria-expanded={isOpen} 
            onKeyDown={handleKeyDown} 
            onClick={() => setIsOpen(!isOpen)} 
            className={`${bg}  ${hover} focus-visible:outline-2 outline-offset-1 outline-blue-800 rounded-sm w-full p-2 flex justify-between items-center gap-2 cursor-pointer`}
        >
            <span className={`${text} flex gap-3`}>
                {icon && <span className={text}>{icon}</span>}
                {value}
            </span>
            <ChevronDown className={`${isOpen ? '-rotate-180' : 'rotate-0'} ${icon_color} transition-transform ease-in-out duration-300`} />
        </button>

        {
            isOpen && (
                <div id={ariaControls} tabIndex={-1} className={`${options_bg} shadow-lg z-10 absolute w-full top-full rounded-b-sm custom_select max-h-[450px] overflow-y-scroll`}>
                    <div className="flex flex-col items-center w-full p-2">
                    {options.map((hierarchy) => (
                        <div key={hierarchy.parent} className="flex-col w-full">
                            <div
                            className={`${text} font-semibold px-2 py-1`}
                            aria-hidden="true"
                            >
                            {hierarchy.parent}
                            </div>

                            {hierarchy.childs.map((child) => {
                            const globalIndex = flatOptions.indexOf(child);
                            return (
                                <option
                                    key={child}
                                    id={`option-${child}`}
                                    aria-selected={value === child}
                                    className={`
                                        ${option_hover} ${secondary_text}
                                        ${value === child ? selected_option : ""}
                                        ${focusedIndex === globalIndex ? "ring-1 ring-blue-500" : ""}
                                        rounded-sm cursor-pointer text-start w-full px-4 py-2 my-1
                                    `}
                                    onClick={() => {
                                        onSelectValue(child);
                                        setIsOpen(false);
                                    }}
                                    onChange={(e) => console.log('EEEEEEE',e.target)}
                                    value={child}
                                    >
                                    {child}
                                </option>
                            );
                            })}
                        </div>
                        ))}

                    </div>
                </div>
            )
        }
      
    </div>
  )
}

export default HierarchySelect;
