if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
} else {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
}

function toggleExpenseTagsDropdown(toggle = undefined) {
    let isHidden = document.getElementById('addExpense-tags').classList.contains('hidden');
    if (toggle === undefined) {
        document.getElementById('addExpense-tags').classList.toggle('hidden');
        if (isHidden) {
            document.getElementById('addExpense-tags').focus();
            toggleExpenseGuestsDropdown(false);
        }
        return false;
    }
    if (toggle) {
        document.getElementById('addExpense-tags').classList.remove('hidden');

        document.getElementById('addExpense-tags').focus();
        toggleExpenseGuestsDropdown(false);
        return false;
    }
    document.getElementById('addExpense-tags').classList.add('hidden');
    return false;
}

function toggleExpenseGuestsDropdown(toggle = undefined) {
    let isHidden = document.getElementById('addExpense-guests').classList.contains('hidden');
    if (toggle === undefined) {
        document.getElementById('addExpense-guests').classList.toggle('hidden');
        if (isHidden) {
            document.getElementById('addExpense-guests').focus();
            toggleExpenseTagsDropdown(false);
        }
        return false;
    }
    if (toggle) {
        document.getElementById('addExpense-guests').classList.remove('hidden');
        document.getElementById('addExpense-guests').focus();
        toggleExpenseTagsDropdown(false);
        return false;
    }
    document.getElementById('addExpense-guests').classList.add('hidden');
    return false;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    return false;
}

function addGuest() {
    function displayError(message) {
        document.getElementById('addGuest-error').innerHTML = message;
        document.getElementById('addGuest-error').classList.remove('hidden');
    }
    let name = document.getElementById('addGuest-name').value;
    if (name === '') {
        displayError('Please enter a name');
        return false;
    } else if (ExpenseTracker.getGuestByName(name) !== undefined) {
        displayError('Name already exists');
        return false;
    } else {
        document.getElementById('addGuest-error').classList.add('hidden');
    }
    ExpenseTracker.createGuest(null, name);
    document.getElementById('addGuest-name').value = '';
    updateApp();
    return false;
}

function removeGuest(id = undefined, name = undefined) {
    if (id === undefined && name === undefined) return false;
    if (id === undefined) id = ExpenseTracker.getGuestByName(name).id;
    ExpenseTracker.deleteGuest(id);
    console.log(ExpenseTracker.format());
    updateApp();
    return false;
}

function addTag() {
    function displayError(message) {
        document.getElementById('addTag-error').innerHTML = message;
        document.getElementById('addTag-error').classList.remove('hidden');
    }

    let name = document.getElementById('addTag-name').value;
    if (name === '') {
        displayError('Please enter a name');
        return false;
    } else if (ExpenseTracker.getTagByName(name) !== undefined) {
        displayError('Name already exists');
        return false;
    } else {
        document.getElementById('addTag-error').classList.add('hidden');
    }
    ExpenseTracker.createTag(null, name);
    document.getElementById('addTag-name').value = '';
    updateApp();
    return false;
}

function removeTag(id = undefined, name = undefined) {
    if (id === undefined && name === undefined) return false;
    if (id === undefined) id = ExpenseTracker.getTagByName(name).id;
    ExpenseTracker.deleteTag(id);
    console.log(ExpenseTracker.format());
    updateApp();
    return false;
}

function addExpense() {
    function displayError(message) {
        document.getElementById('addExpense-error').innerHTML = message;
        document.getElementById('addExpense-error').classList.remove('hidden');
    }
    let name = document.getElementById('addExpense-name').value;
    let amount = Math.abs(Number(document.getElementById('addExpense-amount').value));
    let issuer = undefined;
    for (let element of document.getElementsByClassName('addExpense-issuer')) {
        if (element.checked) issuer = element.value;
        break;
    }
    let tag = undefined;
    for (let element of document.getElementsByClassName('addExpense-tags')) {
        if (element.checked) tag = element.value;
        break;
    }
    if (name === '') {
        displayError('Please enter a name');
        return false;
    } else if (amount === '' || isNaN(amount)) {
        displayError('Please enter a valid amount');
        return false;
    } else if (issuer === undefined) {
        displayError('Please select an issuer');
        return false;
    } else if (!ExpenseTracker.getGuest(issuer)) {
        displayError('Issuer does not exist');
        return false;
    } else if (tag === undefined) {
        displayError('Please select at least one tag');
        return false;
    } else if (!ExpenseTracker.getTag(tag)) {
        displayError('Tag does not exist');
        return false;
    } else {
        document.getElementById('addExpense-error').classList.add('hidden');
    }
    ExpenseTracker.createExpense(null, name, amount, issuer, tag);
    document.getElementById('addExpense-name').value = '';
    document.getElementById('addExpense-amount').value = '';
    Array(document.getElementsByClassName('addExpense-issuer')).forEach(e => e[0].checked = false);
    Array(document.getElementsByClassName('addExpense-tags')).forEach(e => e[0].checked = false);
    updateApp();
    return false;
}

function removeExpense(id = undefined, name = undefined) {
    if (id === undefined && name === undefined) return false;
    if (id === undefined) id = ExpenseTracker.getExpenseByName(name).id;
    ExpenseTracker.deleteExpense(id);
    console.log(ExpenseTracker.format());
    updateApp();
    return false;
}

function updateApp() {
    updateOverview();
    updateGuestsDropdown();
    updateTagsDropdown();
    updateGuestsTable();
    updateTagsTable();
    updateExpensesTable();
    updateTransactionsTable();
}

function updateOverview() {
    let totalExpenses = Number(ExpenseTracker.totalExpenses).toFixed(2);
    let averageExpenses = Number((ExpenseTracker.totalExpenses / ExpenseTracker.totalGuests)).toFixed(2);
    document.getElementById('totalExpensesOverview').innerText = `${totalExpenses}$`;
    document.getElementById('averagePerGuestOverview').innerText = `${averageExpenses}$`;
}

function updateGuestsDropdown() {
    const guestsDropdownEntry = (guest) => `
        <label for="addExpense-${guest.id}" class="dropdown-item">
            <input type="radio" name="addExpense-guest" id="addExpense-${guest.id}" value="${guest.id}" class="addExpense-issuer">
            ${guest.name}
        </label>
        `;
    const noGuestsDropdownEntry = () => `
        <label for="addExpense-noGuests" class="dropdown-item forbidden">
            <input type="radio" id="addExpense-noGuests" disabled value="noGuest" class="addExpense-issuer">
            No Guests added
        </label>
        `;
    let guests = ExpenseTracker.allGuests;
    let guestList = document.getElementById('addExpense-guests');
    guestList.innerHTML = guests.length === 0 ?
        noGuestsDropdownEntry() :
        guests.map(guestsDropdownEntry).join('');
}

function updateTagsDropdown() {
    const tagsDropdownEntry = (tag) => `
        <label for="addExpense-${tag.id}" class="dropdown-item">
            <input type="checkbox" name="addExpense-tag" id="addExpense-${tag.id}" value="${tag.id}" class="addExpense-tags">
            ${tag.name}
        </label>
        `;
    const noTagsDropdownEntry = () => `
        <label for="addExpense-noTag" class="dropdown-item forbidden">
            <input type="checkbox" id="addExpense-noTag" disabled value="noTag" class="addExpense-tags">
            No Tags added
        </label>
        `;
    let tags = ExpenseTracker.allTags;
    let tagList = document.getElementById('addExpense-tags');
    tagList.innerHTML = tags.length === 0 ?
        noTagsDropdownEntry() :
        tags.map(tagsDropdownEntry).join('');
}

function updateGuestsTable() {
    const guestsTableEntry = (guest) => `
            <tr>
                <td>${guest.name}</td>
                <td>
                    ${guest.tags.length === 0 ? 'None' :
            guest.tags.map(tag => `<span>${tag.name}</span>`).join('')}
                </td>
                <td>
                    ${guest.issuedExpenses.length === 0 ? 'None' :
            guest.issuedExpenses.map(expense => `<span>${expense.name}</span>`).join('')}
                </td>
                <td>
                    <button onclick="return removeGuest('${guest.id}');">Delete</button>
                </td>
            </tr>
            `;
    let guests = ExpenseTracker.allGuests;
    let guestList = document.getElementById('guests-table');
    guestList.innerHTML = guests.length === 0 ?
        '<tr><td colspan="4">No guests</td></tr>' :
        guests.map(guestsTableEntry).join('');
}

function updateTagsTable() {
    const tagsTableEntry = (tag) => `
            <tr>
                <td>${tag.name}</td>
                <td>
                    ${tag.guests.length === 0 ? 'None' :
            tag.guests.map(guest => `<span>${guest.name}</span>`).join('')}
                </td>
                <td>
                    ${tag.expenses.length === 0 ? 'None' :
            tag.expenses.map(expense => `<span>${expense.name}</span>`).join('')}
                </td>
                <td>
                    <button onclick="return removeTag('${tag.id}');">Delete</button>
                </td>
            </tr>
            `;
    let tags = ExpenseTracker.allTags;
    let tagList = document.getElementById('tags-table');
    tagList.innerHTML = tags.length === 0 ?
        '<tr><td colspan="3">No tags</td></tr>' :
        tags.map(tagsTableEntry).join('');
}

function updateExpensesTable() {
    const expensesTableEntry = (expense) => {
        return `
            <tr>
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td>${ExpenseTracker.getGuest(expense.issuer).name}</td>
                <td>${ExpenseTracker.getTag(expense.tag).name}</td>
                <td>
                    <button onclick="return removeExpense('${expense.id}');">Delete</button>
                </td>
            </tr>
            `;
    }
    let expenses = ExpenseTracker.allExpenses;
    let expenseList = document.getElementById('expenses-table');
    expenseList.innerHTML = expenses.length === 0 ?
        '<tr><td colspan="5">No expenses</td></tr>' :
        expenses.map(expensesTableEntry).join('');
}

function updateTransactionsTable() {
    let transactions = ExpenseTracker.clauclateBestDebtDistribution();
    let transactionTable = document.getElementById('transactions-table');
    let transactionsEmpty = Object.values(transactions).every(value => value.length === 0);
    transactionTable.innerHTML = transactionsEmpty ?
        '<tr><td colspan="3">No transactions</td></tr>' :
        Object.keys(transactions).map(key => {
            for (let transaction of transactions[key]) {
                return `
                    <tr>
                        <td>${key}</td>
                        <td>${transaction[0]}</td>
                        <td>${transaction[1]}</td>
                    </tr>
                    `;
            }
        }).join('');
}