import { useEffect, useRef } from 'react';
import './Tasks.css';

export default function Tasks({ tasks, setTasks, setTaskDurations, setSelectedTask, setShowDetails }) {
  
  const inputRef = useRef([]);
  const indexRef = useRef(null);

  useEffect(() => {
    if (inputRef.current.length && indexRef.current >= 0) {
      inputRef?.current[indexRef.current]?.focus();
    }
  });

  function handleTaskClick(task) {
    setSelectedTask(task);
    setShowDetails(true);
  }

  // Separate tasks with categories and tasks with no category assigned
  function sortTasks(tasks) {
    const groupedTasks = tasks.reduce((acc, task) => {
      const category = task?.taskCategory || 'No Category Assigned';
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    }, {});
    return groupedTasks;
  }

  const groupedTasks = sortTasks(tasks);
  const sortedCategories = Object.keys(groupedTasks).filter(category => category !== 'No Category Assigned').sort();
  const noCategoryTasks = groupedTasks['No Category Assigned'] || [];

  return (
    <div id="gantt-grid-container__tasks">
      <div className="gantt-task-row placeholder-row first-placeholder-row"></div>
      <div className="gantt-task-row placeholder-row second-placeholder-row"></div>

      {/* Render tasks for categories */}
      {sortedCategories.map((category) => (
        <div key={category}>
          

          {/* Render tasks within the category, sorted alphabetically by taskTitle */}
          {groupedTasks[category].sort((a, b) => (a?.taskTitle || '').localeCompare(b?.taskTitle || '')) // Sort tasks alphabetically by taskTitle
            .map((tsk, i) => (
              <div key={`${tsk?._id}-${i}`} className="gantt-task-row" onClick={() => handleTaskClick(tsk)}>
                <p data-task-id={tsk?._id} ref={(el) => (inputRef.current[i] = el)} className="task-title-text">
                  {tsk?.taskTitle}
                </p>
                {tsk?.taskCategory && <span className="task-category">{tsk?.taskCategory}</span>} {/* Display taskCategory */}
              </div>
            ))}
        </div>
      ))}

      {/* Render tasks with "No Category Assigned" at the end */}
      {noCategoryTasks.length > 0 && (
        <div>
          
          {noCategoryTasks
            .sort((a, b) => a?.taskTitle?.localeCompare(b?.taskTitle)) // Sort tasks alphabetically by taskTitle
            .map((tsk, i) => (
              <div key={`${tsk?._id}-${i}`} className="gantt-task-row" onClick={() => handleTaskClick(tsk)}>
                <p data-task-id={tsk?._id} ref={(el) => (inputRef.current[tsk._id] = el)} className="task-title-text">
                  {tsk?.taskTitle}
                </p>
                {tsk?.taskCategory && <span className="task-category">{tsk?.taskCategory}</span>} {/* Display taskCategory */}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
