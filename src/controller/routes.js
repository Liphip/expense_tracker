"use strict";

import Home from "./pages/home.js";
import About from "./pages/about.js";
import PostShow from "./pages/postShow.js";
import Register from "./pages/register.js";

const Routes = {
    "/": Home,
    "/about": About,
    "/post/:id": PostShow,
    "/register": Register,
}

export default Routes;