import React from 'react';
import './ToastWindow.css';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';

type AlertProps = ToastContentProps<{
    title: string;
    body: string;
}>;

function ToastSuccess({closeToast, data, toastProps}: AlertProps){
    return(<div>
        <div>
            <h4 style={{fontWeight: "bold"}}>{data.title}</h4>
            <p>{data.body}</p>
        </div>
    </div>);
}

export default ToastSuccess;