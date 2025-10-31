import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setWindowSize } from "../slice/windowsizeSlice";


function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    }
}

export default function WindowResize(){

    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleResize = debounce(() => {
            const size = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            dispatch(setWindowSize(size));

        }, 300);
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }


    }, [dispatch]);

    return null;
   
}