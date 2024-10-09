import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import DemoNavbar from "components/Navbars/DemoNavbar";
import Loader from "views/Loader/Loader";
import "./TaskManagement.css";
import {
  AccountTreeOutlined,
  CategoryOutlined,
  PortraitOutlined,
  ViewKanbanOutlined,
  ViewTimelineOutlined,
} from "@mui/icons-material";
import TaskDetailDialog from "./TaskDetailDialog";
import { Card } from "reactstrap";
import { CardContent } from "@mui/material";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

const initialData = {
  tasks: {},
  columns: {
    todo: { id: "todo", title: "TO DO", taskIds: [] },
    "in-progress": { id: "in-progress", title: "IN PROGRESS", taskIds: [] },
    "ready-for-staging": {
      id: "ready-for-staging",
      title: "READY FOR STAGING",
      taskIds: [],
    },
    staging: { id: "staging", title: "STAGING", taskIds: [] },
    "ready-for-production": {
      id: "ready-for-production",
      title: "READY FOR PRODUCTION",
      taskIds: [],
    },
    production: { id: "production", title: "PRODUCTION", taskIds: [] },
    done: { id: "done", title: "DONE", taskIds: [] },
    block: { id: "block", title: "BLOCK", taskIds: [] },
  },
  columnOrder: [
    "todo",
    "in-progress",
    "ready-for-staging",
    "staging",
    "ready-for-production",
    "production",
    "done",
    "block",
  ],
};

const TaskManagement = () => {
  const [data, setData] = useState(initialData);
  const [sprintData, setSprintData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await api.get("tasks/fetch");
        const sprints = response.data.sprints;

        const tasks = {};
        const updatedColumns = { ...initialData.columns };

        sprints.forEach((sprint) => {
          sprint.tasks.forEach((task) => {
            tasks[task.id] = {
              id: task.id,
              title: task.title,
              description: task.description,
              employee_id: task.employee_id,
              priority: task.priority,
              created_at: task.created_at,
            };

            const taskStatus = task.status.replace(/ /g, "-").toLowerCase();
            if (updatedColumns[taskStatus]) {
              updatedColumns[taskStatus].taskIds.push(task.id);
            }
          });
        });

        setSprintData(sprints); // Store all sprints
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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    console.log("Drag result:", result); // Add this line to check the result

    if (!destination) {
        console.log("No destination"); // Debugging line
        return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        console.log("Dropped in the same place"); // Debugging line
        return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Debugging lines to ensure finish is defined
    console.log("Start column:", start);
    console.log("Finish column:", finish);

    // Check if moving within the same column
    if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = { ...start, taskIds: newTaskIds };
        const newState = { ...data, columns: { ...data.columns, [newColumn.id]: newColumn } };
        setData(newState);
        return;
    }

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

    // Only update status if the task is being moved to a different sprint
    if (start.id !== finish.id) {
        const updatedTask = {
            id: draggableId,
            employee_id: data.tasks[draggableId].employee_id,
            status: finish.droppableId.replace(/-/g, " "), // Update only if moving to another sprint
        };

        try {
            const response = await api.post('tasks/update', updatedTask);
            console.log("Update response:", response.data);
        } catch (error) {
            console.error("Error updating task status:", error.response ? error.response.data : error.message);
        }
    }
};



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
          {sprintData.length > 0 ? (
            sprintData.map((sprint, index) => (
              <div key={sprint.id}>
                <Card>
                  <CardContent
                    className="bg-primary p-2 px-3 "
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <span>
                        {sprint.id}
                        {" - "}
                      </span>
                      <span>{sprint.name}</span>
                      {" / "}
                      <span className="text-warning">
                        <span style={{ fontSize: "16px", marginTop: "5px" }}>
                          <UserCircle
                            className="m-0 p-0"
                            style={{ fontSize: "20px" }}
                          />
                          {sprint.employee_id}
                        </span>
                      </span>
                      {" / "}
                      <span>{sprint.goal}</span>
                    </div>
                    <div>
                      <span className="badge border border-1">
                        {"Start - "}
                        {new Date(sprint.start_date).toLocaleDateString()}{" "}
                      </span>
                      <span
                        style={{ marginLeft: "10px" }}
                        className="badge border border-1"
                      >
                        {" End - "}
                        {new Date(sprint.end_date).toLocaleDateString()}{" "}
                      </span>

                      <span style={{ marginLeft: "10px" }}>
                        {" Created At - "}
                        {new Date(sprint.created_at).toLocaleDateString()}{" "}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div key={index} className="columns-container mt-0">
                  {data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId];
                    const tasks = column.taskIds
                      .map((taskId) => data.tasks[taskId])
                      .filter((task) =>
                        sprint.tasks.some((sprintTask) => sprintTask.id === task.id)
                      ); // Filter tasks based on current sprint

                    return (
                      <Droppable droppableId={column.id} key={column.id}>
                        {(provided) => (
                          <div
                            className="column"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <h3 className="column-title">{column.title}</h3>
                            {tasks.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    className="task-card"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={provided.draggableProps.style}
                                    onClick={() => handleTaskClick(task)}
                                  >
                                    <div className="task-header">
                                      <p className="employee-id">
                                        <span className="mr-1">
                                          {getPriorityIcon(task.priority)}{" "}
                                        </span>
                                        {task.employee_id}
                                      </p>
                                      <p className="task-title">{task.title}</p>
                                    </div>
                                    <p className="task-description">
                                      {task.description.length > 50
                                        ? `${task.description.substring(
                                            0,
                                            50
                                          )}...`
                                        : task.description}
                                    </p>
                                    <div className="task-footer">
                                      <p className="created-at m-0 p-0">
                                        {new Date(
                                          task.created_at
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="p-0 m-0">
                                        <PortraitOutlined
                                          style={{
                                            background: "#3B82f0",
                                            borderRadius: "5px",
                                            color: "#2c3e50",
                                          }}
                                        />
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
              </div>
            ))
          ) : (
            <p className="no-data-text">No sprint yet.</p>
          )}
        </DragDropContext>
      </div>
      <TaskDetailDialog
        open={isDialogOpen}
        handleClose={() => setDialogOpen(false)}
        task={selectedTask}
      />
    </>
  );
};

export default TaskManagement;
