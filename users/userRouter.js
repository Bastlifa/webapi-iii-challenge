const express = require('express')
const userDB = require('./userDb')
const postDB = require('../posts/postDb')

const router = express.Router();

router.use(express.json())

router.post('/', validateUser, (req, res) => {
    userDB.insert(req.body)
        .then(response =>
            {
                res.status(201).json({ createdUser: response })
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "There was an error creating the user" })
            })
});

router.post('/:id/posts', validateUserID, validatePost, (req, res, next) => {
    postDB.insert({ text: req.body.text, user_id: req.user.id })
        .then(response =>
            {
                res.status(201).json({ created_post: response })
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "internal error creating post" })
            })
});

router.get('/', (req, res) => {
    userDB.get()
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: 'there was an error trying to retrieve users', error: err })
            })
});

router.get('/:id', validateUserID, (req, res) => {
    userDB.getById(req.user.id)
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: `there was an error trying to retrieve user with id: ${req.params.id}`, error: err })
            })
});

router.get('/:id/posts', validateUserID, (req, res) => {
    postDB.get()
        .then(response =>
            {
                res.status(200).json(response.filter(el => el.user_id === req.user.id))
            })
        .catch(_ =>
            {
                res.status(500).json({ errorMessage: "internal error: could not retrieve posts" })
            })
});

router.delete('/:id', validateUserID, (req, res) => {
    userDB.remove(req.user.id)
        .then(response =>
            {
                res.status(200).json({ response })
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "Internal Error: Could not remove user" })
            })
});

router.put('/:id', validateUser, validateUserID, (req, res) => {
    console.log('a')
    userDB.update(req.user.id, {name: req.body.name})
        .then(response =>
            {
                res.status(200).json({ response })
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "Internal Error: Could not update user" })
            })
});

//custom middleware

function validateUserID(req, res, next)
{
    const id = req.params.id
    userDB.getById(Number(id))
        .then(response =>
            {
                if(response)
                {
                    req.user = response
                    next()
                }
                else
                {
                    res.status(400).json({ message: 'Invalid user id' })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "Internal error, go away" })
            })
}

function validateUser(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "missing user data" })
    else if(!req.body.name) res.status(400).json({ message: "missing required name field" })
    else next()
}

function validatePost(req, res, next) {
    if(!req.body) res.status(400).json({ message: "missing post data" })
    else if(!req.body.text) res.status(400).json({ message: "missing required text field" })
    else next()
};

module.exports = router;
