const { User, Thought } = require('../models');

const userController = {
    
    //GET all Users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },

    //GET User by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: 'No user found!'});
                return;
            }
            res.json(userData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

    //CREATE a User
    createUser({ body }, res) {
        User.create(body)
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

    //UPDATE a User
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: 'No user found!'});
                return;
            }
            res.json(userData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
    },

    //DELETE a User and their associated thoughts
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found!' });
                    return;
                }
                //return dbUserData as deletedUser to be used in cascade deletion of thoughts
                return userData;
            })
            .then(deletedUser => {
                Thought.deleteMany(
                    { username: deletedUser.username})
                    .then(() => {
                        res.json({ message: 'User and their thoughts successfully deleted! Thanks MIB!' })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json(err)
                    });
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        },

        //add friend
        addFriend({ params }, res) {
            User.findOneAndUpdate(
                { _id: params.id },
                { $push: {friends: params.friendId}},
                {new: true, runValidators: true}
            )
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found!'});
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        },

        // remove friend
        removeFriend({ params }, res) {
            User.findOneAndUpdate(
                { _id: params.id },
                { $pull: {friends: params.friendId}},
                {new: true, runValidators:true})
                .then(userData => {
                    if (!userData) {
                        res.status(404).json({ message: 'No user found!'});
                        return;
                    }
                    res.json(userData);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        }
}

module.exports = userController;