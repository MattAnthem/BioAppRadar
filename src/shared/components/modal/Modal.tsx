import  { type ReactNode } from 'react';
import SectionCard from '../cards/SectionCard';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import ButtonBorder from '../buttons/borderedbtn/ButtonBorder';

type ModalProps = {
  title: string;
  children?: ReactNode;
  handle_toggle_mdl: () => void;
  isOpen: boolean;
  ariaLabelledBy?: string;

}


/**
 * Stateless modal layout base 
 * @param title Modal title 
 * @param children Modal contents
 * @returns React.JSX.Element
 */
const Modal = (
  {
    title,
    children,
    handle_toggle_mdl,
    isOpen,
    ariaLabelledBy
  }: ModalProps
) => {

  if (!isOpen) return null;

  return createPortal( //put the modal outside the node
        <dialog aria-modal='true' aria-labelledby={ariaLabelledBy} className="w-full h-full bg-transparent fixed inset-0 z-65 flex items-start pt-10 justify-center">
          {/* overlay cliquable */}
          <button
            onClick={handle_toggle_mdl}
            className="absolute inset-0 bg-zinc-800/55"
            aria-label="Close modal"
          />

            {/* Modal contents */}
              
                <SectionCard  className={`relative lg:w-[70%] w-[90%] min-h-[20%] transition-all duration-300 ease-in-out p-2 flex-col`}>
                  <div className="w-full flex justify-between items-baseline">
                    {/* Heading */}
                    <h1 className="p-2 font-semibold">{title}</h1>

                    <ButtonBorder ariaLabel='Modal close' isDisabled={false} ariaExpanded={isOpen} ariaControls='Modal close' onClick={handle_toggle_mdl} className='w-7 h-7 flex items-center justify-center'>
                      <X/>
                    </ButtonBorder>

                  </div>
                  <div className="w-full border-b-2 border-gray-300" />
                  {/* Content */}
                  <div className="w-full p-4">
                    { children }
                  </div>
                </SectionCard>

          </dialog>,
          document.body
  )
}

export default Modal;
