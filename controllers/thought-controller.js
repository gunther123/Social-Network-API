const { Thought, User } = require('../models')

const thoughtController = {

    //GET all Thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .then(thoughtData => res.json(thoughtData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

    //GET Thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: 'No thought with this id!'})
                return;
            }
            res.json(thoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

    //CREATE thought
    createThought({ params, body },res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: 'No user found!'})
                return
            }
            res.json(userData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

        //UPDATE Thought
        updateThought({ params, body }, res) {
            Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought found!'});
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        },
    
        //DELETE Thought
        deleteThought({ params }, res) {
            Thought.findOneAndDelete({ _id: params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    res.status(404).json({ message: 'No thought with this id!' });
                    return;
                }
                res.json(deletedThought);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        },
    
        //POST Reaction
        postReaction({ params, body}, res) {
            Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $push: { reactions: body}},
                { new: true, runValidators: true })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought with this id!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.status(400).json(err));  
        },
    
        //DELETE Reaction
        deleteReaction({ params }, res) {
            Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: params.reactionId }}},
                { new: true})
            .then(thoughtData => res.json(thoughtData))
            .catch(err => res.status(400).json(err));  
        }
}

module.exports = thoughtController;