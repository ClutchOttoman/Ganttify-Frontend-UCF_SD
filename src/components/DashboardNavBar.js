import React, { useState, useEffect } from 'react';
import "./DashboardNavBar.css";
import { buildPath } from './buildPath';
import Papa from 'papaparse';  // CSV parsing

function DasboardNavBar({page}) {   
    const [message, setMessage] = useState('');
    const [projectCreated, setProjectCreated] = useState(false);
    const [fetchedProject, setFetchedProject] = useState(null);
    const [csvData, setCsvData] = useState(null);  // State to store CSV data

    const newProjectName = React.createRef();
    const _ud = localStorage.getItem('user_data');
    const ud = JSON.parse(_ud);
    const userId = ud._id;
    const userRole = ud.role;  // Assuming 'role' field indicates user role 

    console.log('User Role:', userRole);  // Debug log to check the user role

    const doCreateProject = async event => {
        event.preventDefault();

        if (!newProjectName.current.value.trim()) {
            setMessage("Project name is required");
                return;
        }


        const obj = { founderId: userId, nameProject: newProjectName.current.value };
        console.log(obj);
        const js = JSON.stringify(obj);
        try {
            if (newProjectName.current.value.length > 35) {
                setMessage("Project names cannot be longer than 35 characters");
                return;
            }
            // If no CSV is imported, proceed with regular project creation
            if (!csvData) {
            const response = await fetch(buildPath('api/createproject'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const txt = await response.text();
            const res = JSON.parse(txt);

            if (res.error != null) {
                setMessage("API Error:" + res.error);
            } else {
                setMessage('Project has been created');
                setProjectCreated(true);
                // Fetch project and its tasks after creation
                fetchProject(res.project._id);
                
                window.location.reload(); // Reload the page
               
            }
        } else {
            // If CSV data exists, use createProjectWithCSV
            createProjectWithCSV(csvData);
           
            window.location.reload(); // Reload the page
            
        }
        } catch (e) {
            setMessage(e.toString());
        }
    };

    // Handle project creation page refresh
    const hanldeProjectCreated = () => {
        if (projectCreated) {
            setProjectCreated(false);
            window.location.assign(window.location.pathname);
        }
    };

    const handleCSVImport = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            Papa.parse(file, {
                complete: (result) => {
                    console.log('Parsed CSV Data:', result.data); // Debugging
                    //if (!result.meta.fields.includes('Task')) {
                        if (!result.meta.fields.includes('Task') || !result.meta.fields.includes('Start') || !result.meta.fields.includes('End')) {
                            setMessage('CSV file is missing required columns');
                            return;
                         }

                        // Modify category before sending to the backend
                const cleanedData = result.data.map((task) => {
                    if (task.Category === 'No category') {
                        task.Category = '';  // Set to empty if 'No category'
                    }
                    return task;
                }); 
                setCsvData(cleanedData); // Save CSV data in state

                },
                header: true // Ensures the first row is treated as column headers
            });
        } else {
            setMessage("Please upload a valid CSV file.");
        }
    };


    const createProjectWithCSV = async (csvData) => {
        console.log("Received CSV Data:", csvData);
    
        try {
            // Create the project using the CSV data
            const projectData = {
                founderId: userId,
                nameProject: newProjectName.current.value,
                csvData: csvData,  // Send the parsed CSV data to the backend
            };
    
            const js = JSON.stringify(projectData);
            const response = await fetch(buildPath('api/createproject'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
    
            const res = await response.json();
    
            if (res.error) {
                setMessage("API Error: " + res.error);
                return;
            }
    
            setMessage('Project created with CSV tasks');
            
            // After creating the project, iterate over the CSV data and create tasks
            for (let i = 0; i < csvData.length; i++) {
                const task = csvData[i];
    
                const startDate = new Date(task.Start);
                const endDate = new Date(task.End);
    
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error('Invalid date format in task:', task);
                    continue; // Skip this task if the date is invalid
                }
                
                // Task data based on the CSV
                const taskData = {
                taskTitle: task.Task,
                description: task.Description || "",
                startDateTime: startDate.toISOString(), 
                dueDateTime: endDate.toISOString(), 
                taskCreated: new Date().toISOString(),
                taskCategory: task.Category || "No Category",
                taskCategoryId: null,
                color: task.Color,
                pattern: task.Pattern || "No Pattern",
                progress: "Not Started",
                assignedTasksUsers: [],
                prerequisiteTasks: [],
                dependentTasks: [],
                allPrequisitesDone: false,
                tiedProjectId: null,
                taskCreatorId: userId,
                };
    
                // Send request to create the task
                const taskJs = JSON.stringify(taskData);
    
                const taskResponse = await fetch(buildPath('api/createtask'), {
                    method: 'POST',
                    body: taskJs,
                    headers: { 'Content-Type': 'application/json' },
                });
    
                const taskRes = await taskResponse.json();
    
                if (taskRes.error) {
                    console.log("Error creating task:", taskRes.error);
                } else {
                    console.log("Created task:", taskRes);
                }
            }
    
            // Refresh project tasks after creation
            fetchProject(res.project._id);
    
        } catch (e) {
            setMessage("Error creating project or tasks: " + e.toString());
        }
    };

    const fetchProject = async (projectId) => {
        try {
            const projectResponse = await fetch(buildPath(`api/projects/${projectId}`));
            const project = await projectResponse.json();
            setFetchedProject(project);

            if (project.tasks && project.tasks.length > 0) {
                console.log('Tasks:', project.tasks);
                // Map over project.tasks and render in the UI
              }
            } catch (e) {
              setMessage("Failed to fetch project data: " + e.toString());
            }
          };
    

          return(
            <div class = "d-md-flex d-block">
                <div class = "d-none d-md-table-cell container-lg navBarBody me-5 pb-5">
                        <a id ="ToDo List" class = "btn navBtn topNavBtn" href="/dashboard"><span class = "navBtnText">To Do List</span></a>
                        <a id ="Charts" class = "btn navBtn" href="/dashboard/charts"><span class = "navBtnText">Charts</span></a>
                        <a id ="Recently Deleted" class ="btn navBtn" href="/dashboard/recently-deleted"><span class = "navBtnText">Recently Deleted</span></a>
                        <button id ="Create Project" class ="btn navBtn" data-bs-toggle="modal" data-bs-target="#createProjectModal"><span class = "navBtnText">Create Project</span></button> 
                        <a id ="Account" class ="btn navBtn" href="/dashboard/account" ><span class = "navBtnText">Account</span></a> 
                        <a id ="UI Settings" class="btn navBtn" href="/dashboard/ui-settings"><span class = "navBtnText">UI Settings</span></a> 
                </div>
                <div class = "d-md-none navBarBodySmall mb-5 pb-5">
                    <div class = "row align-items-center mt-3">
                        <div class = "col-2"><a id ="ToDo List" class= "btn navBtnSmall" href="/dashboard"><span class = "navBtnTextSmall">To Do</span></a></div>
                        <div class = "col-2"><a id ="Charts" class = "btn navBtnSmall" href="/dashboard/charts"><span class = "navBtnTextSmall">Charts</span></a></div>
                        <div class = "col-2"><a id ="Recently Deleted" class ="btn navBtnSmall" href="/dashboard/recently-deleted"><span class = "navBtnTextSmall">R.D.</span></a></div>
                        <div class = "col-2"><a id ="Create Project" class ="btn navBtnSmall" data-bs-toggle="modal" data-bs-target="#createProjectModal"><span class = "navBtnTextSmall">Create</span></a> </div>
                        <div class = "col-2"><a id ="Account" class ="btn navBtnSmall" href="/dashboard/account"><span class = "navBtnTextSmall">Account</span></a></div>
                        <div class = "col-2"><a id ="Settings" class ="btn navBtnSmall" href="/dashboard/ui-settings"><span class = "navBtnTextSmall">UI Settings</span></a></div>
                     </div>
            </div>
            <div class = "d-md-inline-flex d-block container mainContainer ms-5 mt-5">
               {page}
            </div>
            
            

            <div className="modal fade px-0" id="createProjectModal" tabindex="-1" aria-labelledby="createProjectModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createProjectModalLabel">{projectCreated ? "Project has been Created" : "Create a Project"}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={hanldeProjectCreated}  
                                style={{ color: 'black', fontSize: '1.7rem', background: 'none', border: 'none' }}>  
                                     ✖  
                            </button>
                        </div>
                        <div className="modal-body">
                            {projectCreated ? (
                                <button className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" onClick={hanldeProjectCreated}>Got It</button>
                            ) : (
                                <form onSubmit={doCreateProject}>
                                    <label htmlFor="newProjectNameInput">Enter a name for your new project:</label>
                                    <input id="newProjectNameInput" className="form-control mt-2" placeholder="35 characters maximum" ref={newProjectName} />
                                    <div className="mt-3">
                                    <label htmlFor="csvImport" className="form-label" style={{ fontWeight: 'normal' }}>
                                        Import CSV
                                    </label>

                                        <input 
                                            type="file" 
                                            id="csvImport" 
                                            className="form-control" 
                                            accept=".csv" 
                                            onChange={handleCSVImport} 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Project</button>
                                </form>
                            )}
                        </div>

                        {!projectCreated && (
                            <div className="modal-footer">
                                <h5 className="message">{message}</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DasboardNavBar;
