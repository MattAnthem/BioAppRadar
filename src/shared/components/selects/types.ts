/**
 * Default shape of any selects props
 */
export interface SelectProps  {
    icon?: React.JSX.Element;
    width?: "w-8" | "w-40" | "w-45" | "w-50" | "w-55" | "w-60" | "w-65" | "w-70" | "w-75" | "w-80" | "w-85" | "w-90" | "w-95" | "w-full";
    value?: string;
    ariaControls?: string;
    className?: string;
    onSelectValue: (value: string) => void;
}

export type SelectState = {
    isOpen: boolean;
    selectedOption: string | null;
}

export type Hierarchy = {
    parent: string;
    childs: string[];
}