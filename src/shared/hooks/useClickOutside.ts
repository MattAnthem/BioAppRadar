import { type RefObject, useEffect } from 'react'

/**
 * Closes a menu when we click outside of a node 
 * @param {React.RefObject} ref - Référence vers l'élément à surveiller
 * @param {Function} callback - Fonction à appeler lors d'un clic extérieur
 */
export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void
  ) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [callback, ref])
}