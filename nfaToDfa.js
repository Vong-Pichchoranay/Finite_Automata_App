// DFA 1. Define the NFA
//2. Create the DFA states
// 3. Define the DFA Transition
// 4. Determine the DFA Intial State
// 5. Define the DFA Accepting states



// hello hello the function from convert enfa to Dfa seems not accurate
class eNFA{
    constructor(Q, X, q0, F, tfx) {
        this.Q = Q; // States
        this.X = X; // Alphabet
        this.q0 = q0; // Initial state
        this.F = F; // Accepting states
        this.tfx = tfx; // Transition function
        }
}

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

// 1. Compute epsilon closure for a given state
function epsilonClosure(state, tfx, states) {
    const closure = new Set([state]);
    const stack = [state];
    
    while (stack.length > 0) {
        const currentState = stack.pop();
        const stateIndex = states.indexOf(currentState);

        if (tfx[stateIndex] && tfx[stateIndex][0]) {
            // Epsilon transitions are at index 0
            for (let nextState of tfx[stateIndex][0]) {
                if (!closure.has(nextState)) {
                    closure.add(nextState);
                    stack.push(nextState);
                }
            }
        }
    }
    
    return Array.from(closure);
}

// 2. Remove epsilon transitions to convert ε-NFA to NFA
function removeEpsilonTransitions(enfa) {
    const Q = enfa.Q;
    const X = enfa.X.slice(1); // Exclude epsilon from alphabet
    const q0 = enfa.q0;
    const F = enfa.F;
    const tfx = [];

    // Compute epsilon closures for all states
    const epsilonClosures = {};
    for (let state of Q) {
        epsilonClosures[state] = epsilonClosure(state, enfa.tfx, Q);
    }

    
    // Build the new transition table for the NFA
    for (let state of Q) {
        const stateIndex = Q.indexOf(state);
        tfx[stateIndex] = [];

        for (let symbolIndex = 1; symbolIndex < enfa.X.length; symbolIndex++) {
            const symbol = enfa.X[symbolIndex];
            const newStateSet = new Set();

            for (let closureState of epsilonClosures[state]) {
                const closureStateIndex = Q.indexOf(closureState);
                const transitions = enfa.tfx[closureStateIndex][symbolIndex];
                
                if (transitions) {
                    for (let nextState of transitions) {
                        const nextClosure = epsilonClosures[nextState];
                        for (let finalState of nextClosure) {
                            newStateSet.add(finalState);
                        }
                    }
                }
            }
            
            tfx[stateIndex][symbolIndex - 1] = Array.from(newStateSet);
        }
    }
    
    return new NFA(Q, X, q0, F, tfx);
}



// 3.convert NFA to DFA

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

// 4.function to convert either ε-NFA or NFA to DFA
function convertToDfa(automaton) {
    let nfa;
    if (automaton instanceof eNFA) {
        nfa = removeEpsilonTransitions(automaton);
    } else if (automaton instanceof NFA) {
        nfa = automaton;
    } else {
        throw new Error("Unsupported automaton type.");
    }
    return convertNfaToDfa(nfa);
}
// Example ε-NFA
// const statesENFA = ["q0", "q1", "q2"];
// const alphabetENFA = [ "a","b", "c","ε"];
// const q0ENFA = "q0";
// const finalsENFA = ["q2"];
// const transitionTableENFA = [
//     [["q0"], [],[], ["q1"]], // Transitions from state 
//     [[], ["q1"],[], ["q2"]],        // Transitions from state 
//     [[], [], ["q2"],[]],      // Transitions from state 
// ];

// const enfa = new eNFA(statesENFA, alphabetENFA, q0ENFA, finalsENFA, transitionTableENFA);
// const dfaFromENFA = convertToDfa(enfa);

// console.log("DFA from ε-NFA States:", dfaFromENFA.Q);
// console.log("DFA from ε-NFA Alphabet:", dfaFromENFA.X);
// console.log("DFA from ε-NFA Initial State:", dfaFromENFA.q0);
// console.log("DFA from ε-NFA Accepting States:", dfaFromENFA.F);
// console.log("DFA from ε-NFA Transition Table:", dfaFromENFA.tfx);



// Example NFA
const statesNFA = ["A", "B", "C"];
const alphabetNFA = ["a", "b"];
const q0NFA = "A";
const finalsNFA = ["C"];
const transitionTableNFA = [
    [["A", "B"], ["C"]], // Transitions from state A
    [["A"], ["B"]],      // Transitions from state B
    [[], ["A", "B"]],    // Transitions from state C
];

const nfa = new NFA(statesNFA, alphabetNFA, q0NFA, finalsNFA, transitionTableNFA);
const dfaFromNFA = convertToDfa(nfa);

console.log("DFA from NFA States:", dfaFromNFA.Q);
console.log("DFA from NFA Alphabet:", dfaFromNFA.X);
console.log("DFA from NFA Initial State:", dfaFromNFA.q0);
console.log("DFA from NFA Accepting States:", dfaFromNFA.F);
console.log("DFA from NFA Transition Table:", dfaFromNFA.tfx);


