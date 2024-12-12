import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './DashboardProjectCard.css';
import {buildPath} from './buildPath';


function DashboardProjectCard({projectTitle, isVisible}){
    var cardClass;
    console.log(projectTitle);
    if(isVisible){
        cardClass = "card";
    }
    else{
        cardClass = "invisibleCard";
    }
    return (
        <div class ={cardClass} >
            <a class="card-block stretched-link text-decoration-none" href="#"></a>
                <img src='...' class = "card-img-top" alt='...'/>
                <div class = "card-body">
                    <h5 class = "card-title">{projectTitle}</h5>
                    <p class ="card-text">Project description</p>
                </div>
            <a/>
        </div>
    );
}

export default DashboardProjectCard;
