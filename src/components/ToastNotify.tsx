import React from 'react';
import './ToastWindow.css';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';

type NotifyProps = ToastContentProps<{
    title: string;
    body: string;
}>;

function ToastNotify({closeToast, data, toastProps}: NotifyProps){
    return(<div>
        <div>
            <h4>{data.title}</h4>
            <p>{data.body}</p>
        </div>
        <div>
            <button className="default-button" onClick={closeToast}>Dismiss</button>
        </div>
    </div>);
}

export default ToastNotify;