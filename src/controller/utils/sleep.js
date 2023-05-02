"use strict";

// Simple sleep implementation
export default (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}