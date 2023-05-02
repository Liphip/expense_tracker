"use strict";

import parseRequestURL from "./utils/parseRequestURL.js";
import sleep from "./utils/sleep.js";
import loadView from "./utils/loadView.js";
import loadViewWithPreHook from "./utils/loadViewWithPreHook.js";

const Utils = {
    // Parse the URL and break it into resource, id and verb
    parseRequestURL,
    // Simple sleep implementation
    sleep,
    // Load a view with a pre-hook
    loadViewWithPreHook,
    // Load a view
    loadView
}

export default Utils;