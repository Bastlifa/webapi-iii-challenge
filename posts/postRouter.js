const express = require('express')
const postDb = require('./postDb')

const router = express.Router();
router.use(express.json())

router.get('/', (req, res) =>
{
    postDb.get()
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(error =>
            {
                res.status(500).json({ error: "Internal Error: could not retreive posts" })
            })
})

router.get('/:id', validatePostID, (req, res) =>
{
    const id = req.params.id
    postDb.getById(id)
        .then(response =>
            {
                if(response)
                {
                    res.status(200).json(response)
                }
                else
                {
                    res.status(404).json({ errorMessage: `No post found with id ${id}` })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "Internal Error: Could not retreive post" })
            })
})

router.delete('/:id', validatePostID, (req, res) =>
{
    const id = req.params.id
    postDb.remove(id)
        .then(response =>
            {
                if(response)
                {
                    res.status(200).json(response)
                }
                else
                {
                    res.status(404).json({ errorMessage: `No post found with id ${id}` })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "Internal Error: Could not delete post" })
            })
})


router.put('/:id', validatePostID, (req, res) =>
{
const id = req.params.id
    if(!req.body.text)
    {
        res.status(400).json({ errorMessage: "Please provide text" })
    }
    else
    {
        postDb.update(id, {text: req.body.text})
            .then(response =>
                {
                    if(response)
                    {
                        postDb.getById(id)
                            .then(response =>
                                {
                                    res.status(200).json(response)
                                })
                    }
                    else
                    {
                        res.status(404).json({ errorMessage: "Could not find post"})
                    }
                })
            .catch(error =>
                {
                    res.status(500).json({ errorMessage: "Internal Error: Could not update post" })
                })
    }
})

// custom middleware


function validatePostID(req, res, next)
{
    const id = req.params.id
    postDb.getById(Number(id))
        .then(response =>
            {
                if(response)
                {
                    req.post = response
                    next()
                }
                else
                {
                    res.status(400).json({ message: 'Invalid post id' })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: "Internal error, go away" })
            })
}

module.exports = router;