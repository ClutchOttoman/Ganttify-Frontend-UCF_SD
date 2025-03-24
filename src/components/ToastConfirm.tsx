import React, {useState} from 'react';
import './ToastWindow.css';
import {ToastContentProps} from 'react-toastify';

type NotifyProps = ToastContentProps<{
    title: string;
    body?: string;
}>;

function ToastConfirm({closeToast, data, toastProps}: NotifyProps){
    return(<div>
        <div>
            <h4>{data.title}</h4>
            <p>{data.body}</p>
        </div>
        <div>
            <button className="confirm-button" onClick={() => {
                console.log("Selected confirmation");
                closeToast("confirm");
            }}>
            Confirm</button>
            <button className="cancel-button" onClick={closeToast}>Cancel</button>
        </div>
    </div>);
}

export default ToastConfirm;