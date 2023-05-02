"use strict";


//  Parse a url and break it into resource, id and verb
export default () => {
    let url = location.hash.slice(1).toLowerCase() || '/';
    let splitUrl = url.split("/");
    let request = {
        resource: null,
        id: null,
        verb: null
    }
    request.resource = splitUrl[1]
    request.id = splitUrl[2]
    request.verb = splitUrl[3]

    return request
}