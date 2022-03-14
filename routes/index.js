const express = require('express');
const asyncHandler = require('express-async-handler')
const { Post, pushToFirebase, getPostById, getPosts } = require('../Post');
const { sendEmail } = require('../EmailService');
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
        const post = new Post(text, title);
        await pushToFirebase(post);
        res.status(200).send(`Post successfully created with id ${post.id}`);
    } catch (e) {
        console.error(e);
        res.status(410).send(`Post unsucessfully created. Please try again. `);
    }
}));

router.post("/story/:uuid/report", asyncHandler(async (req, res, next) => {
    const postId = req.params.uuid;
    console.log(`URGENT - Story report for ID ${postId}`);
    if (process.env.ALLOWEMAILS) {
        console.log(`Attempting to send email for post ${postId}`);
        const post = await getPostById(postId);
        await sendEmail({
            subject: `Tulips - Post Reported`,
            text: `Post ${postId} has been reported. \n\n${post.title}\n${post.text}`
        });
        console.log(`Email successfully sent for post ${postId}`);
    }
    res.status(200).send("Thank you for your report. We will review this story. ")
}));

router.post("/story/:uuid/like", asyncHandler(async (req, res, next) => {
    const post = await getPostById(req.params.uuid);
    post.likes++;
    await pushToFirebase(post);
    res.status(200).json(post);
}));

router.post("/story/:uuid/unlike", asyncHandler(async (req, res, next) => {
    const post = await getPostById(req.params.uuid);
    if (post.likes > 0) {
        post.likes--;
    }
    await pushToFirebase(post);
    res.status(200).json(post);
}));

module.exports = router;