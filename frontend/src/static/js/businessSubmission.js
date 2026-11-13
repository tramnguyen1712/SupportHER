const form = document.querySelector("#businessSubmit");

async function validateForm(event) {
    event.preventDefault();

    const businessName = document.querySelector("#businessName");

    const address = document.querySelector("#address");
    const city = document.querySelector("#city");
    const state = document.querySelector("#state");
    const zip = document.querySelector("#zip");

    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");

    const email = document.querySelector("#email");
    const phone = document.querySelector("#businessPhone");

    const terms = document.querySelector("#terms");

    let valid = true;
    let errors = [];

    businessName.setCustomValidity("");
    if(!businessName.checkValidity()){
        errors.push("Business name is required.");
        businessName.setCustomValidity("Business name is required.");
        valid = false;
    }

    address.setCustomValidity("");
    if(!address.checkValidity()){
        errors.push("Address is required.");
        address.setCustomValidity("Address is required.");
        valid = false;
    }
    city.setCustomValidity("");
    if(!city.checkValidity()){
        errors.push("City is required.");
        city.setCustomValidity("City is required.");
        valid = false;
    }
    state.setCustomValidity("");
    if(!state.checkValidity()){
        errors.push("State is required and should be 2 characters long.");
        state.setCustomValidity("State is required and should be 2 characters long.");
        valid = false;
    }
    zip.setCustomValidity("");
    if(!zip.checkValidity()){
        errors.push("Zip is required and should be 5 characters long.");
        zip.setCustomValidity("Zip is required and should be 5 characters long.");
        valid = false;
    }

    firstName.setCustomValidity("");
    if(!firstName.checkValidity()){
        errors.push("First name is required.");
        firstName.setCustomValidity("First name is required.");
        valid = false;
    }
    lastName.setCustomValidity("");
    if(!lastName.checkValidity()){
        errors.push("Last name is required.");
        lastName.setCustomValidity("Last name is required.");
        valid = false;
    }

    email.setCustomValidity("");
    if(!email.checkValidity()){
        errors.push("Email is required.");
        email.setCustomValidity("Email is required.");
        valid = false;
    }

    phone.setCustomValidity("");
    if(!phone.checkValidity()){
        errors.push("Phone number is required and should follow the format XXX-XXX-XXXX.");
        phone.setCustomValidity("Phone number is required and should follow the format XXX-XXX-XXXX.");
        valid = false;
    }

    terms.setCustomValidity("");
    if(!terms.checked){
        errors.push("Terms and Conditions must be accepted.");
        terms.setCustomValidity("Terms and Conditions must be accepted.");
        valid = false;
    }

    if(valid){
        try{
            const res = await fetch('/api/businesses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: businessName.value,
                    address: address.value,
                    city: city.value,
                    state: state.value,
                    zip: zip.value
                })
            });
        } catch(err){
            console.error(err);
        }
    }

    if(!valid){
        event.preventDefault();
        form.reportValidity();
        console.log(errors);
    }
}

form.addEventListener("submit", validateForm);