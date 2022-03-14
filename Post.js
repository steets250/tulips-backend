const { ref, set, get, child } = require("firebase/database");
const { db } = require('./firebase/index');
const { uuid } = require('uuidv4');

const postFolderRef = ref(db, "posts")
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
};

const createNewPostAndPushToFirebase = async (text, title) => {
    const post = new Post(text, title);
    await set(ref(db, `posts/${post.id}`), {
        text: post.text,
        title: post.title,
        likes: post.likes,
        id: post.id
    });            
    return post;
};

const getPostById = async (id) => {
    try {
        const postRef = child(postFolderRef, id);
        const snapshot = await get(postRef);
        if (!snapshot.exists()) {
            throw Error("Snapshot not found.");
        }
    
        const fetchedVals = snapshot.val(); 
        return new Post(
            fetchedVals.text,
            fetchedVals.title,
            fetchedVals.id,
            fetchedVals.likes
        );
    } catch (e) {
        console.error(e);
        throw Error(`Unable to fetch post with id ${id}`);
    }

};

const getPosts = async () => {
    const postsList = [];
    const postsListRef = await get(postFolderRef);
    postsListRef.forEach(snapshot => {
        const snapshotVal = snapshot.val();
        postsList.push(new Post(
            snapshotVal.text,
            snapshotVal.title,
            snapshotVal.id,
            snapshotVal.likes
        ));
    })
    return postsList;
};

module.exports = {
    Post,
    createNewPostAndPushToFirebase,
    getPostById,
    getPosts
};