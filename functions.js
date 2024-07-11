class fa{

    // Initialize 5-tuple finite machine
    constructor(Q, X, q0, F, tfx){
        this.Q  = Q;
        this.X = X;
        this.q0 = q0;
        this.F = F;
        this.tfx = tfx;
    }

    // B. Function to test DFA or NFA
    CheckIfDFA(){
        for(let stateIndex in this.tfx){
            let stateTransition = this.tfx[stateIndex];
            console.log('state transition: ' + stateTransition);
            console.log('state transition length: ' + stateTransition.length);

            // check each state has transition array for all alphabet and epsilon
            if (stateTransition.length !== this.X.length+1){                        
                return false;
            }

            for ( let t=0; t<stateTransition.length-1; t++ ){
                console.log('each transition length: ' + stateTransition[t].length);

                // check each alphabet has only 1 transition
                if(Array.isArray(stateTransition[t])&&stateTransition[t].length !== 1){         
                    return false;
                    
                }

                // check epsilon has no transition
                if(Array.isArray(stateTransition[stateTransition.length])&&stateTransition[stateTransition.length].length !== 0){   
                    return false;
                }
            }
        }
        return true;
    }

    // C. Function to test if string accpeted or rejected

    // function to return a transition from the transition table
    returnNextState(state, input){
        if(this.X.includes(input) && this.Q.includes(state)){
            return this.tfx[state][this.X.indexOf(input)];
        } 
        else if(this.Q.includes(state) && input == 'epsilon'){
            return this.tfx[state][this.X.length];
        }
        else{
            // when state is not in Q, or input not in alphabet or epsilon
            return "errorState";
        }
    }

    // function to test if empty string is accepted
    testEmptyString(){
        this.currentStates = [];
        this.currentStates.push(this.q0);
      
        while(this.currentStates.length != 0){

            for(let i = 0; i<this.currentStates.length; i++){
                // return transition of q0 on epsilon
                this.currentStates[i] = `${this.returnNextState(this.currentStates[i], 'epsilon')}`;    
                this.currentStates[i] = this.currentStates[i].split(',');
            }
            this.currentStates =  this.currentStates.flat();

            // remove error states from current states
            for(let i = 0; i<this.currentStates.length; i++){
                if(this.currentStates[i] == 'errorState'){
                    this.currentStates.splice(i,1);
                }
            }

            // check for final state
            for(let i = 0; i<this.currentStates.length; i++){
                if(this.F.includes(this.currentStates[i])){
                    return true;
                }
            }
            
        }
        return false;
    }

    // function to test string
    testEpsilonString(string){
        this.inputSequence = string;
        this.currentStates = [];            // keep track of all current states
        this.currentStates.push(this.q0);       
        let tmpArr = [];       // store all current states before set into currentStates
        let tmpEle;            // store a transition
        let epsArr;             // store transitions on epsilon
        let tmptmpArr = [];     
        
        // loop through every char of string
        for(let i=0; i<this.inputSequence.length; i++){
            let currentInput = this.inputSequence.charAt(i);
    
            // for every current state, return every transition on alphabet
            for(let j = 0; j<this.currentStates.length; j++){
                tmpEle = this.returnNextState(this.currentStates[j], currentInput);
                if(tmpEle != 'errorState') tmpArr.push(tmpEle);
            }
    
            // return 1D array of current states on alphabet input
            tmpArr = tmpArr.flat(); 
    

            // remove duplicate current state
            for(let i = 0; i<tmpArr.length; i++) { 
                if(!tmptmpArr.includes(tmpArr[i])) tmptmpArr.push(tmpArr[i]);
            }
    
            tmpArr = tmptmpArr;
            tmptmpArr = [];
    

            // for every current state, get its epsilon closure to include in currentStates
            for(let i = 0; i<tmpArr.length; i++){
    
                epsArr = this.returnEpsilonClosure(tmpArr[i]);
    
                if(epsArr != 'Invalid state'){
                    console.log('epsArr=', epsArr);
                    tmpArr.push(epsArr);
                }
            }
    
            // return 1D array of current states on alphabet and epsilon transitions
            tmpArr = tmpArr.flat();   
            this.currentStates = tmpArr;
            tmpArr = [];
        }
        
        // check for final state in currentStates
        if(this.checkAcceptState()) return true;
    
        return false;
    }

    // check for final state in current states array
    checkAcceptState(){
        for(let i = 0; i<this.F.length; i++){
            if(this.currentStates.includes(this.F[i])){
                return true;
            }
        }
        return false;
    }

    // function to return epsilon closure of a state input
    returnEpsilonClosure(state){
        let eArr = [];      // epsilon closure: to store states reachable by this state on epsilon
        let tmp;

        // add the state itself into its closure
        if(this.Q.includes(state)){
            eArr.push(state);
        } else{
            return 'Invalid state';
        }

        // loop through closure states, if it transitions to a new state, add it to the epsilon closure
        for(let i = 0; i<eArr.length;i++){
            tmp = this.returnNextState(eArr[i], 'epsilon');

            for(let j = 0; j<tmp.length; j++){
                if(this.Q.includes(tmp[j]) && !eArr.includes(tmp[j])){
                    eArr.push(tmp[j]);
                }
            }

        }
        return eArr;
    }


    // D.1 CONVERT ENFA TO DFA

    // function to convert eNFA to NFA
    removeEpsilonTransitions() {
        const Q = this.Q;
        const X = this.X; 
        const q0 = this.q0;
        const F = this.F;
        const tfx = {};
    
        // Compute epsilon closures for all states
        const epsilonClosures = {};
        for (let state of Q) {
            epsilonClosures[state] = this.returnEpsilonClosure(state);      // return an array
        }
    
        // Build the new transition table for the NFA
        for (let state of Q) {                                      
            const stateIndex = Q.indexOf(state);
            tfx[state] = [];  
            let finalClosure = [];    // to store transition states, then replace with its closure
            let transofCurState;
            let finalP2 = [];         // to store distinct states from finalClosure

            // Get epsilon closure of state
            let innerstateClosure = epsilonClosures[state];    
    
            for (let symbolIndex = 0; symbolIndex < X.length; symbolIndex++) {
    
                // Get transition on a symbol for every states in epsilon closure 
                for (let closureState of innerstateClosure) {  
                    let transition = this.tfx[closureState][symbolIndex];       
                    
                    // store transition states in finalClosure
                    if (Q.includes(transition.toString())) {
                        finalClosure.push(transition.toString());
                    }
                }
                
                // Get epsilon closure for each transition state in finalClosure
                for(let i=0; i<finalClosure.length; i++){
                    transofCurState = this.returnEpsilonClosure(finalClosure[i]);
                    finalClosure[i] = transofCurState;
                }
                finalClosure = finalClosure.flat();
    
                // remove duplicate transition states
                for(let j=0; j<finalClosure.length; j++){
                    if(!finalP2.includes(finalClosure[j])){
                        finalP2.push(finalClosure[j]);
                    }
                }
                
                // set final transition into new table at its key value pair
                tfx[state].push(finalP2);

                // clear array before loop to next state in Q
                finalClosure = [];
                finalP2 = [];
            }
        }
        return new fa(Q, X, q0, F, tfx);
    }


    // D.2 CONVERT NFA to DFA
    convertNfaToDfa() {
        const Q = [];               // keep track of states to visit
        const newStates = {};       // keep track of new states of DFA      
        var transitions;
        var deadStates = [];        // to store  all dead states
        var newDeadState = '';      // new dead state name 
        var i = 1;                  // to keep track of number of dead states
    
        function getStateKey(stateSet) {
            return stateSet.sort().join(',');   // return string
        }
    
        // Set initial state the first state to visit
        const initialStateSet = [this.q0];
        const initialStateKey = getStateKey(initialStateSet);
    
        newStates[initialStateKey] = initialStateSet;
        Q.push(initialStateKey);
    
        const dfaTransitions = {};      // new transition table
    
        // Loop while there is state to visit
        while (Q.length > 0) {

            // current state(s) to visit
            const currentStateKey = Q.shift();      
            const currentStateSet = newStates[currentStateKey];
    
            // set up key for current visiting state in transition table
            dfaTransitions[currentStateKey] = {};   
    
            for (let symbol of this.X) {
                const nextStateSet = [];
                
                // Get transitions on the same symbol of every current state(s)
                for (let state of currentStateSet) {
    
                    if(this.Q.includes(state)){
                        transitions = this.tfx[state][this.X.indexOf(symbol)];
                    }
                    
                    if (transitions) {

                        for (let nextState of transitions) {
                            if (!nextStateSet.includes(nextState)) {
                                nextStateSet.push(nextState);   // store transitions
                            }
                        }

                    } 
                }
    
                // check if current state has transition on symbol
                // if no, create dead state
                if(nextStateSet.length == 0){           
                    newDeadState = `dead state ${i}`;
                    nextStateSet.push(newDeadState);        
                    deadStates.push(newDeadState);
                    i++;
                }
    
                // stringify transition states, then set it into transition table
                const nextStateKey = getStateKey(nextStateSet);
                dfaTransitions[currentStateKey][symbol] = nextStateKey;
    
                // check if transition state is already included in newStates or push it as new state to visit
                if (!(nextStateKey in newStates)) {         
                    newStates[nextStateKey] = nextStateSet;
                    Q.push(nextStateKey);       
                }
            }
        }
    
        // set transitions of dead states to itself
        if(deadStates.length !== 0){
            
            for(let j=0; j<deadStates.length; j++){
    
                for(let symbol of this.X){
                    dfaTransitions[deadStates[j]][symbol] = deadStates[j];
                }
    
            }
            
        }
    
        // set new states of Q' that include an nfa accepting state as a new accepting state
        const dfaAcceptingStates = [];
        for (let stateKey in newStates) {
            const stateSet = newStates[stateKey];
            for (let acceptingState of this.F) {
                if (stateSet.includes(acceptingState)) {
                    dfaAcceptingStates.push(stateKey);
                    break;
                }
            }
        }
    
        return new fa(Object.keys(newStates), this.X, initialStateKey, dfaAcceptingStates, dfaTransitions);
    }

    // E. Minizmize DFA

    // function to remove unreachable states
    findUnreacheableState(){
        var visited = [];
        var newQ = this.Q;
        visited.push(this.q0);

        // Get states reached by each state, stored in visited array
        for(let i = 0; i<newQ.length; i++){
            let tmp = this.tfx[`${newQ[i]}`];
            tmp = tmp.flat();
    
            for(let j=0; j<tmp.length; j++){
                if(!visited.includes(tmp[j])) visited.push(tmp[j])
            }
        }
    
        // remove state that is not in visited array from Q
        for(let k=0; k<newQ.length; k++){
            if(!visited.includes(newQ[k])) newQ.splice(k,1)
        }
        
        // return new set of states Q
        return newQ;
        
    }
    
    // function to check if 2 given states are in the same given set
    isSameSet(state1, state2, set){
        var included;

        // Get transition states for both states for a symbol
        for(let m = 0; m<this.X.length; m++){
            let output01 = this.returnNextState(state1, this.X[m]);
            let output02 = this.returnNextState(state2, this.X[m]);
            
            // Check if the given set has both transition states
            for(let i = 0; i<set.length; i++){
                if(set[i].includes(output01.toString()) && set[i].includes(output02.toString())){
                    included = true;
                    break;
                }
                else{
                    included = false;
                }
            }

            if(!included){
                return false;
            }
        }
        return true;
    }

    // function to check if 2 equivalences are the same
    compareEqui(equi01, equi02){
        // check their array lengths
        if(equi01.length != equi02.length) return false;
        
        // check if every element is the same
        if(equi01.length == equi02.length){
            for(let i = 0; i<equi01.length; i++){
                if(equi01[i].toString != equi02[i].toString) return false;
            }
            return true;
        }
    }

    // function to get new transition table for minimized array
    getNewTable(arr){
        let newStates = arr;      // to store array of states
        console.log(newStates);
        let Q = [];
        let str;
        let X = this.X;
        let q0;
        let transArr = [];      // to store transitions by all alphabets for each a state
        let finalStates = [];
        let transtable = {};    // new transition table

        for(let i = 0; i<newStates.length; i++){
            // Get new set of states Q
            str = newStates[i].toString();
            Q.push(str);

            // Set new q0
            if(newStates[i].includes(`${this.q0}`)){
                q0 = str;
            }

            // Get new set of final states
            for(let j=0; j<this.F.length; j++){

                if(newStates[i].includes(`${this.F[j]}`) && !finalStates.includes(str)){
                    finalStates.push(str);
                }
            }
        }

        // for each state, get its transitions by alphabets to store in an array, then set it in the transition table
        for(let j = 0; j<Q.length; j++){

            for(let k = 0; k<X.length; k++){
                let tmp = this.returnNextState(newStates[j][0], X[k]);

                for(let m = 0; m<Q.length; m++){

                    if(Q[m].includes(tmp)){
                        transArr.push(Q[m]);
                    }
                }
            }

            // set transitions array as the value of its state key in table
            transtable[Q[j]] = transArr;
            transArr = [];
        }
        return new fa(Q, X, q0, finalStates, transtable);
    }

    // main minimize function
    minimizeDFA(){
        // make 3d array to store all equivalences
        var equiArrays = [];

        // 0 EQUI: make 2d array of 0 equi: 2 arrays, 1 final states, 1 non-final.
        var tmpEqui = [];
        var startState = [];
        var endState = [];
        var states = this.findUnreacheableState();

        for(let i = 0; i<states.length; i++){
            if(this.F.includes(states[i])){
                endState.push(states[i]);
            } else{
                startState.push(states[i]);
            }
        }

        tmpEqui.push(startState);
        tmpEqui.push(endState);

        var resEqui = [];       // 2d result
        var minResEqui = [];    // 1d result
        var pushed;             // check if element was pushed into any array. else make new array for it
        var counter = 0;
        var indexTracker = [];

        // first, create equivalence 0. Then, as we loop through it, we create new arrays to store equivalence 1, 
        //and so on, til equivalence n = equivalence n-1

        // tmpEqui is the result of new equivalence
        
        while(true){

            // loop through every array of equivalence 0
            for(let i = 0; i<tmpEqui.length; i++){

                // add array with only 1 state to new equivalence
                if(tmpEqui[i].length == 1){
                    resEqui.push(tmpEqui[i]);
                    continue;
                }
            
                // loop through every state in each array
                for(let j=0; j<tmpEqui[i].length; j++){

                    // create new array for every first state (to compare other states against)
                    if(j == 0){
                        minResEqui.push(tmpEqui[i][j]);
                        resEqui.push(minResEqui);
                        var c = resEqui.indexOf(minResEqui);
                        minResEqui = [];
                        continue;
                    }
                    else{
                        // in the same array, check if the next state is in the same set as the first state
                        let val = this.isSameSet(tmpEqui[i][j], resEqui[c][0], tmpEqui, this.X);

                        // if same set, add it to the same array in new equivalence
                        if(val){
                            resEqui[c].push(tmpEqui[i][j]);
                            pushed = true;
                            continue;
                        } else{
                            pushed = false;
                        }

                        // check if there is another array it needs to check isSameSet with
                        if(indexTracker.length >= 1){
                            for(let k = 0; k<indexTracker.length; k++){
                                let t = indexTracker[k];

                                let val = this.isSameSet(tmpEqui[i][j], resEqui[t][0].toString(), tmpEqui, this.X);
                                if(val){
                                    resEqui[t].push(tmpEqui[i][j]);
                                    pushed = true;
                                    break;
                                }
                            }
                        }
                
                        // create new array for state that is not in same set as its first state
                        if(!pushed){
                            minResEqui.push(tmpEqui[i][j]);
                            resEqui.push(minResEqui);
                            
                            // set index of this new array for the next state to also check with it
                            // after it checks with the first state
                            let index  = resEqui.indexOf(minResEqui);
                            indexTracker.push(index);
                            minResEqui = [];
                        }
                    }
                }
                // after looping through an array element of equivalence, 
                // clear indexTracker for next array element
                indexTracker = [];
            }
            
            // add new equivalence to store
            equiArrays.push(tmpEqui);
            // reset arrays for next equivalence
            tmpEqui = [];
            tmpEqui = resEqui;
            resEqui = [];

            // check if current equivalence is the same as previous equivalence
            let l = equiArrays.length;
            if(l >= 2){

                // if same, stop compare and get new DFA transitions table
                if(this.compareEqui(equiArrays[l-1], equiArrays[l-2]) == true){
                    break;
                }
                else{   
                    // continue to new equivalence
                    counter ++;
                    continue;
                } 
            } 
        }

        // get transition table for minimized DFA
        let arr = equiArrays[equiArrays.length - 1];
        const newdfa = this.getNewTable(arr);
        console.log('Minimzed DFA : ', newdfa);
        return newdfa;
    }
}

var fsm;


// const statesNFA = ["A", "B", "C"];
// const alphabetNFA = ["a", "b"];
// const q0NFA = "A";
// const finalsNFA = ["C"];
// const transitionTableNFA = {
//     'A' : [["A", "B"], ["C"], []],
//     'B' : [["A"], ["B"], []],
//     'C' : [[], ["A", "B"], []]
// }

// const nfa = new fa(statesNFA, alphabetNFA, q0NFA, finalsNFA, transitionTableNFA);
// const dfaFromNFA = nfa.convertNfaToDfa();

// console.log("DFA from NFA States:", dfaFromNFA.Q);
// console.log("DFA from NFA Alphabet:", dfaFromNFA.X);
// console.log("DFA from NFA Initial State:", dfaFromNFA.q0);
// console.log("DFA from NFA Accepting States:", dfaFromNFA.F);
// console.log("DFA from NFA Transition Table:", dfaFromNFA.tfx);

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
        if (transitionsData.length !== alphabet.length + 1) {
            console.error(`Invalid transition format for state: "${state}". Number of transitions should match alphabet length.`);
            return;
        }
    
        transitionsData.forEach((data, index) => {
            if (index >= alphabet.length + 1) {
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

    fsm = new fa(states, alphabet, initialState, acceptStates, transitionsWithoutAlphabet);
    console.log('fsm = ', fsm);

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


var strInput;
var res;
document.addEventListener('DOMContentLoaded', ()=>{
    strInput = document.getElementById('enterString');
    res = document.getElementById('resultContent');
})

    // buttons in result
    // Event listeners for the buttons
    document.getElementById('testFAButton').addEventListener('click', function () {
        strInput.style.display = 'none';
        console.log('testing fa type...')
        console.log('fsm=',fsm);
        let result = fsm.CheckIfDFA() ? '<br>It is a DFA.' : '<br>It is an NFA.';
        console.log(result);
        res.innerHTML = result;
    });

    document.getElementById('testStringButton').addEventListener('click', function () {
        strInput.style.display = 'block';
    });

    document.getElementById('start').addEventListener('click', ()=>{
        let str = document.getElementById('str').value;
        if(str !== null){
            let result = fsm.testEpsilonString(str) ? '<br>String accepted.' : '<br>String rejected.';
            document.getElementById('resultContent').innerHTML = result;
            console.log('test epstring= ', fsm.testEpsilonString(str));
        }
        if(str.length == 0){
            let result = fsm.testEmptyString() ? '<br>Empty String accepted.' : '<br>Empty String rejected.';
            document.getElementById('resultContent').innerHTML = result;
        }
    })

    document.getElementById('convertDFAButton').addEventListener('click', function () {
        strInput.style.display = 'none';

        // check FA type
        let checkType = fsm.CheckIfDFA();

        if(checkType){
            // if DFA, no convert
            document.getElementById('resultContent').innerHTML = '<br>Already a DFA.';
        } else if(!checkType){
            // if NFA, check ENFA or NFA
            let isEnfa = false;
            let resDFA;
            let newQ = '';
            let newF = '';

            // check if there is transition on epsilon
            for(let i=0; i<fsm.Q.length; i++){
                let etransition = fsm.tfx[fsm.Q[i].toString()][fsm.X.length];

                if(etransition.length !== 0) isEnfa = true; break;
            }

            // if ENFA, run 2 functions ENFA -> NFA -> DFA
            // if NFA, run only NFA -> DFA
            if(isEnfa){
                console.log('it is ENFA.');
                let enfaTonfa = fsm.removeEpsilonTransitions();
                resDFA = enfaTonfa.convertNfaToDfa();
            } else if(!isEnfa){
                console.log('It is NFA.');
                resDFA = fsm.convertNfaToDfa();

            }

            console.log('resdfa=', resDFA);

            // set result to display on UI
            for(let i=0; i<resDFA.Q.length; i++){
                newQ += `{${resDFA.Q[i]}}`;

                if(i != resDFA.Q.length-1) newQ += ', ';
            }

            for(let j=0; j<resDFA.F.length; j++){
                newF += `{${resDFA.F[j]}}`;

                if(j != resDFA.F.length-1) newF += ', ';
            }
            
            let content = `<br>
            Converted DFA<br><br>

                1. Q (States) = ${newQ} <br>
                2. q0 (Initial State) = {${resDFA.q0}}<br>
                3. F (Accepting States) = ${newF} <br>
                4. X (Alphabet) = ${resDFA.X}   <br>
                5. Transition table:<br><br>

                <table>
                    <tr></tr>
                </table>
            `

            // set transition table to display in a table in UI
            let tableContent = '<table><tr><th></th>';
            for(let i=0; i<resDFA.X.length; i++){
                tableContent += `<th>${resDFA.X[i]}</th>`;
            }
            tableContent += '</tr>';

            for(let j=0; j<resDFA.Q.length; j++){
                let state = resDFA.Q[j];
                tableContent += `<tr><th>{${state}}</th>`;

                for(let k=0; k<resDFA.X.length; k++){
                    tableContent += `<td>{${resDFA.tfx[state][resDFA.X[k]]}}</td>`;
                }
                tableContent += '</tr>'
            }
            tableContent += '</table>';

            document.getElementById('resultContent').innerHTML = content + tableContent;

        }
    
        
    });

    document.getElementById('minimizeButton').addEventListener('click', function () {
        strInput.style.display = 'none';

        let checkFAType = fsm.CheckIfDFA();

        // if DFA, minimize DFA
        if(checkFAType){
            let minDFA = fsm.minimizeDFA();
            let newQ = '';
            let newF = '';
            console.log(minDFA);

            // set result to display on UI
            for(let k=0; k<minDFA.Q.length; k++){
                
                newQ += `{${minDFA.Q[k]}}`;

                if(k != minDFA.Q.length-1) newQ += ', ';
            }

            for(let m=0; m<minDFA.F.length; m++){
                
                newF += `{${minDFA.F[m]}}`;

                if(m != minDFA.F.length-1) newF += ', ';
            }

            let content = `<br>
            Minimized DFA<br><br>
    
                1. Q (States) = ${newQ} <br>
                2. q0 (Initial State) = {${minDFA.q0}}<br>
                3. F (Accepting States) = ${newF} <br>
                4. X (Alphabet) = ${minDFA.X}   <br>
                5. Transition table: <br><br>
            `
            // set transition table to display in a table in UI
            let tableContent = '<table><tr><th></th>';
            for(let i=0; i<minDFA.X.length; i++){
                tableContent += `<th>${minDFA.X[i]}</th>`;
            }
            tableContent += '</tr>';
    
            for(let j=0; j<minDFA.Q.length; j++){
                let state = minDFA.Q[j];
                tableContent += `<tr><th>{${state}}</th>`;
    
                for(let k=0; k<minDFA.X.length; k++){
                   
                    tableContent += `<td>{${minDFA.tfx[state][k]}}</td>`;
                }
                tableContent += '</tr>'
            }
            tableContent += '</table>';
    
            document.getElementById('resultContent').innerHTML = content + tableContent;
        }

        // if not DFA, no run function
        if(!checkFAType){
            document.getElementById('resultContent').innerHTML = '<br>Cannot minimize NFA. Must be DFA.'
        }
        
    });
