const form = document.getElementById("regForm");
const outputBox = document.getElementById("outputBox");

// ===== Helpers: Show / Clear Errors =====

function setError(key, message) {
    document.getElementById("e-" + key).textContent = message;
    document.getElementById("g-" + key).classList.add("invalid");
}

function clearError(key) {
    document.getElementById("e-" + key).textContent = "";
    document.getElementById("g-" + key).classList.remove("invalid");
}

// ===== Validation Patterns =====

const namePattern = /^[A-Za-z][A-Za-z\s'.-]{1,29}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^03\d{9}$/;

// ===== Validate Form =====

function validateForm() {

    let valid = true;

    const firstName = document.getElementById("firstName").value.trim();
    const secondName = document.getElementById("secondName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const ageRaw = document.getElementById("age").value.trim();

    const genderEl = document.querySelector('input[name="gender"]:checked');

    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value.trim();

    // First Name

    if (!firstName) {
        setError("first", "First name is required.");
        valid = false;
    }
    else if (!namePattern.test(firstName)) {
        setError("first", "Enter a valid name (2-30 characters).");
        valid = false;
    }
    else {
        clearError("first");
    }

    // Second Name

    if (!secondName) {
        setError("second", "Second name is required.");
        valid = false;
    }
    else if (!namePattern.test(secondName)) {
        setError("second", "Enter a valid name (2-30 characters).");
        valid = false;
    }
    else {
        clearError("second");
    }

    // Email

    if (!email) {
        setError("email", "Email address is required.");
        valid = false;
    }
    else if (!emailPattern.test(email)) {
        setError("email", "Enter a valid email address.");
        valid = false;
    }
    else {
        clearError("email");
    }

    // Phone

    if (!phone) {
        setError("phone", "Phone number is required.");
        valid = false;
    }
    else if (!phonePattern.test(phone)) {
        setError("phone", "Use Pakistani format: 03XXXXXXXXX.");
        valid = false;
    }
    else {
        clearError("phone");
    }

    // Age

    const age = Number(ageRaw);

    if (!ageRaw) {
        setError("age", "Age is required.");
        valid = false;
    }
    else if (!Number.isInteger(age) || age < 1 || age > 120) {
        setError("age", "Age must be between 1 and 120.");
        valid = false;
    }
    else {
        clearError("age");
    }

    // Gender

    if (!genderEl) {
        setError("gender", "Please select your gender.");
        valid = false;
    }
    else {
        clearError("gender");
    }

    // City

    if (!city) {
        setError("city", "Please select your city.");
        valid = false;
    }
    else {
        clearError("city");
    }

    // Address

    if (!address) {
        setError("address", "Complete address is required.");
        valid = false;
    }
    else if (address.length < 10) {
        setError("address", "Address must be at least 10 characters.");
        valid = false;
    }
    else {
        clearError("address");
    }

    // If Form Is Invalid

    if (!valid) {
        return null;
    }

    // Return Data

    return {
        "First Name": firstName,
        "Second Name": secondName,
        "Email": email,
        "Phone": phone,
        "Age": age,
        "Gender": genderEl.value,
        "City": city,
        "Address": address
    };
}

// ===== Show Output =====

function showOutput(data) {

    outputBox.innerHTML = "";

    // Success Message

    const msg = document.createElement("p");

    msg.className = "success-msg";
    msg.textContent = "✔ Registration submitted successfully!";

    // Create Table

    const table = document.createElement("table");

    table.className = "output-table";

    Object.entries(data).forEach(([label, value]) => {

        const tr = document.createElement("tr");

        const th = document.createElement("th");
        const td = document.createElement("td");

        th.textContent = label;
        td.textContent = value;

        tr.appendChild(th);
        tr.appendChild(td);

        table.appendChild(tr);

    });

    // ===== Gender Based Text =====

    const gender = data["Gender"].toLowerCase();

    const actionText = document.createElement("h3");

    actionText.className = "gender-action-text";

    if (gender === "female") {

        actionText.textContent = "Do Tasks!";

    }
    else if (gender === "male") {

        actionText.textContent = "Go and Earn!";

    }

    // Append Elements

    outputBox.appendChild(msg);
    outputBox.appendChild(table);
    outputBox.appendChild(actionText);

}

// ===== Handle Form Submit =====

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const data = validateForm();

    if (!data) {
        return;
    }

    showOutput(data);

    form.reset();

});

// ===== Phone: Allow Only Digits =====

document.getElementById("phone").addEventListener("input", function() {

    this.value = this.value.replace(/\D/g, "");

});

// ===== Live Error Clearing =====

const liveMap = {

    firstName: "first",
    secondName: "second",
    email: "email",
    phone: "phone",
    age: "age",
    city: "city",
    address: "address"

};

Object.entries(liveMap).forEach(([id, key]) => {

    const el = document.getElementById(id);

    el.addEventListener("input", () => clearError(key));

    el.addEventListener("change", () => clearError(key));

});

// ===== Gender Error Clearing =====

document.querySelectorAll('input[name="gender"]').forEach(radio => {

    radio.addEventListener("change", function() {

        clearError("gender");

    });

});