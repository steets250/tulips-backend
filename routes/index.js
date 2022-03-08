const express = require('express');
const { Post, createNewPostAndPushToFirebase } = require('../Post');
const router = express.Router();

router.get("/story", async (req, res, next) => {

});

router.get("/story/:uuid", async (req, res, next) => {

});

router.post("/story", async (req, res, next) => {
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
});

router.post("/story/:uuid/report", async (req, res, next) => {

});

router.post("/story/:uuid/like", async (req, res, next) => {

});

module.exports = router;