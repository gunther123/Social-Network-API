const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller')

// /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// Find specific user, update user, and delete user
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Add or Remove Friend
router
    .route('/:id/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend)

module.exports = router