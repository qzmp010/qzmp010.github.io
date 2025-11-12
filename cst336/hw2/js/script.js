//event listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

//global variables
var score = 0;
var attempts = localStorage.getItem("total_attempts");

displayQ4Choices();
displayQ7Choices();
displayQ8Choices();
displayQ10Choices();
displayTotalAttempts();

//Functions
function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    q4ChoicesArray = _.shuffle(q4ChoicesArray);
    for (let i = 0; i < q4ChoicesArray.length; i++) {
        const val = q4ChoicesArray[i];
        const id = `q4-${val.replace(/\s+/g, "-")}`; //fix invalid space in id
        document.querySelector("#q4Choices").innerHTML += ` <input type="radio" name="q4" id="${id}" 
            value="${val}"> <label for="${id}"> ${val}</label>`;
    }
}

function displayQ7Choices() {
    let q7ChoicesArray = ["Connecticut", "Maine", "Pennsylvania", "Vermont"];
    q7ChoicesArray = _.shuffle(q7ChoicesArray);
    for (let i = 0; i < q7ChoicesArray.length; i++) {
        document.querySelector("#q7Choices").innerHTML += ` <input type="checkbox" name="q7" id="q7-${q7ChoicesArray[i]}" 
            value="${q7ChoicesArray[i]}"> <label for="q7-${q7ChoicesArray[i]}"> ${q7ChoicesArray[i]}</label>`;
    }
}

function displayQ8Choices() {
    let q8ChoicesArray = ["Arizona", "California", "Florida", "Nevada"];
    q8ChoicesArray = _.shuffle(q8ChoicesArray);
    for (let i = 0; i < q8ChoicesArray.length; i++) {
        document.querySelector("#q8Choices").innerHTML += ` <input type="checkbox" name="q8" id="q8-${q8ChoicesArray[i]}" 
            value="${q8ChoicesArray[i]}"> <label for="q8-${q8ChoicesArray[i]}"> ${q8ChoicesArray[i]}</label>`;
    }
}

function displayQ10Choices() {
    let q10ChoicesArray = ["Midwest", "Northeast", "South", "West"];
    q10ChoicesArray = _.shuffle(q10ChoicesArray);
    for (let i = 0; i < q10ChoicesArray.length; i++) {
        document.querySelector("#q10Choices").innerHTML += ` <input type="radio" name="q10" id="q10-${q10ChoicesArray[i]}" 
            value="${q10ChoicesArray[i]}"> <label for="q10-${q10ChoicesArray[i]}"> ${q10ChoicesArray[i]}</label>`;
    }
}

function displayTotalAttempts() {
    document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${attempts ?? 0}`;
}

//checks if every checkbox in element @param div are unchecked
function allUnchecked(div) {
    return Array.from(div.querySelectorAll("input[type='checkbox']"))
        .every(cb => !cb.checked);
}

//validate if all questions are answered
function isFormValid() {
    let notAnswered = []
    if (document.querySelector("#q1").value == "") {
        notAnswered.push(1);
    }

    if (!document.querySelector("#q2").value) {
        notAnswered.push(2);
    }

    if (allUnchecked(document.querySelector("#q3Choices"))) {
        notAnswered.push(3);
    }

    if (!document.querySelector("input[name=q4]:checked")) {
        notAnswered.push(4);
    }

    if (document.querySelector("#q5").value == "") {
        notAnswered.push(5);
    }

    if (!document.querySelector("#q6").value) {
        notAnswered.push(6);
    }

    if (allUnchecked(document.querySelector("#q7Choices"))) {
        notAnswered.push(7);
    }
    
    if (allUnchecked(document.querySelector("#q8Choices"))) {
        notAnswered.push(8);
    }

    if (document.querySelector("#q9").value == "") {
        notAnswered.push(9);
    }

    if (!document.querySelector("input[name=q10]:checked")) {
        notAnswered.push(10);
    }

    if (notAnswered.length) {
        document.querySelector("#validationFdbk").innerHTML = 
            `Question(s) ${notAnswered.join(", ")} were not answered`;
        return false;
    } else {
        document.querySelector("#validationFdbk").innerHTML = "";
    }
    return true;
}

function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "feedback bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' class='markImg' alt='Checkmark'>";
    score += 10;
}

function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${index}Feedback`).className = "feedback bg-warning text-black";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' class='markImg' alt='xmark'>";
}

function gradeQuiz() {
    console.log("Grading quiz…");
    document.querySelector("#validationFdbk").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    //variables
    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value.toLowerCase();
    let q4Response = document.querySelector("input[name=q4]:checked")?.value;
    let q5Response = document.querySelector("#q5").value.toLowerCase();
    let q6Response = document.querySelector("#q6").value.toLowerCase();
    let q9Response = document.querySelector("#q9").value.toLowerCase();
    let q10Response = document.querySelector("input[name=q10]:checked")?.value;

    console.log(q1Response);

    //grade question 1
    if (q1Response == "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    //grade question 2
    if (q2Response == "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    //Grading question 3
    if (document.querySelector("#Jefferson").checked && document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked && !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    //grade question 4
    if (q4Response == "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    //grade question 5
    if (q5Response == "utah") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    //grade question 6
    if (q6Response == "ak") {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    //Grading question 7
    if (document.querySelector("#q7-Connecticut").checked && document.querySelector("#q7-Maine").checked &&
        document.querySelector("#q7-Vermont").checked && !document.querySelector("#q7-Pennsylvania").checked) {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    //Grading question 8
    if (document.querySelector("#q8-Arizona").checked && document.querySelector("#q8-California").checked &&
        !document.querySelector("#q8-Florida").checked && !document.querySelector("#q8-Nevada").checked) {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    //grade question 9
    if (q9Response == "potomac") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    //grade question 10
    if (q10Response == "South") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    document.querySelector("#totalScore").innerHTML = `Total Score: ${score} / 100`;
    attempts++;
    displayTotalAttempts();
    localStorage.setItem("total_attempts", attempts);

    //display congratulatory message only if score is above 80
    if (score <= 80) {
        document.querySelector("#totalScore").className = "bg-warning text-danger";
        document.querySelector("#congrats").style.display = "none";

    } else {
        document.querySelector("#totalScore").className = "bg-warning text-success";
        document.querySelector("#congrats").style.display = "inline";
    
    }
}