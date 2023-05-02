const view = /*html*/ `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item" href="#/">
                    <img class="logo" src="https://avatars.githubusercontent.com/u/57034143?v=4" width="28" height="28">
                </a>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
        
            <div id="navbarBasicExample" class="navbar-menu is-active" aria-expanded="false">
                <div class="navbar-start">
                    <a class="navbar-item" href="/#/">
                        Home
                    </a>
                </div>
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <a class="button is-primary" href="/#/register">
                                <strong>Sign up</strong>
                            </a> 
                            <a class="button is-light" href="/#/login">
                                Log in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
`;

export default view;