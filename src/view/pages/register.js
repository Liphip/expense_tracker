const view = /*html*/`
    <title>Register</title>
    <section class="section">
        <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" id="email-input" type="email" placeholder="Enter your Email">
                    <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right">
                        <i class="fas fa-check"></i>
                    </span>
            </p>
        </div>
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" id="pass-input" type="password" placeholder="Enter a Password">
                    <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                    </span>
            </p>
        </div>
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" id="repeat-pass-input" type="password" placeholder="Enter the same Password again">
                    <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                    </span>
            </p>
        </div>
        <div class="field">
            <p class="control">
                <button class="button is-primary" id="register-submit-btn">
                    Register
                </button>
            </p>
        </div>

    </section>
`;

export default view;