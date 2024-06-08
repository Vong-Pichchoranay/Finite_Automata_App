class fa{
    constructor(Q, X, q0, F, tfx){
        this.Q  = Q;
        this.X = X;
        this.q0 = q0;
        this.F = F;
        this.tfx = tfx;
    }

// B. TEST DFA OR NFA
    CheckIfDFA(){
        for(let stateIndex in this.tfx){
            let stateTransition = this.tfx[stateIndex];
            console.log('state transition: ' + stateTransition);
            console.log('state transition length: ' + stateTransition.length);
            if (stateTransition.length !== this.X.length){
                return false; // each state have only one transition for a symbol
            }
            for ( let transition of stateTransition){
                console.log('each transition length: ' + transition.length);
                if(Array.isArray(transition)&&transition.length !== 1){
                    return false;
                    // check for one transition for 1 symbol
                }
            }
        }
        return true;
    }

// C. TEST STRING ACCEPTED OR REJECTED
    returnNextState(state, input){
        this.state = state;
        this.input = input;


        // document.write(inputAlphabet.includes(input) && State.includes(state));
        if(this.X.includes(this.input) && this.Q.includes(this.state)){
            // document.write(State.indexOf(state) + "<br>");
            // document.write(inputAlphabet.indexOf(input) + "<br>");
            return this.tfx[this.state][this.X.indexOf(this.input)];
        } else{
            return "errorState";
        }
    }

    testString(string){
        this.inputSequence = string;
        this.currentStates = [];
        this.currentStates.push(this.q0);
        
        for(let i=0; i<this.inputSequence.length; i++){
            let currentInput = this.inputSequence.charAt(i);
    
            for(let j = 0; j<this.currentStates.length; j++){
    
                console.log("<br>" +`${i}` + ": input = " + `${this.inputSequence.charAt(i)}`);
    
                console.log("<br>Current state: " + this.currentStates[j] 
                            + " - Input: " + currentInput);
    
            
                this.currentStates[j] = `${this.returnNextState(this.currentStates[j], currentInput)}`;
                this.currentStates[j] = this.currentStates[j].split(',');
    
                console.log(" --> Next state: " + this.currentStates[j]);
    
                // currentStates = currentStates.flat();
    
                if(this.currentStates[j].includes(this.F)){
                    console.log(" (accepting state)");
                }
    
                // if(acceptingState.includes(currentStates[j])){
                //     document.write(" (accepting state)");
                // }
            }
            this.currentStates = this.currentStates.flat();
          
        }
    
        console.log("<br>Ending state: " + this.currentStates);

        for(let i = 0; i<this.F.length; i++){
            if(this.currentStates.includes(this.F[i])){
                console.log(" (accepting state)");
            } else {
                console.log(" (string rejected)");
            }

        }
        
    }
}



document.getElementById('Button').addEventListener('click', function() {
    const states = document.getElementById('StateInput').value.split(',').map(item => item.trim());
    const initialState = document.getElementById('IntStateInput').value.trim();
    const acceptStates = document.getElementById('AccStateInput').value.split(',').map(item => item.trim());
    const alphabet = document.getElementById('AlpInput').value.split(',').map(item => item.trim());
    const transitionsRaw = document.getElementById('tableInput').value.split(';').map(item => item.trim());

    // const states = document.getElementById('StateInput').value.split(',');
    // const initialState = document.getElementById('IntStateInput').value.trim();
    // const acceptStates = document.getElementById('AccStateInput').value.split(',');
    // const alphabet = document.getElementById('AlpInput').value.split(',');
    // const transitionsRaw = document.getElementById('tableInput').value.split(';');

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


    // TAKE 1: DFA (success)
    const myfa = new fa(states, alphabet, initialState, acceptStates, transitionsWithoutAlphabet);
    // console.log('FSM : '  + myfa);
    let checkDFA = myfa.CheckIfDFA();
    if(checkDFA){
        console.log('it is a DFA.');
    } else {
        console.log('it is an NFA.');
    }
    // myfa.testString('abba');

    // TAKE 2: NFA  (success)
    // const myfa = new fa(states, alphabet, initialState, acceptStates, transitionsWithoutAlphabet);
    // console.log('FSM : '  + myfa);

    // myfa.testString('abbbaaa');

    // const fsm = {
    //     states: states,
    //     initialState: initialState,
    //     acceptStates: acceptStates,
    //     alphabet: alphabet,
    //     transitions: transitionsWithoutAlphabet
    // };

    // console.log('FSM:', fsm);

    // console.log('states: ' + states[0]);                                    // how to access object
    // console.log('states: ' + states[1]);

    // console.log('final states: ' + acceptStates[0]);

    // console.log('alphabet: ' + alphabet[0]);
    // console.log('alphabet: ' + alphabet[1]);

    // console.log('states length: ' + states.length);                         // can use obj.length
    

    // console.log('states: ' + typeof(states));
    // console.log('initial state:' + typeof(initialState));
    // console.log('acccept state:' + typeof(acceptStates));
    // console.log('alphabet: ' + typeof(alphabet));
    // console.log('transitions: ' + transitionsWithoutAlphabet[states[0]][0]);    // access transition table
    // console.log('transitions: ' + transitionsWithoutAlphabet[states[0]][1]);

    // console.log('transitions: ' + transitionsWithoutAlphabet[states[1]][0]);
    // console.log('transitions: ' + transitionsWithoutAlphabet[states[1]][1]);


    // Storing the FSM in local storage for future use
    // localStorage.setItem('fsm', JSON.stringify(fsm));

});