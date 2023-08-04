import { Dialog, Transition } from "@headlessui/react";
import { memo } from "react";


export interface IConfirmProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Confirm = memo<IConfirmProps>(function Confirm({ open, title, message, onConfirm, onCancel }) {
    return (
        <Transition.Root show={open} as={Dialog} onClose={onCancel}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white p-10 rounded-md shadow-md">
                    <Dialog.Title className="text-lg font-medium">
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-4">
                        {message}
                    </Dialog.Description>

                    <div className="mt-12 flex justify-end">
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </button>
                        <button
                            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() => onConfirm()}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </Transition.Root>
    );
});


export default Confirm;
