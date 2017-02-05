class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error("Config isn't passed");
        }
        this.initial = config.initial;
        this.activeState = this.initial;
        this.states = config.states;
        this.history = new Array("normal");
        this.archive = new Array();
        this.isUndo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.activeState;
    }

    /**
     * Return array of all states
     * @returns {Array}
     */
    getAllStates() {
        return Object.keys(this.states);
    }

    /**
     * Checks the state of the existence
     * @param state
     * @returns {boolean}
     */
    checkAvailableState(state) {
        return this.getAllStates().indexOf(state) > -1;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.checkAvailableState(state)) {
            throw new Error("State isn't exist");
        }
        this.history.push(state);
        this.activeState = state;
        this.isUndo = false;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var nextState = this.states[this.getState()].transitions[event];
        if (!nextState) {
            throw new Error("Event in current state isn't exist");
        }
        this.activeState = nextState;
        this.history.push(nextState);
        this.isUndo = false;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.activeState = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return this.getAllStates();
        }
        var arrayOfStates = new Array();
        for (const [key, val] of Object.entries(this.states)){
            if (val.transitions.hasOwnProperty(event)) {
                arrayOfStates.push(key);
            }
        }
        return arrayOfStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        var arrayLength = this.history.length;
        if (arrayLength == 1) {
            return false;
        }
        this.activeState = this.history[arrayLength - 2];
        var lastState = this.history.pop();
        this.archive.push(lastState);
        this.isUndo = true;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        var isArchiveEmpty = this.archive.length == 0;
        if ((this.history.length == 1 && isArchiveEmpty) || isArchiveEmpty || !this.isUndo) {
            return false;
        }
        var lastState = this.archive.pop();
        if (lastState) {
            this.history.push(lastState);
            this.activeState = lastState;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.initial];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
