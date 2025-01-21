import { useState, useEffect, useRef } from 'react';
import {
    monthDiff,
    getDaysInMonth,
    getDayOfWeek,
    createFormattedDateFromStr,
    createFormattedDateFromDate,
    dayDiff,
    getNextDateFromStr,
  } from '../../helpers/dateFunctions';
import { months } from '../../constants';
import TaskDetails from './TaskDetails';
import './TimeTable.css';
import Diagonal_Right_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Right_Single_Line_Density_1.svg';
import Diagonal_Left_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Left_Single_Line_Density_1.svg';
import Diagonal_Woven_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Woven_Line_Density_1.svg';
import Single_Horizontal_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Horizontal_Line_Density_1.svg';
import Single_Vertical_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Vertical_Line_Density_1.svg'
import Solid_Single_Circle_Density_1 from  '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Circle_Density_1.svg';
import Solid_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Dot_Density_1.svg';
import Solid_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Rhombus_Density_1.svg';
import Solid_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Square_Density_1.svg';
import Solid_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Star_Density_1.svg';
import Solid_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Triangle_Density_1.svg';
import Hollow_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Circle_Density_1.svg';
import Hollow_Single_Dot_Density_1 from'../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Dot_Density_1.svg';
import Hollow_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Rhombus_Density_1.svg';
import Hollow_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Square_Density_1.svg';
import Hollow_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Star_Density_1.svg';
import Hollow_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Triangle_Density_1.svg';

import {buildPath} from '../buildPath';


function isTaskHappeningNow(startDate,dueDate,dateToCheck){
    const timestamp = new Date(dateToCheck+"T00:00:00.000Z");
    const start = new Date(startDate);
    const end = new Date(dueDate);
    if(timestamp < start || timestamp > end){
        return false;
    }
    return true;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export default function TimeTable({
  timeRange,
  tasks,
  setTasks,
  taskDurations,
  setTaskDurations,
  userId,
  projectId,
}) {


  const patterns = {
    'Diagonal_Right_Single_Line_Density_1.svg':Diagonal_Right_Single_Line_Density_1,
    'Diagonal_Left_Single_Line_Density_1.svg':Diagonal_Left_Single_Line_Density_1, 'Diagonal_Left_Single_Line_Density_1.svg':Diagonal_Left_Single_Line_Density_1,
    'Diagonal_Woven_Line_Density_1.svg':Diagonal_Woven_Line_Density_1, 'Single_Horizontal_Line_Density_1.svg':Single_Horizontal_Line_Density_1,
    'Single_Vertical_Line_Density_1.svg':Single_Vertical_Line_Density_1,'Solid_Single_Circle_Density_1.svg':Solid_Single_Circle_Density_1,
    'Solid_Single_Dot_Density_1.svg':Solid_Single_Dot_Density_1,'Solid_Single_Rhombus_Density_1.svg':Solid_Single_Rhombus_Density_1,
    'Solid_Single_Square_Density_1.svg':Solid_Single_Square_Density_1,'Solid_Single_Star_Density_1.svg':Solid_Single_Star_Density_1,
    'Solid_Single_Triangle_Density_1.svg':Solid_Single_Triangle_Density_1,'Hollow_Single_Circle_Density_1.svg':Hollow_Single_Circle_Density_1,
    'Hollow_Single_Dot_Density_1.svg':Hollow_Single_Dot_Density_1,'Hollow_Single_Rhombus_Density_1.svg':Hollow_Single_Rhombus_Density_1,
    'Hollow_Single_Square_Density_1.svg':Hollow_Single_Square_Density_1,'Hollow_Single_Star_Density_1.svg':Hollow_Single_Star_Density_1,
    'Hollow_Single_Triangle_Density_1.svg':Hollow_Single_Triangle_Density_1
  }

  const ganttRef = useRef(null);


  // Initializing the Gantt Chart's different states
  const [arrayOfTasks, setArrayOfTasks] = useState([]);
  const [taskDurationElDraggedId, setTaskDurationElDraggedId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [resizingTask, setResizingTask] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentDayMarkerHeight,setCurrentDayMarkerHeight] = useState(0);

  const [leftBoundary, setLeftBoundary] = useState(new Date(null));
  const [rightBoundary, setRightBoundary] = useState(new Date(null));
  const [numberOfTasks, setNumberOfTasks] = useState(0);

  useEffect(() => {
    setNumberOfTasks(arrayOfTasks.length);
  }, [arrayOfTasks]);

  // Gets the project's details
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(buildPath(`api/getProjectDetails/${projectId}`));
        const project = await response.json();

        if (!project || !project.team) {
          return;
        }

        const isFounder = project.founderId === userId;
        const isEditor = project.team.editors.includes(userId);
        setCurrentDayMarkerHeight(project.tasks.length);

        setIsEditable(isFounder || isEditor);

        //Get details about the current tasks listed in the chart
        try {
          const response = await fetch(buildPath(`api/search/tasks/project`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectId }),
          });
        
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        
          const tasks = await response.json();

          setArrayOfTasks(tasks);

          let lB = null;
          let rB = null;
        
          for(let i in tasks){
            if(lB == null || tasks[i].startDateTime < lB){
              lB = tasks[i].startDateTime;
            }
              
            if(rB == null || rB < tasks[i].dueDateTime){
              rB = tasks[i].dueDateTime;
            }
          }
        
          setLeftBoundary(lB);
          setRightBoundary(rB);

          } catch (error) {
            console.error("Error finding project:", error.stack); // Log full stack trace
            res.status(500).json({ error: "Internal server error", details: error.message });  }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [projectId, userId]);

  // Event handlers
  const handleOutsideClick = (e) => {
    if (e.target.closest('.task-duration') === null) {
      setHoveredTask(null);
    }
  };


  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleResizeEnd);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);


  // Handles the "resizing" of a singular task
  const handleResizeStart = (e, taskDurationId, direction) => {
    console.log("starting resize");
    e.stopPropagation();
    e.preventDefault();
    setResizingTask(taskDurationId);
    setResizeDirection(direction);
    setIsResizing(true);
    setShowDetails(false);
  };



  const handleResizeEnd = async () => {
    if (resizingTask && resizeDirection) {
      const taskDuration = taskDurations.find(
        (taskDuration) => taskDuration._id === resizingTask
      );

      if (!taskDuration) {
        return;
      }

      const obj = { startDateTime: taskDuration.start, dueDateTime: taskDuration.end };
      const js = JSON.stringify(obj);

      try {
        const response = await fetch(buildPath(`api/tasks/${taskDuration.task}/dates`), {
          method: 'PUT',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        setTaskDurations((prevDurations) =>
          prevDurations.map((duration) =>
            duration._id === taskDuration._id ? taskDuration : duration
          )
        );
      } catch (error) {
        console.error('Error updating task dates: ', error);
      }

      setResizingTask(null);
      setResizeDirection(null);
      setIsResizing(false);
    }
    if (isDragging) {
      setIsDragging(false);
      handleDragEnd(taskDurationElDraggedId);
    }
  };


  // Updates the task's dates based off of the user's mouse's position 
  const handleMouseMove = (e) => {
    if (resizingTask && resizeDirection) {
      const taskDuration = taskDurations.find(
        (taskDuration) => taskDuration._id === resizingTask
      );

      if (!taskDuration) {
        return;
      }

      const dateCells = Array.from(document.querySelectorAll('[data-date]'));
      const closestDateCell = dateCells.reduce((closest, cell) => {
        const box = cell.getBoundingClientRect();
        const distance = Math.abs(e.clientX - (box.left + box.right) / 2);

        if (distance < closest.distance) {
          return { cell, distance };
        }

        return closest;
      }, { cell: null, distance: Infinity });

      if (closestDateCell.cell) {
        const newDate = closestDateCell.cell.getAttribute('data-date');
        const id = taskDuration._id.slice(0,24);

        if (resizeDirection === 'left') {
          if (new Date(newDate) <= new Date(taskDuration.end)) {
            taskDuration.start = newDate;
          }
        } else if (resizeDirection === 'right') {
          if (new Date(newDate) >= new Date(taskDuration.start)) {
            taskDuration.end = newDate;
          }
        }
        
        setTaskDurations((prevDurations) =>
          prevDurations.map((duration) =>
            duration._id === taskDuration._id ? { ...taskDuration } : duration
          )
        );
      }
    }



    if (isDragging) {
      const taskDuration = taskDurations.find(
        (taskDuration) => taskDuration._id === taskDurationElDraggedId
      );

      if (!taskDuration) {
        return;
      }

      const dateCells = Array.from(document.querySelectorAll('[data-date]'));



      // Gets the cell date that is closest to the user's mouse
      const closestDateCell = dateCells.reduce((closest, cell) => {
        const box = cell.getBoundingClientRect();
        const distance = Math.abs(e.clientX - (box.left + box.right) / 2);

        if (distance < closest.distance) {
          return { cell, distance };
        }

        return closest;
      }, 
      { cell: null, distance: Infinity }
    );

      // Update's the dates that is closest to the user's mouse's position
      if (closestDateCell.cell) {
        const newStartDate = closestDateCell.cell.getAttribute('data-date');
        const daysDuration = dayDiff(new Date(taskDuration.start), new Date(taskDuration.end));
        const newEndDate = new Date(new Date(newStartDate).setDate(new Date(newStartDate).getDate() + daysDuration - 1));

        taskDuration.start = newStartDate;
        taskDuration.end = createFormattedDateFromDate(newEndDate);

        setTaskDurations((prevDurations) =>
          prevDurations.map((duration) =>
            duration._id === taskDuration._id ? { ...taskDuration } : duration
          )
        );
      }
    }
  };

  // Styling
  const ganttTimePeriod = {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(60px, 1fr)',
    outline: '0.5px solid var(--color-outline)',
    textAlign: 'center',
    height: 'var(--cell-height)',
  };

  const ganttTimePeriodSpan = {
    margin: 'auto',
    fontSize: '20px',
  };

  const ganttTimePeriodSpanMonths = {
    margin: 'auto',
    fontSize: '10px',
  };

  const ganttTimePeriodCell = {
    position: 'relative',
    outline: '0.5px solid var(--color-outline)',
    marginTop: '0.5px',
  };

  const taskDurationBaseStyle = {
    position: 'absolute',
    height: 'calc(var(--cell-height) * 0.75)',
    top: 'calc(var(--cell-height) / 8)',
    zIndex: '1',
    borderRadius: 'var(--border-radius)',
    boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.05)',
    cursor: isEditable && !isResizing ? 'move' : 'default', // Update cursor style
  };
  const currentDayMarkerStyle = {
    position: 'relative',
    width:'2px',
    left:'29px',
    zIndex: '2',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'black'
  }



  const currentDate = new Date();

  function ensureDate(value) {
    if (value instanceof Date) {
      return value;
    }
    const date = new Date(value);
    if (!isNaN(date)) {
      return date;
    } else {
      throw new Error("Invalid date value provided");
    }
  }

  let startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6);
  let endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 6);
  let earliestTaskStartDate = currentDate;
  let latestTaskDueDate = currentDate;


  if(numberOfTasks > 0){
    earliestTaskStartDate = leftBoundary;
    latestTaskDueDate = rightBoundary;

    earliestTaskStartDate = ensureDate(earliestTaskStartDate);
    latestTaskDueDate = ensureDate(latestTaskDueDate);

    // Gets the start and end dates
    startMonth = new Date(earliestTaskStartDate.getFullYear(), earliestTaskStartDate.getMonth() - 6);
    endMonth = new Date(earliestTaskStartDate.getFullYear(), earliestTaskStartDate.getMonth() + 6);
  }

  const numMonths = monthDiff(startMonth, endMonth) + 1;
  let month = new Date(startMonth);

  let monthRows = [];
  let dayRows = [];
  let dayRow = [];
  let weekRows = [];
  let weekRow = [];
  let taskRows = [];
  let taskRow = [];
  let currentDayIndex = 0;
  let dayCounter = -1;
  let numDaysForBoundaries = 0;

  if(earliestTaskStartDate <= currentDate){
    for (let countMonths = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1); countMonths < earliestTaskStartDate; countMonths.setDate(countMonths.getDate() + 1)) {
      numDaysForBoundaries++;
    }
  }
  else{
    for (let countMonths = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1); countMonths < new Date(endMonth.getFullYear(), endMonth.getMonth(), 1); countMonths.setDate(countMonths.getDate() + 1)) {
      numDaysForBoundaries++;
    }
  }

  // console.log("NumDaysForBoundaries: ", numDaysForBoundaries);

  // Get the st, th, and rd for the respective numbers
  function getOrdinal(n) {
    return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th";
  }

  // Begins the loops for adding elements, with styling, to their respective arrays
  for (let i = 0; i < numMonths; i++) {
    monthRows.push(
      <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
        <span style={ganttTimePeriodSpan}>
          {months[month.getMonth()] + ' ' + month.getFullYear()}
        </span>
      </div>
    );


    const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);
    const currYear = month.getFullYear();
    const currMonth = month.getMonth() + 1;

    for (let j = 1; j <= numDays; j++) {
      let k = getOrdinal(j);

      const formattedDate = createFormattedDateFromStr(currYear, currMonth, j);
      const nextDate = getNextDateFromStr(currYear,currMonth,j);
      if (new Date(formattedDate).toDateString() === currentDate.toDateString()) { 
        currentDayIndex = dayCounter; 
        }
        if(new Date(nextDate).toDateString() === currentDate.toDateString()){
            //console.log("current day: " + new Date(nextDate).toDateString())
            dayRow.push(
                <div>
                <div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
                  <span style={ganttTimePeriodSpanMonths}>
                    {getDayOfWeek(currYear, currMonth - 1, j - 1)} {j}{k}
                  </span>
                </div>
                <div id='currentDayMarker' style={{
                    ...currentDayMarkerStyle,
                    height:`calc(var(--cell-height)*${currentDayMarkerHeight})`
                  }}
                />
                </div>
              );
              
        }
        else{
            dayRow.push(
            
                <div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
                <span style={ganttTimePeriodSpanMonths}>
                    {getDayOfWeek(currYear, currMonth - 1, j - 1)} {j}{k}
                </span>
                </div>
        
            );
        }

      weekRow.push(
        
        <div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
          <span style={{ ...ganttTimePeriodSpanMonths, color: '#3E455B' }}>
            {getDayOfWeek(currYear, currMonth - 1, j - 1)}
          </span>
        </div>

      );

      dayCounter++;
    }

    dayRows.push(
      <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
        {dayRow}
      </div>
    );

    weekRows.push(
      <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
        {weekRow}
      </div>
    );

    dayRow = [];
    weekRow = [];
    month.setMonth(month.getMonth() + 1);
  }

  if (tasks) {
    tasks.forEach((task, index) => {
      const startDate = task.startDateTime;
      const dueDate = task.dueDateTime;
      let mnth = new Date(startMonth);
      for (let i = 0; i < numMonths; i++) {
        const curYear = mnth.getFullYear();
        const curMonth = mnth.getMonth() + 1;

        const numDays = getDaysInMonth(curYear, curMonth);

        for (let j = 1; j <= numDays; j++) {

          
          const dayOfTheWeek = getDayOfWeek(curYear, curMonth - 1, j - 1);
          const formattedDate = createFormattedDateFromStr(curYear, curMonth, j);
          var taskHappening=false;
          if(task['pattern'] && (task['pattern'] in patterns)){
            taskHappening = isTaskHappeningNow(startDate,dueDate,formattedDate);
          } 

          taskRow.push(
            <div
              key={`${task._id}-${j}`}
              style={{
                ...ganttTimePeriodCell,
                backgroundColor:
                  dayOfTheWeek === 'S' ? 'var(--color-tertiary)' : index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                ...(hoveredRow === task._id && { backgroundColor: '#f0f0f0' }),
              }}

              data-task={task?._id}
              data-date={formattedDate}
              data-task-id={task._id}
              onDrop={onTaskDurationDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onMouseEnter={() => setHoveredRow(task._id)} 
              onMouseLeave={() => setHoveredRow(null)} 
            >

              {taskDurations.map((el, i) => {
                {/*Added this to prevent tasks from rendering past the last month of the current calender year*/}
                const elStartDate = el?.start.split('T')[0];
                let endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 7, 0); 
                const formattedEndMonth = endMonth.toISOString().split('T')[0];
                const adjustedEndDate = new Date(el?.end).getTime() > new Date(formattedEndMonth).getTime()  
                  ? formattedEndMonth 
                  : el?.end;

                if (el?.task === task?._id && elStartDate === formattedDate) {
                  return (
                    
                    <div
                      key={`${i}-${el?.task}`}

                
                      className={`task-duration ${taskDurationElDraggedId === el?._id ? 'dragging' : ''}`}
                                 
                      draggable={isEditable && !isResizing ? "true" : "false"}

                      tabIndex="0"
                      onDragStart={isEditable && !isResizing ? () => handleDragStart(el?._id) : null}
                      onDragEnd={isEditable && !isResizing ? () => handleDragEnd(el?._id) : null}
                      onMouseMove={(e) => handleMouseMove(e)}


                      onMouseUp={handleResizeEnd}

                      style={{
                        ...taskDurationBaseStyle,
                        width: `calc(${dayDiff(el?.start, adjustedEndDate)} * 100% - 1px)`,
                        opacity: taskDurationElDraggedId === el?._id ? '0.5' : '1',
                        background: task.color || 'var(--color-primary-light)',
                        backgroundImage: patterns[task.pattern] ? `url(${patterns[task.pattern]})` : 'none',
                        backgroundSize: 'contain',
                        cursor: isEditable && !isResizing ? 'move' : 'default',
                        
                      }}

                      onKeyDown={isEditable ? (e) => deleteTaskDuration(e, el?.task) : null}
                      onClick={() => {
                        if (!isResizing) { // Prevents showing details after resizing task bar.
                          setSelectedTask(task);
                          setShowDetails(true);
                        }
                      }}
                      onMouseEnter={() => setHoveredTask(el?._id)} 
                      onMouseLeave={() => setHoveredTask(null)} 
                    >

                      {isEditable && (
                        <>
                      
                          <div
                            className="resize-handle left"
                            onMouseDown={(e) => handleResizeStart(e, el?._id, 'left')}
                            style={{ cursor: 'ew-resize', position: 'absolute', left: '0', width: '10px', height: '100%', zIndex: 3 }}
                          />
                          <div
                            className="resize-handle right"
                            onMouseDown={(e) => handleResizeStart(e, el?._id, 'right')}
                            style={{ cursor: 'ew-resize', position: 'absolute', right: '0', width: '10px', height: '100%', zIndex: 3 }}
                          />
                            
                        </>
                      )}

                      {(hoveredTask === el?._id || resizingTask === el?._id) && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '15%',
                            left: '100%',
                            transform: 'translateX(2px)', 
                            color: 'black',
                            whiteSpace: 'nowrap', // Using this to keep text in a single line
                            padding: '2px 5px',
                            fontFamily:'Montserrat, sans-serif',
                            fontSize: '12px'
                            }}
                        >
                        {`${el.start.split('T')[0].replace(/-/g, '/')}  -  ${el.end.split('T')[0].replace(/-/g, '/')}`}
                        </div>
                      )}
                    </div>
                  );
                }
                
              })}
            </div>
          );
        }

        taskRows.push(
          
          <div key={`${i}-${task?._id}`} style={ganttTimePeriod}>
            {taskRow}
          </div>

        );

        taskRow = [];
        mnth.setMonth(mnth.getMonth() + 1);
      }
    });
  }

  const handleDelete = async (taskId, projectId) => {
    try {
      const response = await fetch(buildPath(`api/tasks/${taskId}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Task deleted successfully:', data);

      
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setTaskDurations(prevDurations => prevDurations.filter(duration => duration.task !== taskId));
      console.log(tasks)
  
      //window.location.reload(); 
      setShowDetails(false);
      setSelectedTask(null);
      setCurrentDayMarkerHeight(currentDayMarkerHeight - 1);
      console.log(projectId.tasks.length)
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  function deleteTaskDuration(e, id) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (window.confirm('Are you sure you want to delete?')) {
        handleDelete(id, projectId);
      }
    }
  }

  function handleDragStart(taskDurationId) {
    if (!resizingTask) {
      
      setTaskDurationElDraggedId(taskDurationId);
      setHoveredTask(null);
      setIsDragging(true);
      console.log("Drag started for taskDurationId:", taskDurationId);
    }
  }


  function handleDragEnd(taskDurationId) {

    if (!resizingTask) {

      setTaskDurationElDraggedId(null);

      setHoveredTask(null);
      
      setIsDragging(false);
      
      console.log("Drag ended for taskDurationId:", taskDurationId);
    }
  }



  async function onTaskDurationDrop(e) {
    const targetCell = e.target;

    const taskDuration = taskDurations.find(
      (taskDuration) => taskDuration._id === taskDurationElDraggedId
    );

    if (!taskDuration) {
      return;
    }

    const dataTask = targetCell.getAttribute('data-task');
    const dataDate = targetCell.getAttribute('data-date');
    const targetTaskId = targetCell.getAttribute('data-task-id');

    console.log(taskDuration)
    console.log(targetTaskId)

    if (taskDuration.task !== targetTaskId) {
      console.log("Task can only be dropped within its respective row.");
      return;
    }

    const adjustedDataDate = new Date(dataDate + 'T00:00:00');
    const originalStartDate = new Date(taskDuration.start.split('T')[0] + 'T00:00:00');
    const daysDuration = dayDiff(new Date(taskDuration.start), new Date(taskDuration.end));

    const newStartDate = new Date(adjustedDataDate);
    let newEndDate = new Date(newStartDate);

    
    newEndDate.setDate(newEndDate.getDate() + daysDuration - 1);

    const allowableRange = 1;

    if (!targetCell.hasAttribute('draggable') || Math.abs(dayDiff(originalStartDate, newStartDate)) <= allowableRange) {
      
      taskDuration.task = dataTask;
      taskDuration.start = createFormattedDateFromDate(newStartDate);
      taskDuration.end = createFormattedDateFromDate(newEndDate);

      const newTaskDurations = taskDurations.filter(
        (taskDuration) => taskDuration._id !== taskDurationElDraggedId
      );
      newTaskDurations.push(taskDuration);

      try {
        const obj = { startDateTime: taskDuration.start, dueDateTime: taskDuration.end };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath(`api/tasks/${taskDuration.task}/dates`), {
          method: 'PUT',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        setTaskDurations(newTaskDurations);
        console.log("Dropped taskDuration:", taskDuration);

      } catch (error) {
        console.error('Error editing tasks: ', error);
      }
    } 
    
    else {
      console.log("It's occupied!");
    }

    setTaskDurationElDraggedId(null);
  }

  useEffect(() => {
    if (ganttRef.current) {
      let cellWidth = 60;
      let scrollPosition = numDaysForBoundaries * cellWidth;

      console.log("Triggered");

      if(timeRange == "3-months"){
        console.log("if statement...");
        cellWidth *= 3;
        scrollPosition = (numDaysForBoundaries / 3) * cellWidth;


        
        console.log("Scrolling to current day index:", currentDayIndex, "Scroll position:", scrollPosition);
      }

      if(numberOfTasks > 0){
  
        ganttRef.current.scrollLeft = scrollPosition;
        console.log("Scrolling to current day index:", currentDayIndex, "Scroll position:", scrollPosition);
      }
      else{
        scrollPosition = currentDayIndex * cellWidth;
  
        ganttRef.current.scrollLeft = scrollPosition;
        console.log("Scrolling to current day index:", currentDayIndex, "Scroll position:", scrollPosition);
      }
    }
  }, [currentDayIndex, numberOfTasks, timeRange]);

  useEffect(() => {
    if(timeRange == "3-months"){
      setNumberOfTasks(numberOfTasks);
    }
  }, [timeRange]);

  return (

    <div
      id="gantt-grid-container__time"
      style={{ gridTemplateColumns: `repeat(${numMonths}, 1fr)` }}
      ref={ganttRef}
    >
      {monthRows}
      {dayRows}

      <div
        id="gantt-time-period-cell-container"
        style={{
          gridColumn: '1/-1',
          display: 'grid',
          gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
          paddingLeft: '0.5px',
          paddingBottom: '-100px',
        }}

        
        onMouseMove={handleMouseMove}
        onMouseUp={handleResizeEnd}
        onDragOver={(e) => e.preventDefault()}
      >
        {taskRows}
      </div>

      <TaskDetails
        show={showDetails}
        onHide={() => setShowDetails(false)}
        task={selectedTask}
        handleDelete={handleDelete}
        userId={userId}
      />
    </div>
  );
}
