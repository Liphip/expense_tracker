class systemController {
    static uiController = new uiController();
}

class uiController {
    static expenseTracker = new ExpenseTracker();
    static addGuestController = new addGuestController(uiController.expenseTracker);


}

class guestUIController {
    addGuest_name = document.getElementById('addGuest-name');
    addGuest_error = document.getElementById('addGuest-error');

    constructor(expenseTracker) {
        this.expenseTracker = expenseTracker;
    }

    addGuest() {
        let name = this.addGuest_name.value;
        if (name == '') {
            this.#showError('Name cannot be empty');
            return;
        }
        if (this.expenseTracker.getGuestByName(name) != undefined) {
            this.#showError('Name already exists');
            return;
        }
        this.#hideError();
        this.expenseTracker.createGuest(null, name);
        this.addGuest_name.value = '';
    }

    #showError(message) {
        this.addGuest_error.innerHTML = message;
        this.addGuest_error.classList.remove('hidden');
    }

    #hideError() {
        this.addGuest_error.classList.add('hidden');
    }
}

