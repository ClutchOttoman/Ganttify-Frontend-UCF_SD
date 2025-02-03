import React, { useState } from 'react';
import "./DashboardNavBar.css";
import { buildPath } from './buildPath';

function DasboardNavBar()
{   const [message,setMessage] = useState('');
    const [projectCreated,setProjectCreated] = useState(false);

    var newProjectName = "";
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud._id;

    const doCreateProject = async event => {
        event.preventDefault();

        var obj = {founderId:userId,nameProject:newProjectName.value};
        var js = JSON.stringify(obj);
        //console.log(js);
        try
        {
            if (newProjectName.value.length > 35){
                setMessage("Project names cannot be longer then 35 characters");
                return;}
        }catch(e) {
        setMessage(e.toString());
        }


        const obj = { founderId: userId, nameProject: newProjectName.current.value };
        console.log(obj);
        const js = JSON.stringify(obj);
        console.log("Step 1: Starting Create Project API Call");
        try {
            const response = await fetch(buildPath('api/createproject'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const txt = await response.text();
            const res = JSON.parse(txt);
            console.log("Step 2: Create Project Response: ", res);

            console.log("Step 3: Starting Generate Invite Link API Call");
            const linkResponse = await fetch(buildPath('api/generate-invite-link'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: res.project._id })
            });

            console.log("Step 4: Finished Generate Invite Link API Call");

            if (response.error != null) {
                setMessage("API Error:" + response.error);
            } else {
                setMessage('Project has been created');
                setProjectCreated(true);
                // Fetch project and its tasks after creation
                fetchProject(response.project._id);                
                
                window.location.reload(); // Reload the page
               
            }
        }  catch (e) {
            setMessage(e.toString());
        }
    };

    // Handle project creation page refresh
    const handleProjectCreated = async() => {
        if (projectCreated) {
            setProjectCreated(false);
            window.location.assign(window.location.pathname);
        }
    }
    return(
        <div>
            <div class = "d-none d-md-block container-lg navBarBody mb-5">
                    <a id ="ToDo List" class = "btn navBtn topNavBtn" href="/dashboard"><span class = "navBtnText">To Do List</span></a>
                    <a id ="Charts" class = "btn navBtn" href="/dashboard/charts"><span class = "navBtnText">Charts</span></a>
                    <a id ="Recently Deleted" class ="btn navBtn" href="/dashboard/recently-deleted"><span class = "navBtnText">Recently Deleted</span></a>
                    <button id ="Create Project" class ="btn navBtn" data-bs-toggle="modal" data-bs-target="#createProjectModal"><span class = "navBtnText">Create Project</span></button> 
                    <a id ="Account" class ="btn navBtn" href="/dashboard/account" ><span class = "navBtnText">Account</span></a> 

                   
            </div>
            <div class = "d-md-none navBarBodySmall mb-5">
                <div class = "row align-items-center mt-3">
                    <div class = "col-3"><a id ="ToDo List" class = "btn navBtnSmall" href="/dashboard"><span class = "navBtnTextSmall">To Do</span></a></div>
                    <div class = "col-3"><a id ="Charts" class = "btn navBtnSmall" href="/dashboard/charts"><span class = "navBtnTextSmall">Charts</span></a></div>
                    <div class = "col-3"><a id ="Recently Deleted" class ="btn navBtnSmall" href="/dashboard/recently-deleted"><span class = "navBtnTextSmall">R.D.</span></a></div>
                    <div class = "col-3"><button id ="Create Project" class ="btn navBtnSmall" data-bs-toggle="modal" data-bs-target="#createProjectModal"><span class = "navBtnTextSmall">Create</span></button> </div>
                 </div>
            </div>

            <div class="modal fade px-0" id="createProjectModal" tabindex="-1" aria-labelledby="createProjectModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="createProjectModalLabel">{projectCreated? "Project has been Created":"Create a Project"}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleProjectCreated}></button>
                            </div>
                            <div class="modal-body">
                                {projectCreated ? <button class = "btn btn-primary" data-bs-dismiss="modal" aria-label="Close" onClick={handleProjectCreated}>Got It</button>:
                                <form onSubmit={doCreateProject}>
                                    <label for="newProjectNameInput">Enter a name your new project:</label>
                                    <input id="newProjectNameInput" class = "form-control mt-2" placeholder='35 characters maximum' ref={(c) => newProjectName = c}/>
                                    <button type="submit" class="btn btn-primary">Create Project</button>
                                </form>}
                            </div>
                            {projectCreated ? null :
                            <div class = "modal-footer">
                                <h5 class = "message">{message}</h5>
                            </div>}
                        </div>
                </div>
            </div>
        </div>
    );
    
}

export default DasboardNavBar;