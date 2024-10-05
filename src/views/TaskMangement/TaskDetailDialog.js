import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  AccountTreeOutlined,
  CategoryOutlined,
  ViewKanbanOutlined,
  ViewTimelineOutlined,
} from "@mui/icons-material";
import "./TaskManagement.css";

const TaskDetailDialog = ({ isOpen, task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [tabIndex, setTabIndex] = useState(0); // State for tab index

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
      <DialogContent>
        {task ? (
          <div>
            <p style={{ color: "#fff" }}>
              <span className="mr-1">
                {getPriorityIcon(task.priority)} {task.sprint_name} / {task.employee_id}
              </span>
            </p>
            <h6 className="text-light">{task.title}</h6>
            <p style={{ color: "#fff" }}>
              <strong>Description:</strong> <br /> {task.description}
            </p>

            {/* Tabs for Comments and History */}
            <Tabs value={tabIndex} onChange={handleChangeTab}>
              <Tab label="Comments" />
              <Tab label="History" />
            </Tabs>

            {tabIndex === 0 && ( // Comments Tab
              <div>
                <h5>Comments:</h5>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <p key={index} style={{ margin: "4px 0", color: "white" }}>
                      {comment}
                    </p>
                  ))
                ) : (
                  <p style={{ color: "white" }}>No comments yet.</p>
                )}
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  style={{ marginTop: "10px" }}
                  inputProps={{
                    style: {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                />
              </div>
            )}

            {tabIndex === 1 && ( // History Tab
              <div>
                <h5>History:</h5>
                <p style={{ color: "white" }}>No history available.</p>
                {/* Here you can map through a history array if you have one */}
                {/* Example: task.history.map(...) */}
              </div>
            )}
          </div>
        ) : (
          <p>No task selected.</p>
        )}
      </DialogContent>
      <DialogActions>
        <p>
          {new Date(task.create_at).toLocaleDateString()}
        </p>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailDialog;
