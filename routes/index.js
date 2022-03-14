const express = require('express');
const asyncHandler = require('express-async-handler')
const { Post, createNewPostAndPushToFirebase, getPostById, getPosts } = require('../Post');
const router = express.Router();


router.get("/story", asyncHandler(async (req, res, next) => {
    const posts = await getPosts();
    res.status(200).json(posts);
}));

router.get("/story/:uuid", asyncHandler(async (req, res, next) => {
    console.log(`uuid: ${req.params.uuid}`)
    const story = await getPostById(req.params.uuid);
    res.status(200).json(story);
}));

router.post("/story", asyncHandler(async (req, res, next) => {
    const { text, title } = req.body;
    if (!text || !title) {
        res.status(422).json({
            status: 422,
            error: "Request must have 'text' and 'title' in the body."
        });
    }

    try {
        const post = await createNewPostAndPushToFirebase(text, title);
        res.status(200).send(`Post successfully created with id ${post.id}`);
    } catch (e) {
        console.error(e);
        res.status(410).send(`Post unsucessfully created. Please try again. `);
    }
}));

router.post("/story/:uuid/report", asyncHandler(async (req, res, next) => {

}));

router.post("/story/:uuid/like", asyncHandler(async (req, res, next) => {

}));

module.exports = router;