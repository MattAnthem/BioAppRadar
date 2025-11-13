import React,{ type ReactNode } from "react";
import Modal from "../../../shared/components/modal/Modal";


type ChartModalProps = {
    isModalOpen: boolean;
    mdlToggler_func?: () => void;
    modalTitle?: string;
    children?: ReactNode;
}
const ChartModal = ({children, modalTitle, isModalOpen, mdlToggler_func}: ChartModalProps) => {
  return (
    <Modal
        title={modalTitle!}
        isOpen={isModalOpen}
        handle_toggle_mdl={mdlToggler_func}
        ariaLabelledBy='chart-modal'
    >

        {children}

    </Modal>
  )
}

export default React.memo(ChartModal);
