import {buildPath} from '../buildPath';

async function AddTask({ taskTitle, description, dueDateTime, startDateTime, assignedTasksUsers, color, pattern, taskCategory, projectId, userId, setTasks, taskPrerequisites, dependentTasks, allowEmailNotifcations }) 
{
  const newTask = {
    description,
    dueDateTime,
    progress: "In-Progress",
    assignedTasksUsers,
    taskTitle,
    tiedProjectId: projectId,
    taskCreatorId: userId,
    startDateTime,
    color,
    pattern,
    taskCategory,
    taskPrerequisites,
    dependentTasks,
    allowEmailNotifcations,
  };

  try {
    const response = await fetch(buildPath('api/createtask'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const createdTask = await response.json();
    setTasks(prevTasks => [...prevTasks, createdTask]);
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

export default AddTask;
