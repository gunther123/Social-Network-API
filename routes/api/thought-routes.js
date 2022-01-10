const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    postReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

//  Thought Routes/Methods
router
    .route('/')
    .get(getAllThoughts);

// Thoughts by User
router
    .route('/:userId')
    .post(createThought);

// Thoughts by id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// Thought Reaction by id
router
    .route('/:thoughtId/reactions')
    .post(postReaction);
    
router
.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction);

module.exports = router