class fa{
    constructor(Q, X, q0, F, tfx){
        this.Q  = Q;
        this.X = X;
        this.q0 = q0;
        this.F = F;
        this.tfx = tfx;

        this.isDFA = this.CheckIfDFA();
        // Check if the FA is a DFA upon initialization
    }

    returnNextState(state, input){
        this.state = state;
        this.input = input;


        // document.write(inputAlphabet.includes(input) && State.includes(state));
        if(this.X.includes(this.input) && this.Q.includes(this.state)){
            // document.write(State.indexOf(state) + "<br>");
            // document.write(inputAlphabet.indexOf(input) + "<br>");
            return this.tfx[this.Q.indexOf(this.state)][this.X.indexOf(this.input)];
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
    
                document.write("<br>" +`${i}` + ": input = " + `${this.inputSequence.charAt(i)}`);
    
                document.write("<br>Current state: " + this.currentStates[j] 
                            + " - Input: " + currentInput);

            
                this.currentStates[j] = `${this.returnNextState(this.currentStates[j], currentInput)}`;
                this.currentStates[j] = this.currentStates[j].split(',');
    
                document.write(" --> Next state: " + this.currentStates[j]);
    
                // currentStates = currentStates.flat();
    
                if(this.currentStates[j].includes(this.F)){
                    document.write(" (accepting state)");
                }
    
                // if(acceptingState.includes(currentStates[j])){
                //     document.write(" (accepting state)");
                // }
            }
            this.currentStates = this.currentStates.flat();
          
        }
    
        document.write("<br>Ending state: " + this.currentStates);

        for(let i = 0; i<this.F.length; i++){
            if(this.currentStates.includes(this.F[i])){
                document.write(" (accepting state)");
            } else {
                document.write(" (string rejected)");
            }

        }
        
    }
    
// DFA Checking

    CheckIfDFA()
    {
        for(let stateIndex in this.tfx){
            let stateTransition = this.tfx[stateIndex];
            if (stateTransition.length !== this.X.length){
                return false; // each state have only one transition for a symbol
            }
            for ( let transition of stateTransition){
                if(Array.isArray(transition)&&transition.length !== 1){
                    return false;
                    // check for one transition for 1 symbol
                }
            }
        }
        return true;
    }
}



// // DFA Example
// const states = "s0,s1,s2";
// const alphabet = "ab";
// const q0 = "s0";
// const finals = "s2";
// const transfx = {
//     0: ["s1", "s0"],
//     1: ["s1", "s2"],
//     2: ["s2", "s2"]
// };

// const statesArr = states.split(',');
// const myFa = new fa(statesArr, alphabet, q0, finals, transfx);

// // Test if DFA
// console.log("Is DFA:", myFa.isDFA);

// Test DFA string
// myFa.testString("bbaabb");

// // NFA Example
// const State = [
//     "STATE 0",        // index 0: first a or b
//     "STATE 1",        // index 1: b at 3rd pos from end
//     "STATE 2",        // index 2: b at 2nd pos from end or a
//     "STATE 3",        // index 3: a or b
//     "ERROR"           // index 4
// ];

// const initialState = State[0];
// const acceptingState = [State[3]];
// const inputAlphabet = "ab";
// const transitionTable = {
//     0: [[State[0]], [State[0], State[1]]],
//     1: [[State[2]], [State[2]]],
//     2: [[State[3]], [State[3]]],
//     3: [[], [], []],
//     4: [State[4], State[4]]
// };

// const myFa02 = new fa(State, inputAlphabet, initialState, acceptingState, transitionTable);


// // Test if NFA
// console.log("Is DFA:", myFa02.isDFA);


// TAKE 1: DFA (success)
//     var states = "s0,s1,s2";
//     var alphabet = "ab";
//     var q0 = "s0";
//     var finals = "s2";
//     var transfx = {
//         0 : ["s1", "s0"],
//         1 : ["s1", "s2"],
//         2 : ["s2", "s2"]
//     }

    // var statesArr = states.split(',');
    // const myFa = new fa(statesArr, alphabet, q0, finals, transfx);

    // console.log("---- test00 running...");

    // myFa.testString("bbaabb");


// TAKE 2: NFA (success)

    // 1. Q: set of states
    const State = [
        "STATE 0",        // index 0: first a or b
        "STATE 1",        // index 1: b at 3rd pos from end
        "STATE 2",        // index 2: b at 2nd pos from end or a
        "STATE 3",        // index 3: a or b
        "ERROR"           // index 4
    ];
    
    // 2. q0: initial state
    const initialState = State[0];

    // 3. F: set of accepting states
    const acceptingState = [State[3]];
    const errorState = State[4];

    // 4. X: set of symbols
    const inputAlphabet = "ab";

    // 5. sigma: transition functions
    const transitionTable = {
        0: [[State[0]], [State[0], State[1]]],
        1: [[State[2]], [State[2]]],
        2: [[State[3]], [State[3]]],
        3: [[], [], []],
        4: [State[4], State[4]]
    };

    const myFa02 = new fa(State, inputAlphabet, initialState, acceptingState, transitionTable);
    // myFa02.testString("abbbaaa");
    // Test if NFA
    // console.log("Is DFA:", myFa02.isDFA);

// // TAKE 3: DFA (success)
    var states03 = "s0,s1,s2,s3";
    var q003 = "s0";
    var finals03 = "s0,s1";
    var alphabet03 = "abc";
    var tt03 = {
        0 : ["s1", "s3", "s1"],
        1 : ["s3", "s0", "s0"],
        2 : ["s3", "s1", "s0"],
        3 : ["s3", "s3", "s3"]
    };

    var statesArr03 = states03.split(',');
    var finalsArr03 = finals03.split(',');

    const myFa03 = new fa(statesArr03, alphabet03, q003, finalsArr03, tt03);
//     // myFa03.testString("abca");
console.log("is DFA:", myFa03.CheckIfDFA()) ;


// // TAKE 4: NFA (success)
//     var states04 = "s0,s1,s2,s3";
//     var q004 = "s0";
//     var finals04 = "s0,s1";
//     var alphabet04 = "abc";
//     var tt04 = {
//         0 : [["s1,s2"],[],["s1"]],
//         1 : [["s0"],["s1"],["s0,s3"]],
//         2 : [["s1"],[],[]],
//         3 : [["s0"],["s3"],[]]
//     };

//     var statesArr04 = states04.split(',');
//     var finalsArr04 = finals04.split(',');

//     const myFa04 = new fa(statesArr04, alphabet04, q004, finalsArr04, tt04);
//     // myFa04.testString("acbbac");


// // Getting input from html elements
// var capq = document.getElementById("Q").value;
// var capx = document.getElementById('X');
// var qzero = document.getElementById('q0');
// var capf = document.getElementById('F');
// var tt = document.getElementById('tfx');

// console.log(capq);  // empty






