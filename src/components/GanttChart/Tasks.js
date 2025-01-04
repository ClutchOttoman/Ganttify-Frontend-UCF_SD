import { useEffect, useRef } from 'react';
import './Tasks.css';

export default function Tasks({ tasks, setSelectedTask, setShowDetails, sortOption }) {
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

  // Group tasks by category
  function groupTasks(tasks) {
    return tasks.reduce((acc, task) => {
      const category = task?.taskCategory || 'No Category Assigned';
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    }, {});
  }

  // Sort categories and tasks based on sortOption
  const groupedTasks = groupTasks(tasks);
  const sortedCategories = Object.keys(groupedTasks).filter(category => category !== 'No Category Assigned');

  if (sortOption === "alphabetical") {
    sortedCategories.sort();
    Object.keys(groupedTasks).forEach(category => {
      groupedTasks[category].sort((a, b) => (a?.taskTitle || '').localeCompare(b?.taskTitle || ''));
    });
  } else if (sortOption === "non_alphabetical") {
    // No sorting applied, tasks retain their original order
  }

  const noCategoryTasks = groupedTasks['No Category Assigned'] || [];

  return (
    <div id="gantt-grid-container__tasks">
      <div className="gantt-task-row placeholder-row first-placeholder-row"></div>
      <div className="gantt-task-row placeholder-row second-placeholder-row"></div>

      {/* Render tasks for categories */}
      {sortedCategories.map((category) => (
        <div key={category}>
          
          {groupedTasks[category].map((tsk, i) => (
            <div key={`${tsk?._id}-${i}`} className="gantt-task-row" onClick={() => handleTaskClick(tsk)}>
              <p data-task-id={tsk?._id} ref={(el) => (inputRef.current[i] = el)} className="task-title-text">
                {tsk?.taskTitle}
              </p>
              {tsk?.taskCategory && <span className="task-category">{tsk?.taskCategory}</span>}
            </div>
          ))}
        </div>
      ))}

      {/* Render tasks with "No Category Assigned" at the end */}
      {noCategoryTasks.length > 0 && (
        <div>
          
          {noCategoryTasks.map((tsk, i) => (
            <div key={`${tsk?._id}-${i}`} className="gantt-task-row" onClick={() => handleTaskClick(tsk)}>
              <p data-task-id={tsk?._id} ref={(el) => (inputRef.current[i] = el)} className="task-title-text">
                {tsk?.taskTitle}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
