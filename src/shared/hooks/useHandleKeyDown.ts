import { useState } from "react";
import type { Hierarchy, SelectOption } from "../components/selects/types";






type SupportedOption = string | SelectOption | Hierarchy;


function isHierarchyArray(arr: unknown[]): arr is Hierarchy[] {
  return arr.every(
    item =>
      typeof item === "object" &&
      item !== null &&
      "parent" in item &&
      "childs" in item
  );
}

function flattenHierarchy(options: Hierarchy[]): string[] {
  return options.flatMap(opt => opt.childs);
}

/**
 * Custom Hook to handle accessibility on a custom select 
 * @param options: List of elements inside of a select
 * @returns 
 */
export const useHandleKeyDown = <T extends SupportedOption>(
  options: T[],
  handleSelectOption: (opt: T) => void
) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);

  // Normalisation selon le type
  const flatOptions: T[] | string[] = isHierarchyArray(options)
    ? (flattenHierarchy(options as Hierarchy[]))
    : options;

  const selectOption = () => {
    if (focusedIndex >= 0 && focusedIndex < flatOptions.length) {
      handleSelectOption(flatOptions[focusedIndex] as T);
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
      setFocusedIndex(i => (i + 1) % flatOptions.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setFocusedIndex(i => (i - 1 + flatOptions.length) % flatOptions.length);
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
    flatOptions,
  };
};
