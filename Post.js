const { ref, set } = require("firebase/database");
const { db } = require('./firebase/index');
const { uuid } = require('uuidv4');

class Post {
    /**
     * @param text String representing the contents of the post 
     * @param title String representing the main title of the post 
     * @param likes Number representing the number of likes a post has
     */
    constructor(text, title, id = uuid(), likes = 0) {
        this.text = text;
        this.title = title; 
        this.likes = likes;
        this.id = id;
    }
}

const createNewPostAndPushToFirebase = async (text, title) => {
    const post = new Post(text, title);
    await set(ref(db, `posts/${post.id}`), {
        text: post.text,
        title: post.title,
        likes: post.likes,
        id: post.id
    });            
    return post;
}

module.exports = {
    Post,
    createNewPostAndPushToFirebase
};