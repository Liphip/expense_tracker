"use strict";

import Router from "./controller/router.js";
import loadView from "./controller/utils/loadView.js";
import view from "./view/app.js";


const handleLoad = async () => {
    const root = document.getElementById("root");
    const app = loadView(view);
    root.innerHTML = await loadView(view).render();

    // Listen on hash change:
    window.addEventListener("hashchange", Router);

    // Listen on page load:
    window.addEventListener("load", Router);

    Router();
}

window.addEventListener("load", handleLoad);