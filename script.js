// ===== Element references =====
const form = document.getElementById("regForm");
const outputBox = document.getElementById("outputBox");

// ===== Helpers: show / clear an error for a field group =====
function setError(key, message) {
  document.getElementById("e-" + key).textContent = message;
  document.getElementById("g-" + key).classList.add("invalid");
}

function clearError(key) {
  document.getElementById("e-" + key).textContent = "";
  document.getElementById("g-" + key).classList.remove("invalid");
}

// ===== Validation patterns =====
const namePattern  = /^[A-Za-z][A-Za-z\s'.-]{1,29}$/;   // letters, 2-30 chars
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   // basic email format
const phonePattern = /^03\d{9}$/;                       // Pakistani: 03XXXXXXXXX

// ===== Validate every field; returns data object or null =====
function validateForm() {
  let valid = true;

  const firstName  = document.getElementById("firstName").value.trim();
  const secondName = document.getElementById("secondName").value.trim();
  const email      = document.getElementById("email").value.trim();
  const phone      = document.getElementById("phone").value.trim();
  const ageRaw     = document.getElementById("age").value.trim();
  const genderEl   = document.querySelector('input[name="gender"]:checked');
  const city       = document.getElementById("city").value;
  const address    = document.getElementById("address").value.trim();

  // First name
  if (!firstName) { setError("first", "First name is required."); valid = false; }
  else if (!namePattern.test(firstName)) { setError("first", "Enter a valid name (letters only, 2–30 characters)."); valid = false; }
  else clearError("first");

  // Second name
  if (!secondName) { setError("second", "Second name is required."); valid = false; }
  else if (!namePattern.test(secondName)) { setError("second", "Enter a valid name (letters only, 2–30 characters)."); valid = false; }
  else clearError("second");

  // Email
  if (!email) { setError("email", "Email address is required."); valid = false; }
  else if (!emailPattern.test(email)) { setError("email", "Enter a valid email (e.g. name@example.com)."); valid = false; }
  else clearError("email");

  // Phone
  if (!phone) { setError("phone", "Phone number is required."); valid = false; }
  else if (!phonePattern.test(phone)) { setError("phone", "Use Pakistani format: 03XXXXXXXXX (11 digits)."); valid = false; }
  else clearError("phone");

  // Age
  const age = Number(ageRaw);
  if (!ageRaw) { setError("age", "Age is required."); valid = false; }
  else if (!Number.isInteger(age) || age < 1 || age > 120) { setError("age", "Age must be a whole number between 1 and 120."); valid = false; }
  else clearError("age");

  // Gender
  if (!genderEl) { setError("gender", "Please select your gender."); valid = false; }
  else clearError("gender");

  // City
  if (!city) { setError("city", "Please select your city."); valid = false; }
  else clearError("city");

  // Address
  if (!address) { setError("address", "Complete address is required."); valid = false; }
  else if (address.length < 10) { setError("address", "Address is too short (minimum 10 characters)."); valid = false; }
  else clearError("address");

  if (!valid) return null;

  return {
    "First Name": firstName,
    "Second Name": secondName,
    "Email Address": email,
    "Phone Number": phone,
    "Age": age,
    "Gender": genderEl.value,
    "City": city,
    "Complete Address": address
  };
}

// ===== Render submitted data as a table (textContent prevents HTML injection) =====
function showOutput(data) {
  outputBox.innerHTML = "";

  const msg = document.createElement("p");
  msg.className = "success-msg";
  msg.textContent = "✔ Registration submitted successfully!";

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

  outputBox.appendChild(msg);
  outputBox.appendChild(table);
}

// ===== Handle submit =====
form.addEventListener("submit", function (event) {
  event.preventDefault();               // stop default submission

  const data = validateForm();
  if (!data) return;                    // stop if any field is invalid

  showOutput(data);                     // display the data
  form.reset();                         // clear the form
});

// ===== Allow only digits in phone field =====
document.getElementById("phone").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// ===== Clear a field's error as soon as the user fixes it =====
const liveMap = {
  firstName: "first", secondName: "second", email: "email",
  phone: "phone", age: "age", city: "city", address: "address"
};

Object.entries(liveMap).forEach(([id, key]) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => clearError(key));
  el.addEventListener("change", () => clearError(key));
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener("change", () => clearError("gender"));
});