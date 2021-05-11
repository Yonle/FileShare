import ApiPath from "/ApiPath.js"; // generated by the server

export default class FileSystem {

    // generates the api functions
    constructor(){ 
        this.password = null;
        ApiPath.forEach(n => {
            const args = n.split("__")
            this[args[1]] = async (...a) => {
                return await this.__api(args[1], args[0], {}, {}, ...a)
            }
            this[args[1] + "Blob"] = async (...a) => {
                return await this.__api(args[1], args[0], {}, { res:"blob" }, ...a)
            }
        }) 
    }

    __body(query) { return JSON.stringify(query) }

    // generates object/string to query string/object
    __query(query){ return new URLSearchParams(Object.entries(query)).toString() }

    // send requests to the server to get data
    __api(type, method, query = { }, option,  ...args){
        query.args = JSON.stringify(args);
        const { res = "json" } = option;
        const op = { method, headers:{ 'Content-Type': 'application/json' } };
        if(this.password) query.password = this.password;
        if(method=="post") op.body = this.__body(query);
        return window.fetch("/api/fs/" + type + "?" + (method!=="post"?this.__query(query):""), op)
            .then(async e => await e[res || "json"]())
            .then(e => res=="json"?e.data:e);
    }
}