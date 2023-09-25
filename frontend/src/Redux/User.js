const { createSlice } = require('@reduxjs/toolkit');


const initialState = {
    users: [],  // set as empty array first 
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        add: (state, action) => {
            console.log(action);
            //     state.users = [...state.users, (id: action.payload.id, name: action.payload.name, age: action.payload.age, email: action.payload.email)];
            state.users = [...state.users, action.payload];
        },
        remove: (state, action) => {
            state.users = state.users.filter((user) => user.id !== action.payload);
        },
        update: (state, action) => {
            const userIndex = state.users.findIndex(
                (user) => user.id === action.payload.id
            );
            if (userIndex !== -1) {
                // Update the user data
                state.users[userIndex] = { ...state.users[userIndex], ...action.payload };

            }
        }
    }
})

const { setUsers, add, remove, update } = userSlice.actions;
module.exports = { setUsers, add, remove, update };

