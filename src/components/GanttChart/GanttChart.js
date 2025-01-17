import { useState, useEffect } from 'react';
import AddTaskDuration from './AddTaskDuration';
import AddTask from './AddTask';
import Grid from './Grid';
import Settings from './Settings';
import Tasks from './Tasks';
import TimeRange from './TimeRange';
import TimeTable from './TimeTable';
import TaskDetails from './TaskDetails';
import './GanttChart.css';
import { buildPath } from '../buildPath';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

export default function GanttChart({ projectId, setUserRole, userRole }) {
  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  var userId = ud._id;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [tasks, setTasks] = useState([]);
  const [taskDurations, setTaskDurations] = useState([]);
  const [timeRange, setTimeRange] = useState({
    fromSelectMonth: currentMonth,
    fromSelectYear: currentYear.toString(),
    toSelectMonth: currentMonth + 1, 
    toSelectYear: currentYear.toString(),
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);


  const [sortBy, setSortBy] = useState('alphabetical'); // Default sort by alphabetical


  const sortTasks = (tasks) => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const category = task?.taskCategory || 'No Category Assigned';
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    }, {});

    const sortedCategories = Object.keys(groupedTasks)
      .filter(category => category !== 'No Category Assigned')
      .sort();

    const noCategoryTasks = groupedTasks['No Category Assigned'] || [];

    const sortedTasks = [];

    sortedCategories.forEach(category => {
      const tasksInCategory = groupedTasks[category]
        .sort((a, b) => {
          if (sortBy === 'alphabetical') {
            return (a?.taskTitle || '').localeCompare(b?.taskTitle || '');
          } else if (sortBy === 'created') {
            return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
          }
          return 0;
        });
      sortedTasks.push(...tasksInCategory);
    });

    const sortedNoCategoryTasks = noCategoryTasks.sort((a, b) =>
      sortBy === 'alphabetical' 
        ? (a?.taskTitle || '').localeCompare(b?.taskTitle || '')
        : new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
    );

    sortedTasks.push(...sortedNoCategoryTasks);

    return sortedTasks;
  };


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

        if (isFounder) {
          setUserRole('founder');
        } else if (isEditor) {
          setUserRole('editor');
        } else {
          setUserRole('member');
        }

      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [projectId, userId, setUserRole]);

  //Fetch Tasks 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const obj = { projectId };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/search/tasks/project'), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });


        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        const fetchedTasks = await response.json();

        if (!fetchedTasks) {
          throw new Error('No tasks found in the response.');
        }

        const sortedTasks = sortTasks(fetchedTasks);

        const durations = sortedTasks.map(task => { //changed
          const duration = {
            task: task._id,
            start: task.startDateTime,
            end: task.dueDateTime
          };
          if (!duration._id) {
            duration._id = `${task._id}-${Date.now()}`;
          }
          return duration;
        });

        setTasks(sortedTasks);
        setTaskDurations(durations);


        sessionStorage.setItem("tasks", JSON.stringify(sortedTasks));

      } catch (error) {
        console.error('Error fetching tasks: ', error);
      }
    };

    fetchTasks();
  }, [projectId, userId, setUserRole, sortBy]);

  useEffect(() => {
    const savedSortOption = sessionStorage.getItem("sortBy");
    if (savedSortOption) {
      setSortBy(savedSortOption); // Set the sort option to the saved value
    }
  }, []);

  useEffect(() => {}, [taskDurations]);

  useEffect(() => {
    const sortedTasks = sortTasks(tasks); // Sort the current tasks based on the selected sorting method
    setTasks(sortedTasks); // Update the state with sorted tasks
  }, [sortBy]); // Trigger re-sorting whenever sortBy changes
  

  useEffect(() => {
    document.documentElement.style.setProperty('--task-count', tasks.length);
  }, [tasks]);

  const handleTimeRangeChange = (event) => {
    const selectedRange = event.target.value;
    console.log("Selected Time Range:", selectedRange);
    setTimeRange(selectedRange); // Update the timeRange state to trigger TimeTable re-render
  };

  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy); // Update the sorting preference
    sessionStorage.setItem("sortBy", newSortBy); // Save the sort option in sessionStorage
  };
  

  return (
    <div id="gantt-container">
      <Grid>
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
          setTaskDurations={setTaskDurations}
          userRole={userRole}
          setSelectedTask={setSelectedTask}
          setShowDetails={setShowDetails}
        />
        <TimeTable
          timeRange={timeRange}
          tasks={tasks}
          setTasks={setTasks}
          taskDurations={taskDurations}
          setTaskDurations={setTaskDurations}
          userId={userId}
          projectId={projectId}
          userRole={userRole}
        />
      </Grid>

      <TaskDetails
        show={showDetails}
        onHide={() => setShowDetails(false)}
        task={selectedTask}
        handleDelete={(taskId) => setTasks(tasks.filter(task => task._id !== taskId))}
        userId={userId}
      />

      <div class="gantt-chart-time-range-selector">
        <select class="gantt-chart-time-range-selection" onChange={(e) => handleTimeRangeChange(e)}>
          <option value="">Range</option>
          <option value="3-months">3 Months</option>
          <option value="6-months">6 Months</option>
          <option value="1-year">1 Year</option>
          <option value="fit">Fit All Tasks</option>
        </select>
      </div>

      <div className="gantt-chart-sort-selector">
        <select className="gantt-chart-sort-selection" onChange={handleSortChange} value={sortBy}>
          <option value="alphabetical">Alphabetical</option>
          <option value="created">By Creation Date</option>
        </select>
      </div>
      

    </div>
  );
}
