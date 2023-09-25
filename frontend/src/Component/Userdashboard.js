import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from "react";
import { toast } from 'react-hot-toast';
import { remove } from '../Redux/User';
import { update } from "../Redux/User";
import { add } from "../Redux/User";
import { useDispatch } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from "axios";
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import { fetchRecords, setUsers } from "../Redux/User";



const logoutButton = {
    width: "100px",
    padding: "15px",
    background: "red",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
};
const centerContainer = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'evenly',
    alignItems: 'center',
    height: '100%',
};

function Userdashboard() {
    const users = useSelector(state => state.user);
    // console.log("users records", users);

    // console.log(data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [file, setFile] = useState("");
    const [userState, SetState] = useState(null)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        address: "",
        country: ""
    });

    const data = { ...userState };
    const [updateFormData, setUpdateFormData] = useState({});
    const [updateformErrors, setUpdateFormErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:4000/getUser')
            .then(fetchResponse => {
                if (fetchResponse.status === 200) {
                    const records = fetchResponse.data;
                    SetState(records);
                    // Dispatch the setUsers action to set records in Redux
                    // dispatch(setUsers(records));; // Navigate to the dashboard on success
                } else {
                    console.error('Fetch error:', fetchResponse.data.message);
                }
            })
            .catch(fetchError => {
                console.error('Fetch network error:', fetchError);
            });
    }, [])
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleCloseUpdate = () => {
        setIsUpdateOpen(false);
    }

    // for reate new user inn dashboard
    const handleSubmit = (e) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
            try {
                axios.post('http://localhost:4000/Create', formData)
                    .then(response => {
                        if (response.data.message === 'Created  User successfully') {
                            window.location.reload();
                            toast.success("Created  User successfully");
                        }
                        else if (response.data.message === 'Email is already registered') {
                            swal({
                                text: 'Email is already registered',
                                icon: "error",
                                button: "OK",
                            });
                        }
                        else {
                            console.error('User Creation error:', response.data.message);
                        }
                    });
            }
            catch (error) {
                console.log('Network error:', error.response.data);
                alert(error.response.data.message)
            }
            setIsModalOpen(false);
        }

        // dispatch(add(newItem));

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    // open modal for create user 
    const handleAdd = () => {
        setIsModalOpen(true);
    }
// fetch records from database for update user using id 
    const UpdateHandleragain = (userId) => {
        console.log(userId);
        debugger;
        axios.get('http://localhost:4000/getUpdateUser/' + userId)
            .then(result => {
                const existingUsers = result.data;
                console.log(result);

                if (existingUsers) {
                    const { _id, name, age, email, address, country } = existingUsers;
                    setUpdateFormData({
                        id: _id,
                        name: name,
                        age: age,
                        email: email,
                        address: address,
                        country: country
                    })
                    console.log(existingUsers);
                    setIsUpdateOpen(true);
                }
            })
            .catch(error => console.log(error));
    };

    // update user in database 
    const updatehandler = () => {
        const UpdateFormValid = ValidateUpdateModal();
        if (UpdateFormValid) {

            const { id, name, age, address, country, email } = updateFormData;
            const userToUpdate = userState.find((user) => user._id === id);
            let dataToSend = {};
            if (!userToUpdate) {
                console.log('User not found in userState.');
            } else {
                dataToSend = {
                    id: userToUpdate._id,
                    name: name !== userToUpdate.name ? name : userToUpdate.name,
                    age: age !== userToUpdate.age ? age : userToUpdate.age,
                    email: email !== userToUpdate.email ? email : userToUpdate.email,
                    address: address !== userToUpdate.address ? address : userToUpdate.address,
                    country: country !== userToUpdate.country ? country : userToUpdate.country
                };
                console.log(dataToSend);
            }
            try {
                axios.put(`http://localhost:4000/UpdateUser/${id}`, dataToSend)
                    .then(response => {
                        if (response.data.message === "Email already in use") {
                            Swal.fire({
                                text: 'Email already Exist',
                                icon: "error",
                                button: "OK",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            })
                        }
                        else if (response.status === 200) {
                            alert("fdhdbhb");
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Your Record Updated',
                                showCancelButton: false,


                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            })
                        }
                    });
            }
            catch (error) {
                console.log('Network error:', error.response);
            }
            setUpdateFormData({ email: updateFormData.email, ...updateFormData });
            setIsUpdateOpen(false);
        }
    }
    const handleLogout = () => {
        navigate('/login');
    };
    // function for upload picture
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    //  Validation for Update User Modal for client side 
    const ValidateUpdateModal = () => {
        const updateErros = {};
        if (!updateFormData.name) {
            updateErros.name = "Name is required";
        } else if (!/^[A-Za-z]+$/.test(updateFormData.name)) {
            updateErros.name = "Use only Alphabets";
        }
        if (!updateFormData.age) {
            updateErros.age = "Age is required";
        }
        if (!updateFormData.address) {
            updateErros.address = "Address is required";
        }
        if (!updateFormData.country) {
            updateErros.country = "Country is required";
        }
        if (!updateFormData.email) {
            updateErros.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateFormData.email)) {
            updateErros.email = "Invalid email format";
        }
        setUpdateFormErrors(updateErros);
        return Object.keys(updateErros).length === 0;
    }

    // Modal Validation For Create User 
    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = "Name is required";
        } else if (!/^[A-Za-z]+$/.test(formData.name)) {
            errors.name = "Use only Alphabets";
        }
        if (!formData.age) {
            errors.age = "Age is required";
        }
        if (!formData.address) {
            errors.address = "Address is required";
        }
        if (!formData.country) {
            errors.country = "Country is required";
        }
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email format";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
    // datagrid 
    const columns = [

        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: false,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 40,
            editable: false,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 250,
            editable: false,
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 150,
            editable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            headerAlign: 'center',
            sortable: true,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            headerAlign: 'center',
            width: 280,
            renderCell: (params) => {
                const handleUpdate = (userId) => {

                    UpdateHandleragain(userId);
                };



                const handleDelete = (userId) => {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "Do you want to Delete this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        cancelButtonText: "NO"
                    }).then((result) => {
                        if (result.isConfirmed) {
                          
                            axios
                                .delete('http://localhost:4000/DeleteUser/' + userId)
                                .then((result) => {
                                    console.log(result);
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Your Record Deleted',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'ok'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            window.location.reload();
                                        }
                                    })
                                })
                                .catch((error) => {
                                    console.log(error);
                                });

                        }
                    });
                };

                return (
                    <div>
                        <Button style={{ marginLeft: "0px" }} variant="contained" color="primary" onClick={() => handleUpdate(params.row._id)}>
                            Update
                        </Button>

                        <Button style={{ marginLeft: "50px" }} variant="contained" color="error" onClick={() => handleDelete(params.row._id)}>
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];
    return (
        <>
            {isUpdateOpen ? <Dialog open={isUpdateOpen} onClose={handleCloseUpdate}>
                <DialogTitle style={{ paddingTop: "20px" }}>Update User Information</DialogTitle>
                <DialogContent style={{ height: '400px' }}>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' }, // Adjust width to your preference
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            style={{ width: "530px" }}
                            id="name"
                            label="Name"
                            variant="outlined"
                            type="text"
                            name="name"
                            value={updateFormData.name}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                            fullWidth
                        />
                        {updateformErrors.name && <p style={{ color: "red", fontFamily: "Arial" }}>{updateformErrors.name}</p>}


                        <TextField
                            style={{ width: "530px" }}
                            id="age"
                            label="Age"
                            variant="outlined"
                            type="number"
                            name="age"
                            value={updateFormData.age}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, age: e.target.value })}
                            fullWidth
                        /> {updateformErrors.age && <p style={{ color: "red", fontFamily: "Arial" }}>{updateformErrors.age}</p>}

                        <TextField
                            style={{ width: "530px" }} id="address"
                            label="Address"
                            type="text"
                            variant="outlined"
                            name="address"
                            value={updateFormData.address}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, address: e.target.value })}
                            fullWidth
                        /> {updateformErrors.address && <p style={{ color: "red", fontFamily: "Arial" }}>{updateformErrors.address}</p>}

                        <TextField
                            style={{ width: "530px" }}
                            id="country"
                            label="Country"
                            variant="outlined"
                            type="text"
                            name="country"
                            value={updateFormData.country}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, country: e.target.value })}
                            fullWidth
                        /> {updateformErrors.country && <p style={{ color: "red", fontFamily: "Arial" }}>{updateformErrors.country}</p>}

                        <TextField
                            style={{ width: "530px" }}
                            id="email"
                            label="Email"
                            variant="outlined"
                            required="true"
                            type="email"
                            name="email"
                            value={updateFormData.email}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, email: e.target.value })}
                            fullWidth
                        /> {updateformErrors.email && <p style={{ color: "red", fontFamily: "Arial" }}>{updateformErrors.email}</p>}

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdate}>Cancel</Button>
                    <Button onClick={updatehandler} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog> : ""}

            {isModalOpen ? <Dialog open={isModalOpen} style={{ width: "100vw" }} onClose={handleCloseModal}>
                <DialogTitle style={{ width: "500px" }}>Create User </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' }, // Adjust width to your preference
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                style={{ width: "480px" }}
                                id="name"
                                label="Name"
                                variant="outlined"
                                type="string"
                                name="name"
                                onChange={handleInputChange}
                                fullWidth
                            />
                            {formErrors.name && <p style={{ color: "red", fontFamily: "Arial" }}>{formErrors.name}</p>}

                        </div>
                        <div>
                            <TextField
                                style={{ width: "480px" }}
                                id="age"
                                label="Age"
                                variant="outlined"
                                name="age"
                                type="number"
                                onChange={handleInputChange}
                                fullWidth
                            /> {formErrors.age && <p style={{ color: "red", fontFamily: "Arial" }}>{formErrors.age}</p>}
                        </div>
                        <div>
                            <TextField
                                style={{ width: "480px" }}
                                id="address"
                                label="Address"
                                variant="outlined"
                                name="address"
                                type="string"
                                onChange={handleInputChange}
                                fullWidth
                            />
                            {formErrors.address && <p style={{ color: "red", fontFamily: "Arial" }}>{formErrors.address}</p>}

                        </div>
                        <div>
                            <TextField
                                style={{ width: "480px" }}
                                id="country"
                                label="Country"
                                variant="outlined"
                                name="country"
                                type="string"
                                onChange={handleInputChange}
                                fullWidth
                            />
                            {formErrors.country && <p style={{ color: "red", fontFamily: "Arial" }}>{formErrors.country}</p>}

                        </div>
                        <div>
                            <TextField
                                style={{ width: "480px" }}
                                id="email"
                                label="Email"
                                variant="outlined"
                                name="email"
                                type="email"
                                onChange={handleInputChange}
                                fullWidth
                            />
                            {formErrors.email && <p style={{ color: "red", fontFamily: "Arial" }}>{formErrors.email}</p>}

                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        Create User
                    </Button>
                </DialogActions>
            </Dialog> : ""}




            
            <Box sx={{ height: '100%', width: "100%" }}>
                <div style={centerContainer}>

                    <div style={{ height: "100px", backgroundColor: "#26d9ac", width: "80%", borderRadius: "5px", marginTop: "20px", paddingTop: "30px", alignItems: "baseline", margin: "0 auto", display: "flex", justifyContent: "center" }}>
                        <h1>USER DATA </h1>
                    </div>
                    <div style={{ width: "1000px", display: "flex", justifyContent: "space-around" }}>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginBottom: '30px', padding: "10px", margin: "20px -360px" }}
                                onClick={handleAdd}
                            >
                                Create User
                            </Button>
                        </div>
                        <div style={{ position: "relative" }}>
                            <button style={{ ...logoutButton, position: "absolute", margin: "-90px 230px" }} onClick={handleLogout}>LOG OUT</button>
                        </div>
                    </div>

                    <DataGrid sx={{ height: '100%', width: "65%px" }}
                        rows={userState ? userState : ""}
                        columns={columns}
                        pageSize={2}
                        getRowId={(row) => row._id}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5
                                    , page: 10
                                }
                            }
                        }}
                        pageSizeOptions={[3, 5, 25]}
                        disableRowSelectionOnClick
                    />
                </div>
            </Box>
            <div style={{ margin: "0px 30px", width: "400px", margin: "10px auto" }}>
                <section style={{ display: "flex", justifyContent: "space-around", alignContent: "baseline" }}>
                    <div>   <input type="file" accept="image/*" onChange={handleImageUpload} />   </div>

                </section>
            </div>
            <div style={{ width: "800px", border: "1px solid black", margin: "0 auto", height: "250px" }}>
                <h2>Uploaded Image:</h2>
                {selectedImage && (
                    <div style={{ margin: "10px 20px" }}>
                        < img src={selectedImage} width={"200px"} alt="Uploaded" className="uploaded-image" />
                    </div>
                )}
            </div>
        </>
    )
}
export default Userdashboard;