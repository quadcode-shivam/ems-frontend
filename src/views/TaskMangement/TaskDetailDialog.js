import React, { useState, useEffect } from "react"; // Import useEffect
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import { taskDetailUpdate, taskHistryFetch } from "api"; // Corrected to taskHistoryFetch
import {
  AccountTreeOutlined,
  CategoryOutlined,
  ViewKanbanOutlined,
  ViewTimelineOutlined,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import "./TaskManagement.css";

const TaskDetailDialog = ({ isOpen, task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState({});
  const [historyEntries, setHistoryEntries] = useState([]);
  const [code, setCode] = useState();

  // Fetch task history when the dialog opens and a valid task is provided
  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && task?.id) {
        try {
          const response = await taskHistryFetch(task.id);
          setHistoryEntries(response.data);
          setCode(response.code);
        } catch (error) {
          console.error("Error fetching task history:", error);
        }
      }
    };

    fetchHistory();
  }, [isOpen, task]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
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

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleEdit = (field) => {
    setIsEditing(field);
    setEditableTask({ ...editableTask, [field]: task[field] });
  };

  const handleSave = async (field) => {
    try {
      const updatedTask = {
        ...editableTask,
        id: task.id,
        employee_id: task.employee_id,
      };
      await taskDetailUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = (field) => {
    setEditableTask({ ...editableTask, [field]: task[field] });
    setIsEditing(false);
  };

  const handleInputChange = (e, field) => {
    setEditableTask({ ...editableTask, [field]: e.target.value });
  };

  // Function to extract changed fields
  const getChangedFields = (previousData, newData) => {
    const previous = JSON.parse(previousData);
    const current = JSON.parse(newData);
    const changes = {};

    // Only check for specific fields
    const fieldsToCheck = ["status", "description", "title"];

    fieldsToCheck.forEach((key) => {
      if (previous[key] !== current[key]) {
        changes[key] = { previous: previous[key], current: current[key] };
      }
    });

    return changes;
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "#282e33",
          boxShadow: "none",
          width: "600px",
        },
      }}
      open={isOpen}
      onClose={onClose}
    >
      <DialogContent className="dialog-container">
        {task ? (
          <div>
            <p>
              <span>
                {getPriorityIcon(task.priority)} {task.sprint_name} /{" "}
                {task.employee_id}
              </span>
            </p>

            {/* Title Section */}
            <h6>
              {isEditing === "title" ? (
                <>
                  <TextField
                    variant="outlined"
                    value={editableTask.title}
                    onChange={(e) => handleInputChange(e, "title")}
                    fullWidth
                    InputProps={{
                      style: {
                        backgroundColor: "#1f2125", // Dark background for input
                        color: "white", // Text color
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "white" }, // Label color
                    }}
                  />
                  <IconButton onClick={() => handleSave("title")}>
                    <CheckIcon style={{ color: "green" }} />
                  </IconButton>
                  <IconButton onClick={() => handleCancelEdit("title")}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </>
              ) : (
                <span onClick={() => handleEdit("title")}>{task.title}</span>
              )}
            </h6>

            {/* Description Section */}
            <p>
              <strong>Description:</strong> <br />
              {isEditing === "description" ? (
                <>
                  <TextField
                    variant="outlined"
                    value={editableTask.description}
                    onChange={(e) => handleInputChange(e, "description")}
                    fullWidth
                    multiline
                    rows={3}
                    InputProps={{
                      style: {
                        backgroundColor: "#1f2125", // Dark background for input
                        color: "white", // Text color
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "white" }, // Label color
                    }}
                  />
                  <IconButton onClick={() => handleSave("description")}>
                    <CheckIcon style={{ color: "green" }} />
                  </IconButton>
                  <IconButton onClick={() => handleCancelEdit("description")}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </>
              ) : (
                <span onClick={() => handleEdit("description")}>
                  {task.description}
                </span>
              )}
            </p>

            {/* Tabs for Comments and History */}
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="inherit"
              centered
            >
              <Tooltip title="View Comments" arrow>
                <Tab
                  label={
                    <Badge badgeContent={comments.length} color="primary">
                      Comments
                    </Badge>
                  }
                />
              </Tooltip>
              <Tooltip title="View Task History" arrow>
                <Tab
                  label={
                    <Badge
                      badgeContent={historyEntries.length}
                      color="secondary"
                    >
                      History
                    </Badge>
                  }
                />
              </Tooltip>
            </Tabs>

            {/* Comments Section */}
            {tabIndex === 0 && (
              <div className="comment-container">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Paper
                      key={index}
                      elevation={3}
                      style={{
                        padding: "10px",
                        margin: "10px 0",
                        backgroundColor: "#333",
                        color: "#fff",
                      }}
                    >
                      {comment}
                    </Paper>
                  ))
                ) : (
                  <p className="no-data-text">No comments yet.</p>
                )}
                <TextField
                  className="comment-input"
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  InputProps={{
                    style: {
                      backgroundColor: "#1f2125", // Dark background for input
                      color: "white", // Text color
                    },
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Label color
                  }}
                />
              </div>
            )}
            {tabIndex === 1 && (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#272b30", // Dark background for the container
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
                }}
              >
                {code == 200 ? (
                  <List>
                    {historyEntries.map((entry, index) => {
                      const changes = getChangedFields(
                        entry.previous_data,
                        entry.new_data
                      );

                      // Get the created_at date
                      const createdAt = new Date(entry.created_at);
                      const currentDate = new Date();

                      // Format the display based on the date comparison
                      const displayDate =
                        createdAt.toDateString() === currentDate.toDateString()
                          ? createdAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : createdAt.toLocaleDateString();

                      return (
                        <div key={index}>
                          <Paper
                            elevation={3}
                            style={{
                              padding: "15px", // Slightly increased padding
                              margin: "10px 0",
                              backgroundColor: "#2c3e50", // Darker background for entries
                              color: "#ffffff", // White text for better contrast
                              borderRadius: "8px",
                              transition:
                                "transform 0.2s ease, box-shadow 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.03)", // Slightly larger on hover
                                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)", // Enhanced shadow on hover
                              },
                            }}
                          >
                            <Grid container alignItems="center">
                              <Grid
                                item
                                xs={6}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar
                                  style={{
                                    backgroundColor: "#007acc", // Bright color for avatar
                                    color: "#ffffff", // White text in avatar
                                    fontWeight: "bold", // Bold text for initials
                                  }}
                                >
                                  {entry.employee_id.charAt(0).toUpperCase()}
                                </Avatar>
                                <span style={{ paddingLeft: "12px" }}>
                                  {entry.employee_id}
                                </span>
                              </Grid>
                              <Grid item xs={6} style={{ textAlign: "right" }}>
                                {displayDate}
                              </Grid>
                              <Grid
                                item
                                xs={11}
                                style={{ paddingLeft: "12px" }}
                              >
                                {Object.keys(changes).length > 0 ? (
                                  <ul
                                    style={{
                                      padding: 0,
                                      listStyleType: "none",
                                    }}
                                  >
                                    {Object.keys(changes).map((key) => (
                                      <li key={key}>
                                        <strong>
                                          {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                          :
                                        </strong>
                                        <br />
                                        <strong>Previous:</strong>{" "}
                                        {changes[key].previous} <br />
                                        <strong>Updated:</strong>{" "}
                                        {changes[key].current}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p
                                    style={{
                                      color: "#ffffff",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    No changes detected.
                                  </p>
                                )}
                              </Grid>
                            </Grid>
                          </Paper>
                          <Divider style={{ backgroundColor: "#444" }} />
                        </div>
                      );
                    })}
                  </List>
                ) : (
                  <p
                    style={{
                      color: "#ffffff",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    No history available.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <Typography variant="h6" color="textSecondary">
            No task selected.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailDialog;
