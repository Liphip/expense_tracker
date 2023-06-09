"use strcit";

import view from "../../view/pages/home.js";
import loadViewWithPreHook from "../utils/loadViewWithPreHook.js";

const getPostsList = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch('https://5bb634f6695f8d001496c082.mockapi.io/api/posts', options);
        const json = await response.json();
        return json;
    } catch (err) {
        console.log('Error getting documents', err);
    }
}

const Home = loadViewWithPreHook(view, getPostsList);

export default Home;