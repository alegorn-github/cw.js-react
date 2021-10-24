import ReactDOM from 'react-dom';
import { getClassName } from '../tools/getClassName';
import './modal.css';

interface IModal {
    children: React.ReactNode;
    isVisible ?: boolean;
    onClose?: ()=>void;
}

export function Modal({children,isVisible=false,onClose}:IModal){

    const modalNode = document.getElementById('modal')||document.createElement('div');

    return ReactDOM.createPortal((
        <div className={getClassName(["modalBackground",]) }>
            <div className={"modal"}>
                <div className={"modal__container"}>
                    <button className={"modal__closeButton"} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9115 13.8058L6.84406 18.9567L4.96166 17.0433L10.0291 11.8924L5.0675 6.84914L6.85992 5.02721L11.8215 10.0705L16.7673 5.04334L18.6497 6.95672L13.7039 11.9839L18.6655 17.0272L16.8731 18.8491L11.9115 13.8058Z" />
                        </svg>
                    </button>
                    {children}
                </div>
            </div>
        </div>
    ),
        modalNode
    )
}