
const form = document.getElementById("registerForm");
const resetBtn = document.getElementById("resetBtn");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");
const termsError = document.getElementById("termsError");
const successMsg = document.getElementById("successMsg");

function clearMessages() {
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmError.textContent = "";
  termsError.textContent = "";
  successMsg.textContent = "";
}

// function isValidEmail(v) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// }

function isStrongEnoughPassword(v) {
  // Rule: at least 8 characters 
  return v.length >= 8;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  let ok = true;

  if (fullName.value.trim().length < 2) {
    nameError.textContent = "Please enter your full name.";
    ok = false;
  }

  if (email.value.trim().length < 3) {
    emailError.textContent = "Please enter a username or email.";
    ok = false;
  }

  if (!isStrongEnoughPassword(password.value)) {
    passwordError.textContent = "Password must be at least 8 characters.";
    ok = false;
  }

  if (confirmPassword.value !== password.value) {
    confirmError.textContent = "Passwords do not match.";
    ok = false;
  }

  if (!terms.checked) {
    termsError.textContent = "You must agree before registering.";
    ok = false;
  }

  if (!ok) return;

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email.value.trim(),
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      successMsg.textContent = "";
      emailError.textContent = data.error || "Registration failed.";
      return;
    }

    const user = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("supporther_user", JSON.stringify(user));

    successMsg.textContent = "Registered successfully! You can now log in.";
    form.reset();

  } catch (err) {
    console.error("Registration error:", err);
    successMsg.textContent = "";
    emailError.textContent = "Could not connect to the server.";
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  clearMessages();
});