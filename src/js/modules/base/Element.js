/**
 * @class Element
 * @description class with only state management
 * 
 */
class Element {
    #state = {};
    #onStateChange = {};

    constructor() {
    }

    getState(key) {
        return this.#state[key];
    }

    setState(key, value, onChange = null) {
        if (this.#state[key] === undefined) {
            Object.defineProperty(this, key, {
                get: function() {
                    return this.#state[key];
                },
                set: function(value) {
                    this.setState(key, value);
                }            
            });
        }
        this.#state[key] = value;
        if (onChange !== null)
            this.#onStateChange[key] = onChange;
        if (this.#onStateChange[key] !== undefined)
            this.#onStateChange[key]();
    }
}

export default Element;