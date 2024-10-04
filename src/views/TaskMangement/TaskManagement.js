import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import DemoNavbar from "components/Navbars/DemoNavbar";
import Loader from "views/Loader/Loader";
import "./TaskManagement.css"; // Import external CSS
import { Chip } from "@mui/material";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

const initialData = {
  tasks: {},
  columns: {
    todo: { id: "todo", title: "TO DO", taskIds: [] },
    "in-progress": { id: "in-progress", title: "IN PROGRESS", taskIds: [] },
    "ready-for-staging": { id: "ready-for-staging", title: "READY FOR STAGING", taskIds: [] },
    staging: { id: "staging", title: "STAGING", taskIds: [] },
    "ready-for-production": { id: "ready-for-production", title: "READY FOR PRODUCTION", taskIds: [] },
    production: { id: "production", title: "PRODUCTION", taskIds: [] },
    done: { id: "done", title: "DONE", taskIds: [] },
    block: { id: "block", title: "BLOCK", taskIds: [] },
  },
  columnOrder: ["todo", "in-progress", "ready-for-staging", "staging", "ready-for-production", "production", "done", "block"],
};

const TaskManagement = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("EMPSHI122"); // Set this to the actual employee ID

  // Fetch tasks from the API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get('tasks/fetch');
        const tasksData = response.data;

        // Initialize tasks and reset column taskIds
        const tasks = {};
        const updatedColumns = { ...initialData.columns };

        // Populate tasks and columns
        tasksData.forEach(task => {
          // Store the task in the tasks object
          tasks[task.id] = { id: task.id, title: task.title, description: task.description }; // Assuming the API returns an id, title, and description

          // Get the task's status and convert it to a valid column ID
          const taskStatus = task.status.replace(/ /g, "-").toLowerCase();

          // If the taskStatus exists in the columns, add the task ID
          if (updatedColumns[taskStatus]) {
            updatedColumns[taskStatus].taskIds.push(task.id);
          }
        });

        // Update state with fetched tasks and columns
        setData({
          tasks: tasks,
          columns: updatedColumns,
          columnOrder: initialData.columnOrder,
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task drag and drop
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // If moving within the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      const newState = { ...data, columns: { ...data.columns, [newColumn.id]: newColumn } };
      setData(newState);
      return;
    }

    // Moving to a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    const newState = {
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    };
    setData(newState);

    // Prepare the updated task
    const updatedTask = {
      id: draggableId, // Send the task ID
      employee_id: employeeId, // Include the employee ID
      status: destination.droppableId.replace(/-/g, " "), // Convert droppableId to status
    };

    // Update task status in the backend
    try {
      const response = await api.post('tasks/update', updatedTask);
      console.log("Update response:", response.data); // Log the response
    } catch (error) {
      console.error("Error updating task status:", error.response ? error.response.data : error.message);
    }
  };


  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 1:
        return { label: "Low", color: "green" };
      case 2:
        return { label: "Medium", color: "orange" };
      case 3:
        return { label: "High", color: "red" };
      default:
        return { label: "Low", color: "green" };
    }
  };

  

  return (
     <>
      <DemoNavbar size="sm" />
      {loading && <Loader />}
      <div className="task-management-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="columns-container">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
                      <h3 className="column-title">{column.title}</h3>
                      {tasks.map((task, index) => {
                        const { label, color } = getPriorityBadge(task.priority);

                        return (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                className="task-card"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                              >
                                <div className="task-header">
                                  <p className="employee-id">{task.employee_id}</p>
                                  <h4 className="task-title">{task.title}</h4>
                                </div>
                                <p className="task-description">
                                  {task.description.length > 50
                                    ? `${task.description.substring(0, 50)}...`
                                    : task.description}
                                </p>
                                <div className="task-footer">
                                  <p className="created-at">{new Date(task.create_at).toLocaleDateString()}</p>
                                  <Chip label={label} style={{ backgroundColor: color, color: 'white' }} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default TaskManagement;
