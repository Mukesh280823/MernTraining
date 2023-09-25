import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import tableData from './data';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function UpdateData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    email: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(true); // Open the modal directly

  useEffect(() => {
    const index = tableData.findIndex((user) => user.id === id);
    if (index !== -1) {
      const userToUpdate = tableData[index];
      setUserData({ ...userToUpdate });
    }
  }, [id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const index = tableData.findIndex((user) => user.id === id);
    if (index !== -1) {
      const updatedTableData = [...tableData];
      updatedTableData[index] = userData;
      tableData.length = 0;
      tableData.push(...updatedTableData);
      handleCloseModal();
    }
    navigate('/dashboard');
  };

  return (
    <div>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Update User Information</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Age"
            value={userData.age}
            onChange={(e) => setUserData({ ...userData, age: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UpdateData;
