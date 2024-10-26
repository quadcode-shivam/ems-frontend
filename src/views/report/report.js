import React, { useEffect, useState } from 'react';
import './reports.css'; // Import the new CSS file
import {
  createBacklink,
  fetchBacklinks,
  updateBacklink,
  removeBacklink,
  updateCheckedStatus,
} from '../../api'; // Adjust this import according to your file structure

const statusMap = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
};

const getStatusName = (statusCode) => statusMap[statusCode] || "Unknown";

const submitReport = (backlinks) => {
  console.log("Submitting report:", backlinks);
  alert("Report submitted successfully!");
};

function Reports() {
  const [formData, setFormData] = useState({
    url: '',
    website: '',
    anchor_text: '',
    status: 1,
    comments: '',
    date: new Date().toISOString().slice(0, 10),
    completed: false,
  });

  const [backlinks, setBacklinks] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null); // State to track the backlink being edited
  const [role, setRole] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
    loadBacklinks();
  }, []);

  const loadBacklinks = async () => {
    try {
      const response = await fetchBacklinks({ page: 1, limit: 10 });
      setBacklinks(response.data);
    } catch (error) {
      console.error("Error fetching backlinks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.url) newErrors.url = "URL is required.";
    if (!formData.website) newErrors.website = "Website is required.";
    if (!formData.anchor_text) newErrors.anchor_text = "Anchor text is required.";
    return newErrors;
  };

  const handleAddOrUpdateBacklink = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingIndex !== null) {
        // Update existing backlink
        const updatedBacklink = await updateBacklink({ ...formData, id: backlinks[editingIndex].id, user_id:role });
        setBacklinks((prev) => 
          prev.map((backlink, i) => (i === editingIndex ? updatedBacklink : backlink))
        );
        setEditingIndex(null); // Reset editing index
        loadBacklinks();
      } else {
        // Add new backlink
        const newBacklink = await createBacklink({...formData,user_id:role});
        setBacklinks((prev) => [...prev, newBacklink]);
        loadBacklinks();
      }
      
      // Reset form data
      setFormData({
        url: '',
        website: '',
        anchor_text: '',
        status: 1,
        comments: '',
        date: new Date().toISOString().slice(0, 10),
        completed: false,
      });
      setErrors({}); // Reset errors on successful addition
    } catch (error) {
      console.error("Error processing backlink:", error);
    }
  };

  const handleEditBacklink = (index) => {
    const backlinkToEdit = backlinks[index];
    setFormData({
      url: backlinkToEdit.url,
      website: backlinkToEdit.website,
      anchor_text: backlinkToEdit.anchor_text,
      status: backlinkToEdit.status,
      comments: backlinkToEdit.comments,
      date: backlinkToEdit.date,
      completed: backlinkToEdit.completed,
    });
    setEditingIndex(index); // Set the index of the backlink being edited
  };

  const handleCheckboxChange = async (index) => {
    const updatedBacklinks = backlinks.map((backlink, i) => {
      if (i === index) {
        const updatedCompleted = !backlink.completed;
        return { ...backlink, completed: updatedCompleted };
      }
      return backlink;
    });

    setBacklinks(updatedBacklinks);

    const currentBacklink = updatedBacklinks[index];
    const checked = currentBacklink.completed;

    try {
      await updateCheckedStatus({ ids: [currentBacklink.id], checked });
      loadBacklinks();
    } catch (error) {
      console.error("Error updating backlink status:", error);
    }
  };

  const handleSubmit = async () => {
    const allCompleted = backlinks.every((backlink) => backlink.completed);
    if (!allCompleted) {
      alert("Please mark all entries as completed before submitting.");
      return;
    }

    submitReport(backlinks);
  };

  const handleRemoveBacklink = async (index) => {
    const backlinkToRemove = backlinks[index];
    try {
      await removeBacklink(backlinkToRemove.id);
      loadBacklinks(); // Reload backlinks after removal
    } catch (error) {
      console.error("Error removing backlink:", error);
    }
  };

  return (
    <div className="Reports">
      <h2>Daily Backlink Report</h2>

      <div className="form-container">
        <input
          type="text"
          name="url"
          placeholder="URL"
          value={formData.url}
          onChange={handleInputChange}
          required
        />
        {errors.url && <p className="error">{errors.url}</p>}

        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleInputChange}
          required
        />
        {errors.website && <p className="error">{errors.website}</p>}

        <input
          type="text"
          name="anchor_text"
          placeholder="Anchor Text"
          value={formData.anchor_text}
          onChange={handleInputChange}
          required
        />
        {errors.anchor_text && <p className="error">{errors.anchor_text}</p>}

        <select
          name="status"
          value={formData.status}
          onChange={(e) => setFormData((prev) => ({ ...prev, status: Number(e.target.value) }))}
        >
          <option value={1}>Pending</option>
          <option value={2}>Approved</option>
          <option value={3}>Rejected</option>
        </select>

        <input
          type="text"
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
        />
        
        <button className="add-btn" onClick={handleAddOrUpdateBacklink}>
          {editingIndex !== null ? "Update Backlink" : "Add Backlink"}
        </button>
      </div>

      <table className="backlink-table">
        <thead>
          <tr>
            <th>URL</th>
            <th>Website</th>
            <th>Anchor Text</th>
            <th>Status</th>
            <th>Comments</th>
            <th>Date</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {backlinks.map((backlink, index) => (
            <tr key={index}>
              <td>{backlink.url}</td>
              <td>{backlink.website}</td>
              <td>{backlink.anchor_text}</td>
              <td>{getStatusName(backlink.status)}</td>
              <td>{backlink.comments}</td>
              <td>{backlink.date}</td>
              <td>
                <input
                  type="checkbox"
                  checked={backlink.completed}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>
                <button onClick={() => handleEditBacklink(index)}>Update</button>
                <button onClick={() => handleRemoveBacklink(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Report
      </button>
    </div>
  );
}

export default Reports;
