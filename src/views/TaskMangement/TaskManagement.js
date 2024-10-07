import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import DemoNavbar from "components/Navbars/DemoNavbar";
import Loader from "views/Loader/Loader";
import "./TaskManagement.css";

import { AccountTreeOutlined, CategoryOutlined, PortraitOutlined, ViewKanbanOutlined, ViewTimelineOutlined } from "@mui/icons-material";
import TaskDetailDialog from "./TaskDetailDialog";

// Axios instance for API calls
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Initial state setup for tasks and columns
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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetching tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get('tasks/fetch');
        const tasksData = response.data;

        const tasks = {};
        const updatedColumns = { ...initialData.columns };

        tasksData.forEach(task => {
          tasks[task.id] = {
            id: task.id,
            title: task.title,
            description: task.description,
            employee_id: task.employee_id,
            priority: task.priority,
            create_at: task.created_at,
          };

          const taskStatus = task.status.replace(/ /g, "-").toLowerCase();
          if (updatedColumns[taskStatus]) {
            updatedColumns[taskStatus].taskIds.push(task.id);
          }
        });

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

  // Handle drag and drop task movement
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Reordering tasks within the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      const newState = { ...data, columns: { ...data.columns, [newColumn.id]: newColumn } };
      setData(newState);
      return;
    }

    // Moving tasks between columns
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

    // API call to update the task status in the backend
    const updatedTask = {
      id: draggableId,
      employee_id: data.tasks[draggableId].employee_id,
      status: destination.droppableId.replace(/-/g, " "),
    };

    try {
      const response = await api.post('tasks/update', updatedTask);
      console.log("Update response:", response.data);
    } catch (error) {
      console.error("Error updating task status:", error.response ? error.response.data : error.message);
    }
  };

  // Get task priority icon based on the priority level
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 1:
        return <ViewKanbanOutlined style={{ color: "green" }} />;
      case 2:
        return <ViewTimelineOutlined style={{ color: "orange" }} />;
      case 3:
        return <AccountTreeOutlined style={{ color: "red" }} />;
      default:
        return <CategoryOutlined style={{ color: "gray" }} />;
    }
  };

  // Handle task card click to show task details in a dialog
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
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
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              onClick={() => handleTaskClick(task)} // Handle click to open dialog
                            >
                              <div className="task-header">
                                <p className="employee-id">
                                  <span className="mr-1">{getPriorityIcon(task.priority)} </span>
                                  {task.employee_id}
                                </p>
                                <p className="task-title">{task.title}</p>
                              </div>
                              <p className="task-description">
                                {task.description.length > 50
                                  ? `${task.description.substring(0, 50)}...`
                                  : task.description}
                              </p>
                              <div className="task-footer">
                                <p className="created-at m-0 p-0">{new Date(task.create_at).toLocaleDateString()}</p>
                                <p className="p-0 m-0">
                                  <PortraitOutlined style={{ background: "#3B82f0", borderRadius: "5px", color: "#2c3e50" }} />
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      <TaskDetailDialog
        isOpen={isDialogOpen}
        task={selectedTask}
        onClose={() => setDialogOpen(false)} // Close dialog
      />
    </>
  );
};

export default TaskManagement;
