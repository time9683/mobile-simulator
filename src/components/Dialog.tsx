interface DialogProps {
    children: React.ReactNode;
    someRef: React.RefObject<HTMLDialogElement>;
    onClick?: () => void;
}

export default function Dialog({children, someRef, onClick}: DialogProps) {
    return (
        <dialog ref={someRef} onClick={onClick} className='p-6 rounded-lg shadow-md m-auto bg-slate-950'>
            <div className='text-slate-50'>
                {children}
            </div>
        </dialog>
    )
}