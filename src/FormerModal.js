import React from 'react';
import './FormerModal.css';
// import data from './FormerTables.json';

const Modal = ({open, onClose, data}) => {

    if (!open) {
        return null
    }
    return ( 
        <div className="modal" onClick={onClose}>
            <div className='modalContainer'>
                    <p className='closeBtn' onClick={onClose}>X</p>
                    <div className='content'>
                        <p>{data.header}</p>
                    </div>
            </div>
        </div>
     );
}
 
export default Modal;