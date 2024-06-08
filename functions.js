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
    const data = document.getElementById("data");

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

    const fsm = {
        states: states,
        initialState: initialState,
        acceptStates: acceptStates,
        alphabet: alphabet,
        transitions: transitionsWithoutAlphabet
    };

    console.log('FSM:', fsm);
    
    // Creating a new div to store the FSM data
    const newDataBox = document.createElement('div');
    newDataBox.className = 'data-box'; // Adding a class for potential styling
    newDataBox.innerHTML = `
        <div>Q = <span class="editable" id="editable-states">${states.join(', ')}</span></div>
        <div>q&#8320; = <span class="editable" id="editable-initial">${initialState}</span></div>
        <div>F = <span class="editable" id="editable-accept">${acceptStates.join(', ')}</span></div>
        <div>X = <span class="editable" id="editable-alphabet">${alphabet.join(', ')}</span></div>
        <div>σ = <span class="editable" id="editable-transitions">${transitionsRaw.join('; ')}</span></div>
    `;

    // Creating the action buttons container
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';

    // Creating the delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';

    // Adding event listener to the delete button
    deleteButton.addEventListener('click', function() {
        newDataBox.remove();
    });

    // Creating the generate button
    const generateButton = document.createElement('button');
    generateButton.className = 'generate-button';
    generateButton.textContent = 'Generate';

    // Adding event listener to the generate button
    generateButton.addEventListener('click', function() {
        // Log the FSM to the console
        console.log('Generate FSM:', fsm);

        // Store the FSM in local storage
        localStorage.setItem('fsm', JSON.stringify(fsm));
    });

    // Creating the edit button
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';

    // Function to handle edit and save functionality
    function toggleEditSave() {
        const isEditing = editButton.textContent === 'Save';

        newDataBox.querySelectorAll('.editable').forEach(function(span) {
            if (isEditing) {
                // Save the edited content
                const input = span.querySelector('textarea, input');
                span.textContent = input.value;
                span.className = 'editable';
            } else {
                // Convert spans to textareas or inputs for editing
                let input;
                if (span.id === 'editable-initial' || span.id === 'editable-alphabet') {
                    input = document.createElement('input');
                } else {
                    input = document.createElement('textarea');
                }
                input.value = span.textContent;
                input.className = 'editable-input';
                span.textContent = '';
                span.appendChild(input);
                span.className = 'editable editable-editing';
            }
        });

        // Update FSM with new values
        if (isEditing) {
            fsm.states = document.getElementById('editable-states').textContent.split(',').map(item => item.trim());
            fsm.initialState = document.getElementById('editable-initial').textContent.trim();
            fsm.acceptStates = document.getElementById('editable-accept').textContent.split(',').map(item => item.trim());
            fsm.alphabet = document.getElementById('editable-alphabet').textContent.split(',').map(item => item.trim());
            fsm.transitions = document.getElementById('editable-transitions').textContent.split(';').map(item => item.trim());

            // Update local storage
            localStorage.setItem('fsm', JSON.stringify(fsm));

            // Change button text back to Edit
            editButton.textContent = 'Edit';
        } else {
            // Change button text to Save
            editButton.textContent = 'Save';
        }
    }

    // Adding event listener to the edit button
    editButton.addEventListener('click', toggleEditSave);

    actionButtons.appendChild(deleteButton);
    actionButtons.appendChild(generateButton);
    actionButtons.appendChild(editButton);
    newDataBox.appendChild(actionButtons);
    data.appendChild(newDataBox);

    // Generate a unique key for each FSM
    const key = `fsm_${Date.now()}`;

    // Store the FSM in local storage with a unique key
    localStorage.setItem(key, JSON.stringify(fsm));

    // Retrieve stored FSMs from local storage
    let storedFSMs = JSON.parse(localStorage.getItem('storedFSMs')) || [];
    storedFSMs.push(key);

    // Store the keys of all stored FSMs
    localStorage.setItem('storedFSMs', JSON.stringify(storedFSMs));
});
