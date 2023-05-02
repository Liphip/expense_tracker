"use strcit";

import view from "../../view/pages/postShow.js";
import loadViewWithPreHook from "../utils/loadViewWithPreHook.js";
import parseRequestURL from "../utils/parseRequestURL.js";

const getPost = async (id) => {
    const request = parseRequestURL();
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(`https://5bb634f6695f8d001496c082.mockapi.io/api/posts/${request.id}`, options);
        const json = await response.json();
        return json;
    } catch (err) {
        console.log('Error getting documents', err);
    }
}

const PostShow = loadViewWithPreHook(view, getPost);

export default PostShow;