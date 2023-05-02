"use strcit";

import view from "../../view/pages/register.js";
import loadView from "../utils/loadView.js";

const Register = loadView(view);
Register.after_render = async () => {
    document.getElementById('register-submit-btn')?.addEventListener('click', () => {
        const email = document.getElementById('email-input');
        const pass = document.getElementById('pass-input');
        const repeatPass = document.getElementById('repeat-pass-input');
        if (pass.value !== repeatPass.value) {
            alert('Passwords do not match');
        } else if (email.value === '' || pass.value === '' || repeatPass.value === '') {
            alert('Please fill all the fields');
        } else {
            alert(`User with email ${email.value} was successfully submitted`);
        }
    });
}

export default Register;