import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import EditEmail from '../components/EditEmail';

const EditEmailPage = () =>{

    const { email, token } = useParams();

    return(
        <div>
            <NavBar pageTitle="Ganttify" layout={0}/>
            <EditEmail/>
        </div>
    );
}
export default EditEmailPage;
