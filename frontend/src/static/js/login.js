const form = document.querySelector("#loginForm");

const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");

async function validateForm(event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    try{
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        const data = await res.json();

        if(res.ok){
            console.log("Login good:", data);

            localStorage.setItem("supporther_user_id", data.userId);
            localStorage.setItem("supporther_username", username);

            window.location.href = "/browse";
        } else {
            alert("Invalid");
        }
    } catch(err) {
        console.error("Login error:", err);
    }

    // let valid = false;
    // let errors = [];

    // if(!valid){
    //     event.preventDefault();
    //     form.reportValidity();
    //     console.log(errors);
    // }
}

form.addEventListener("submit", validateForm);