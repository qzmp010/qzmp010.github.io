//event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", function (event) {
    validateForm(event);
});

//global variables
var isUsernameAvailable = true;
var isZipValid = true;

//functions
//Displaying states from Web API
//Execute upon load
(async function displayStates() {
    let stateList = document.querySelector("#state");
    let url = "https://csumb.space/api/allStatesAPI.php"
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    for (let i of data) {
        stateList.innerHTML += `<option value="${i.usps}"> ${i.state} </option>`;
    }
})();

//Displaying city from Web API after entering a zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value.trim();
    const zipError = document.querySelector("#zipError");
    const cityEl = document.querySelector("#city");
    const latEl = document.querySelector("#latitude");
    const lonEl = document.querySelector("#longitude");

    // helper: clear city/lat/lon display
    const clearLocation = () => {
        cityEl.innerHTML = "";
        latEl.innerHTML = "";
        lonEl.innerHTML = "";
    };

    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data === false) {
        zipError.innerHTML = "ZIP not found.";
        isZipValid = false;
        clearLocation();
        return;
    }

    // valid ZIP → show data
    cityEl.innerHTML = data.city;
    latEl.innerHTML = data.latitude;
    lonEl.innerHTML = data.longitude;

    zipError.innerHTML = "";   // clear any prior error
    isZipValid = true;
}

//Displaying counties from Web API based on the two-letter abbreviation of a state
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");
    countyList.innerHTML = `<option value=""> Select County </option>`;
    for (let i of data) {
        countyList.innerHTML += `<option> ${i.county} </option>`;
    }
}

function validateUsername(isAvailable) {
    isUsernameAvailable = isAvailable;
    let usernameError = document.querySelector("#usernameError")
    if (isAvailable) {
        usernameError.innerHTML = " Username available!";
        usernameError.style.color = "#00bc00";
    }
    else {
        usernameError.innerHTML = " Username taken";
        usernameError.style.color = "#f95d5d";
    }
}

//checking whether the username is available
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    validateUsername(data.available);
}

//Validating form data
function validateForm(e) {
    e.preventDefault();
    let isValid = true;
    let fName = document.querySelector("input[name='fName']").value;
    let lName = document.querySelector("input[name='lName']").value;
    let gender = document.querySelector("input[name='gender']:checked");
    let zip = document.querySelector("#zip").value;
    let state = document.querySelector("#state").value;
    let county = document.querySelector("#county").value;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    document.querySelectorAll(".error").forEach(el => el.innerHTML = "");
        
    if (fName.length == 0) {
        document.querySelector("#fNameError").innerHTML = "First Name Required!";
        isValid = false;
    }

    if (lName.length == 0) {
        document.querySelector("#lNameError").innerHTML = "Last Name Required!";
        isValid = false;
    }

    if (!gender) {
        document.querySelector("#genderError").innerHTML = "Gender Required!";
        isValid = false;
    }

    if (zip.length == 0) {
        document.querySelector("#zipError").innerHTML = "Zip Required!";
        isValid = false;
    } else if (!isZipValid) {
    document.querySelector("#zipError").innerHTML = "Enter a valid 5-digit zip code.";
        isValid = false;
    }

    if (state.length == 0) {
        document.querySelector("#stateError").innerHTML = "State Required!";
        isValid = false;
    }

    if (county.length == 0) {
        document.querySelector("#countyError").innerHTML = "County Required!";
        isValid = false;
    }

    if (username.length == 0) {
        document.querySelector("#usernameError").innerHTML = "Username Required!";
        isValid = false;
    } else if (!isUsernameAvailable) {
        validateUsername(false);
        isValid = false;
    }

    if (password.length < 6) {
        document.querySelector("#suggestedPwd").innerHTML = "Password must be at least 6 characters.";
        isValid = false;
    }
    
    if (password != passwordAgain) {
        document.querySelector("#passwordError").innerHTML = "Retype passwords, so they match.";
        isValid = false;
    }

    if (isValid) {
        e.target.submit();
    }
}