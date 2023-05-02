"use strict";

export default (view) => {
    if (typeof view == 'string')
        return ({
            render: async () => {
                return view;
            },
            after_render: async () => { }
        })
    if (typeof view == 'function')
        return ({
            render: async (args) => {
                return view(args);
            },
            after_render: async () => { }
        })
}