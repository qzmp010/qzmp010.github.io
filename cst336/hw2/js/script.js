document.querySelector("button").addEventListener("click", gradeQuiz);

function isFormValid() {
    let isValid = true;
    if (document.querySelector("#q1").value == "") {
        isValid = true;

        if (document.querySelector("#q1").value == "") {
            isValid = false;
            document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered";
        }
        return isValid;
    }
}

function gradeQuiz() {
    console.log("Grading quiz…");
    document.querySelector("#validationFdbk").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    let q1Response = document.querySelector("#q1").value;
    console.log(q1Response);
}