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

    const fsm = {
        states: states,
        initialState: initialState,
        acceptStates: acceptStates,
        alphabet: alphabet,
        transitions: transitionsWithoutAlphabet
    };

    console.log('FSM:', fsm);

    // Storing the FSM in local storage for future use
    localStorage.setItem('fsm', JSON.stringify(fsm));

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
});
