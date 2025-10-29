import { useState } from "react";
import type { Hierarchy } from "../components/selects/types";

/**
 * Custom Hook to handle accessibility on a custom select 
 * @param options: List of elements inside of a select
 * @returns 
 */

function isStringArray(arr: unknown[]): arr is string[] {
    return arr.every(item => typeof item === 'string');
}


function flattenHierarchy(options: Hierarchy[]): string[] {
    return options.flatMap(opt => opt.childs);
  }
  
export const useHandleKeyDown = (options: string[] | Hierarchy[], handleSelectOption: (opt: string) => void) => {
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState(false);
  
    const flatOptions = isStringArray(options)
      ? options
      : flattenHierarchy(options);
  
    const selectOption = () => {
      if (focusedIndex >= 0) {
        handleSelectOption(flatOptions[focusedIndex]);
      }
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          setIsOpen(true);
          setFocusedIndex(0);
          e.preventDefault();
        }
      } else if (e.key === "ArrowDown") {
          setFocusedIndex((i) => (i + 1) % flatOptions.length);
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          setFocusedIndex((i) => (i - 1 + flatOptions.length) % flatOptions.length);
          e.preventDefault();
        } else if (e.key === "Enter" || e.key === " ") {
          selectOption();
          setIsOpen(false);
          e.preventDefault();
        } else if (e.key === "Escape") {
          setIsOpen(false);
        }
    };
  
    return {
      handleKeyDown,
      isOpen,
      setIsOpen,
      focusedIndex,
      setFocusedIndex,
      flatOptions 
    };
};
  