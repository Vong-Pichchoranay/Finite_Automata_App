document.getElementById('Button').addEventListener('click', function() {
    const states = document.getElementById('StateInput').value.split(',').map(item => item.trim());
    const initialState = document.getElementById('IntStateInput').value.trim();
    const acceptStates = document.getElementById('AccStateInput').value.split(',').map(item => item.trim());
    const alphabet = document.getElementById('AlpInput').value.split(',').map(item => item.trim());
    const transitionsRaw = document.getElementById('tableInput').value.split(';').map(item => item.trim());

    let transitions = {};

    // Initialize transitions for all states and input symbols
    states.forEach(state => {
        transitions[state] = {};
        alphabet.forEach(symbol => {
            transitions[state][symbol] = [];
        });
    });

    transitionsRaw.forEach(transition => {
        let [state, ...rest] = transition.split('[');
        state = state.trim();
        rest = rest.join('[').trim();
    
        if (!state || !rest) {
            console.error(`Invalid transition format for transition: "${transition}". State or transition part is missing.`);
            return;
        }
    
        // Check if the transition data is empty
        if (rest === '[]') {
            // No transitions for this state, continue to the next transition
            return;
        }
    
        // Removing outer brackets and splitting transitions
        let transitionsData = rest.replace(/^\[|\]$/g, '').split('][').map(item => item.trim());
    
        // Validate transitions format
        if (transitionsData.length !== alphabet.length) {
            console.error(`Invalid transition format for state: "${state}". Number of transitions should match alphabet length.`);
            return;
        }
    
        transitionsData.forEach((data, index) => {
            if (index >= alphabet.length) {
                console.error(`Transition data index (${index}) exceeds alphabet length for state: ${state}`);
                return;
            }
    
            let nextStates;
            if (data === "''") {
                // Empty transition
                nextStates = [];
            } else {
                nextStates = data.split(',').map(item => item.trim()).filter(item => item !== '');
            }
            transitions[state][alphabet[index]] = nextStates;
        });
    });    

    let transitionsWithoutAlphabet = {};
    Object.entries(transitions).forEach(([state, transitionObj]) => {
        transitionsWithoutAlphabet[state] = Object.values(transitionObj);
    });

    const fsm = {
        states: states,
        initialState: initialState,
        acceptStates: acceptStates,
        alphabet: alphabet,
        transitions: transitionsWithoutAlphabet
    };

    console.log('FSM:', fsm);

    // Storing the FSM in local storage for future use
    // localStorage.setItem('fsm', JSON.stringify(fsm));

});
