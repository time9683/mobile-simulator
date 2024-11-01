interface DialogProps {
    children: React.ReactNode;
    someRef: React.RefObject<HTMLDialogElement>;
}

export default function Dialog({children, someRef}: DialogProps) {
    return (
        <dialog ref={someRef} className='p-6 rounded-lg shadow-md m-auto bg-white'>
            {children}
        </dialog>
    )
}