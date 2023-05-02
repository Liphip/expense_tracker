"use strict";


export default (view, preHook) => {
    if (typeof view == 'string')
        return ({
            render: async () => {
                return view;
            },
            after_render: async () => { }
        })
    if (typeof view == 'function')
        return ({
            render: async () => {
                const args = await preHook();
                return view(args);
            },
            after_render: async () => { }
        })
}