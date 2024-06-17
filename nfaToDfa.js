// 1. Define the NFA
//2. Create the DFA states
// 3. Define the DFA Transition
// 4. Determine the DFA Intial State
// 5. Define the DFA Accepting states


class NFA {
    constructor(Q, X, q0, F, tfx) {
        this.Q = Q; // States
        this.X = X; // Alphabet
        this.q0 = q0; // Initial state
        this.F = F; // Accepting states
        this.tfx = tfx; // Transition function
    }
}

class DFA {
    constructor(Q, X, q0, F, tfx) {
        this.Q = Q; // States
        this.X = X; // Alphabet
        this.q0 = q0; // Initial state
        this.F = F; // Accepting states
        this.tfx = tfx; // Transition function
    }
}

function convertNfaToDfa(nfa) {
    const Q = [];
    const tfx = {};
    const newStates = {};

    function getStateKey(stateSet) {
        return stateSet.sort().join(',');
    }

    const initialStateSet = [nfa.q0];
    const initialStateKey = getStateKey(initialStateSet);

    newStates[initialStateKey] = initialStateSet;
    Q.push(initialStateKey);

    const dfaTransitions = {};

    while (Q.length > 0) {
        const currentStateKey = Q.shift();
        const currentStateSet = newStates[currentStateKey];

        dfaTransitions[currentStateKey] = {};

        for (let symbol of nfa.X) {
            const nextStateSet = [];

            for (let state of currentStateSet) {
                const stateIndex = nfa.Q.indexOf(state);
                const transitions = nfa.tfx[stateIndex][nfa.X.indexOf(symbol)];

                if (transitions) {
                    for (let nextState of transitions) {
                        if (!nextStateSet.includes(nextState)) {
                            nextStateSet.push(nextState);
                        }
                    }
                }
            }

            const nextStateKey = getStateKey(nextStateSet);
            dfaTransitions[currentStateKey][symbol] = nextStateKey;

            if (!(nextStateKey in newStates)) {
                newStates[nextStateKey] = nextStateSet;
                Q.push(nextStateKey);
            }
        }
    }

    const dfaAcceptingStates = [];
    for (let stateKey in newStates) {
        const stateSet = newStates[stateKey];
        for (let acceptingState of nfa.F) {
            if (stateSet.includes(acceptingState)) {
                dfaAcceptingStates.push(stateKey);
                break;
            }
        }
    }

    return new DFA(Object.keys(newStates), nfa.X, initialStateKey, dfaAcceptingStates, dfaTransitions);
}

// NFA Example
const states = ["A", "B","C"];
const alphabet = ["a", "b"];
const q0 = "A";
const finals = ["C"];
const transitionTable = {
    0: [["A","B"], ["C"]],
    1: [["A"], ["B"]],
    2: [[], ["A","B"]],
    // 3: [[], []]
};

const nfa = new NFA(states, alphabet, q0, finals, transitionTable);
const dfa = convertNfaToDfa(nfa);

console.log("DFA States:", dfa.Q);
console.log("DFA Alphabet:", dfa.X);
console.log("DFA Initial State:", dfa.q0);
console.log("DFA Accepting States:", dfa.F);
console.log("DFA Transition Table:", dfa.tfx);
