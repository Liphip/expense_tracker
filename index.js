if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.body.classList.add("dark");
  document.body.classList.remove("light");
} else {
  document.body.classList.remove("dark");
  document.body.classList.add("light");
}

// Load settings from localStorage
function loadSettings() {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
}

// Save settings to localStorage
function saveSettings() {
  const isDarkMode = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDarkMode);
}

// Save ExpenseTracker state to localStorage
function saveExpenseTrackerState() {
  const state = ExpenseTracker.encode();
  localStorage.setItem("expenseTrackerState", state);
}

// Load ExpenseTracker state from localStorage
function loadExpenseTrackerState() {
  const state = localStorage.getItem("expenseTrackerState");
  if (state) {
    ExpenseTracker.decode(state);
  }
}

function toggleExpenseTagsDropdown(toggle = undefined) {
  let isHidden = document
    .getElementById("addExpense-tags")
    .classList.contains("hidden");
  if (toggle === undefined) {
    document.getElementById("addExpense-tags").classList.toggle("hidden");
    if (isHidden) {
      document.getElementById("addExpense-tags").focus();
      toggleExpenseGuestsDropdown(false);
    }
    return false;
  }
  if (toggle) {
    document.getElementById("addExpense-tags").classList.remove("hidden");

    document.getElementById("addExpense-tags").focus();
    toggleExpenseGuestsDropdown(false);
    return false;
  }
  document.getElementById("addExpense-tags").classList.add("hidden");
  return false;
}

function toggleExpenseGuestsDropdown(toggle = undefined) {
  let isHidden = document
    .getElementById("addExpense-guests")
    .classList.contains("hidden");
  if (toggle === undefined) {
    document.getElementById("addExpense-guests").classList.toggle("hidden");
    if (isHidden) {
      document.getElementById("addExpense-guests").focus();
      toggleExpenseTagsDropdown(false);
    }
    return false;
  }
  if (toggle) {
    document.getElementById("addExpense-guests").classList.remove("hidden");
    document.getElementById("addExpense-guests").focus();
    toggleExpenseTagsDropdown(false);
    return false;
  }
  document.getElementById("addExpense-guests").classList.add("hidden");
  return false;
}

// Modify toggleDarkMode to save settings
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  saveSettings();
  return false;
}

function addGuest() {
  function displayError(message) {
    document.getElementById("addGuest-error").innerHTML = message;
    document.getElementById("addGuest-error").classList.remove("hidden");
  }
  let name = document.getElementById("addGuest-name").value;
  if (name === "") {
    displayError("Please enter a name");
    return false;
  } else if (ExpenseTracker.getGuestByName(name) !== undefined) {
    displayError("Name already exists");
    return false;
  } else {
    document.getElementById("addGuest-error").classList.add("hidden");
  }
  ExpenseTracker.createGuest(null, name);
  document.getElementById("addGuest-name").value = "";
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function removeGuest(id = undefined, name = undefined) {
  if (id === undefined && name === undefined) return false;
  if (id === undefined) id = ExpenseTracker.getGuestByName(name).id;
  ExpenseTracker.deleteGuest(id);
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function addTag() {
  function displayError(message) {
    document.getElementById("addTag-error").innerHTML = message;
    document.getElementById("addTag-error").classList.remove("hidden");
  }

  let name = document.getElementById("addTag-name").value;
  if (name === "") {
    displayError("Please enter a name");
    return false;
  } else if (ExpenseTracker.getTagByName(name) !== undefined) {
    displayError("Name already exists");
    return false;
  } else {
    document.getElementById("addTag-error").classList.add("hidden");
  }
  ExpenseTracker.createTag(null, name);
  document.getElementById("addTag-name").value = "";
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function removeTag(id = undefined, name = undefined) {
  if (id === undefined && name === undefined) return false;
  if (id === undefined) id = ExpenseTracker.getTagByName(name).id;
  ExpenseTracker.deleteTag(id);
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function addExpense() {
  function displayError(message) {
    document.getElementById("addExpense-error").innerHTML = message;
    document.getElementById("addExpense-error").classList.remove("hidden");
  }
  let name = document.getElementById("addExpense-name").value;
  let amount = Math.abs(
    Number(document.getElementById("addExpense-amount").value)
  );
  let issuer = undefined;
  for (let element of document.getElementsByClassName("addExpense-issuer")) {
    if (element.checked) {
      issuer = element.value;
      break;
    }
  }
  let tags = [];
  for (let element of document.getElementsByClassName("addExpense-tags")) {
    if (element.checked) tags.push(element.value);
  }
  if (name === "") {
    displayError("Please enter a name");
    return false;
  } else if (amount === "" || isNaN(amount)) {
    displayError("Please enter a valid amount");
    return false;
  } else if (issuer === undefined) {
    displayError("Please select an issuer");
    return false;
  } else if (!ExpenseTracker.getGuest(issuer)) {
    displayError("Issuer does not exist");
    return false;
  } else if (tags.length === 0) {
    displayError("Please select at least one tag");
    return false;
  } else if (tags.some((tag) => !ExpenseTracker.getTag(tag))) {
    displayError("Tag does not exist");
    return false;
  } else {
    document.getElementById("addExpense-error").classList.add("hidden");
  }
  ExpenseTracker.createExpense(null, name, amount, issuer, tags);
  document.getElementById("addExpense-name").value = "";
  document.getElementById("addExpense-amount").value = "";
  Array(document.getElementsByClassName("addExpense-issuer")).forEach(
    (e) => (e[0].checked = false)
  );
  Array(document.getElementsByClassName("addExpense-tags")).forEach(
    (e) => (e[0].checked = false)
  );
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function removeExpense(id = undefined, name = undefined) {
  if (id === undefined && name === undefined) return false;
  if (id === undefined) id = ExpenseTracker.getExpenseByName(name).id;
  ExpenseTracker.deleteExpense(id);
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function addGuestTag(guestId, tagId) {
  if (!guestId || !tagId) return false;
  ExpenseTracker.addGuestTagAssociation(guestId, tagId);
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function removeGuestTag(guestId, tagId) {
  if (!guestId || !tagId) return false;
  ExpenseTracker.removeGuestTagAssociation(guestId, tagId);
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function updateApp() {
  updateOverview();
  updateGuestsDropdown();
  updateTagsDropdown();
  updateGuestTagAssociationsTable();
  updateGuestsTable();
  updateTagsTable();
  updateExpensesTable();
  updateTransactionsTable();
}

function updateOverview() {
  let totalExpenses = Number(ExpenseTracker.totalExpenses).toFixed(2);
  totalExpenses = totalExpenses === "NaN" ? "0.00" : totalExpenses;
  let averageGuestExpenses = Number(
    ExpenseTracker.totalExpenses / ExpenseTracker.totalGuests
  ).toFixed(2);
  averageGuestExpenses =
    averageGuestExpenses === "NaN" ? "0.00" : averageGuestExpenses;
  let averageTagExpenses = Number(
    ExpenseTracker.totalExpenses / ExpenseTracker.totalTags
  ).toFixed(2);
  averageTagExpenses =
    averageTagExpenses === "NaN" ? "0.00" : averageTagExpenses;
  document.getElementById(
    "totalExpensesOverview"
  ).innerText = `${totalExpenses}$`;
  document.getElementById(
    "averagePerGuestOverview"
  ).innerText = `${averageGuestExpenses}$`;
  document.getElementById(
    "averagePerTagOverview"
  ).innerText = `${averageTagExpenses}$`;
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
  let guestList = document.getElementById("addExpense-guests");
  guestList.innerHTML =
    guests.length === 0
      ? noGuestsDropdownEntry()
      : guests.map(guestsDropdownEntry).join("");
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
  let tagList = document.getElementById("addExpense-tags");
  tagList.innerHTML =
    tags.length === 0
      ? noTagsDropdownEntry()
      : tags.map(tagsDropdownEntry).join("");
}

function updateGuestTagAssociationsTable() {
  const guestTagAssociationHeader = (tags) => `
        <tr>
            <th>
                <span>Tag</span>
                <span>Guest</span>
            </th>
            ${tags.map((tag) => `<th>${tag.name}</th>`).join("")}
        </tr>
        `;

  const guestTagAssociationEntry = (guest, tags) => `
    <tr>
        <td>${guest.name}</td>
        ${tags
          .map(
            (tag) => `
                <td>
                    <input type="checkbox" id="addGuestTag-${guest.id}-${
              tag.id
            }" ${
              guest.tags.includes(tag.id) ? "checked" : ""
            } onchange="return ${
              guest.tags.includes(tag.id) ? "removeGuestTag" : "addGuestTag"
            }('${guest.id}', '${tag.id}')">
                </td>
                `
          )
          .join("")}
    </tr>
    `;
  let tags = ExpenseTracker.allTags;
  let guests = ExpenseTracker.allGuests;
  let guestTagAssociationsTable = document.getElementById(
    "tagGuestAssociation-table"
  );
  guestTagAssociationsTable.innerHTML =
    guests.length === 0 || tags.length === 0
      ? '<tr><td colspan="1">Add at least one guest and one tag</td></tr>'
      : guestTagAssociationHeader(tags) +
        guests.map((guest) => guestTagAssociationEntry(guest, tags)).join("");
}

function updateGuestsTable() {
  const guestsTableEntry = (guest) => `
            <tr>
                <td>${guest.name}</td>
                <td>
                    ${
                      guest.tags.length === 0
                        ? "None"
                        : guest.tags
                            .map(
                              (tag) =>
                                `<span>${
                                  ExpenseTracker.getTag(tag)?.name
                                }</span>`
                            )
                            .join(", ")
                    }
                </td>
                <td>
                    ${
                      guest.issuedExpenses.length === 0
                        ? "None"
                        : guest.issuedExpenses
                            .map(
                              (expense) =>
                                `<span>${
                                  ExpenseTracker.getExpense(expense)?.name
                                }</span>`
                            )
                            .join(", ")
                    }
                </td>
                <td>
                    ${Number(
                      guest.issuedExpenses.length === 0
                        ? 0
                        : guest.issuedExpenses.reduce(
                            (acc, curr) =>
                              acc + ExpenseTracker.getExpense(curr).amount,
                            0
                          )
                    ).toFixed(2)}$
                </td>
                <td>
                    <button onclick="return removeGuest('${
                      guest.id
                    }');">Delete</button>
                </td>
            </tr>
            `;
  let guests = ExpenseTracker.allGuests;
  let guestList = document.getElementById("guests-table");
  guestList.innerHTML =
    guests.length === 0
      ? '<tr><td colspan="5">No guests</td></tr>'
      : guests.map(guestsTableEntry).join("");
}

function updateTagsTable() {
  const tagsTableEntry = (tag) => `
            <tr>
                <td>${tag.name}</td>
                <td>
                    ${
                      tag.guests.length === 0
                        ? "None"
                        : tag.guests
                            .map(
                              (guest) =>
                                `<span>${
                                  ExpenseTracker.getGuest(guest)?.name
                                }</span>`
                            )
                            .join(", ")
                    }
                </td>
                <td>
                    ${
                      tag.expenses.length === 0
                        ? "None"
                        : tag.expenses
                            .map(
                              (expense) =>
                                `<span>${
                                  ExpenseTracker.getExpense(expense)?.name
                                }</span>`
                            )
                            .join(", ")
                    }
                </td>
                <td>
                    ${Number(
                      tag.expenses.length === 0
                        ? 0
                        : tag.expenses.reduce(
                            (acc, curr) =>
                              acc + ExpenseTracker.getExpense(curr).amount,
                            0
                          )
                    ).toFixed(2)}$
                </td>
                <td>
                    <button onclick="return removeTag('${
                      tag.id
                    }');">Delete</button>
                </td>
            </tr>
            `;
  let tags = ExpenseTracker.allTags;
  let tagList = document.getElementById("tags-table");
  tagList.innerHTML =
    tags.length === 0
      ? '<tr><td colspan="5">No tags</td></tr>'
      : tags.map(tagsTableEntry).join("");
}

function updateExpensesTable() {
  const expensesTableEntry = (expense) => {
    return `
            <tr>
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td>${ExpenseTracker.getGuest(expense.issuer)?.name}</td>
                <td>${
                  expense.tags.length === 0
                    ? "None"
                    : expense.tags
                        .map(
                          (tag) =>
                            `<span>${ExpenseTracker.getTag(tag)?.name}</span>`
                        )
                        .join(", ")
                }</td>
                <td>
                    <button onclick="return removeExpense('${
                      expense.id
                    }');">Delete</button>
                </td>
            </tr>
            `;
  };
  let expenses = ExpenseTracker.allExpenses;
  let expenseList = document.getElementById("expenses-table");
  expenseList.innerHTML =
    expenses.length === 0
      ? '<tr><td colspan="5">No expenses</td></tr>'
      : expenses.map(expensesTableEntry).join("");
}

function updateTransactionsTable() {
  let transactions = ExpenseTracker.clauclateBestDebtDistribution();
  let transactionTable = document.getElementById("transactions-table");
  let transactionsEmpty = Object.values(transactions).every(
    (value) => value.length === 0
  );
  transactionTable.innerHTML = transactionsEmpty
    ? '<tr><td colspan="3">No transactions</td></tr>'
    : Object.keys(transactions)
        .map((key) => {
          for (let transaction of transactions[key]) {
            return `
                    <tr>
                        <td>${ExpenseTracker.getGuest(key).name}</td>
                        <td>${ExpenseTracker.getGuest(transaction[0]).name}</td>
                        <td>${transaction[1].toFixed(2)}$</td>
                    </tr>
                    `;
          }
        })
        .join("");
}

function clearAll() {
  clearExpenses(true);
  clearTags(true);
  clearGuests(true);
  updateApp();
  saveExpenseTrackerState();
  return false;
}

function clearTags(clearAll = false) {
  let tags = ExpenseTracker.allTags;
  for (let tag of tags) ExpenseTracker.deleteTag(tag.id);
  if (!clearAll) {
    updateApp();
    saveExpenseTrackerState();
  }
  return false;
}

function clearGuests(clearAll = false) {
  let guests = ExpenseTracker.allGuests;
  for (let guest of guests) ExpenseTracker.deleteGuest(guest.id);
  if (!clearAll) {
    updateApp();
    saveExpenseTrackerState();
  }
  return false;
}

function clearExpenses(clearAll = false) {
  let expenses = ExpenseTracker.allExpenses;
  for (let expense of expenses) ExpenseTracker.deleteExpense(expense.id);
  if (!clearAll) {
    updateApp();
    saveExpenseTrackerState();
  }
  return false;
}

function downloadJSON() {
  const state = ExpenseTracker.encode();
  const blob = new Blob([state], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expense_tracker_state.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return false;
}

function handleFileSelect(event) {
  event.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const state = e.target.result;
      ExpenseTracker.decode(state);
      updateApp();
      saveExpenseTrackerState();
    };
    reader.readAsText(file);
  }
}

function downloadTransactions() {
  const transactions = ExpenseTracker.clauclateBestDebtDistribution();
  let csvContent = "data:text/csv;charset=utf-8,From,To,Amount\n";

  Object.keys(transactions).forEach((fromGuestId) => {
    transactions[fromGuestId].forEach((transaction) => {
      const toGuestId = transaction[0];
      const amount = transaction[1].toFixed(2);
      const fromGuestName = ExpenseTracker.getGuest(fromGuestId).name;
      const toGuestName = ExpenseTracker.getGuest(toGuestId).name;
      csvContent += `${fromGuestName},${toGuestName},${amount}\n`;
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return false;
}

function downloadTransactionsGraph() {
  const svgContent = ExpenseTracker.transactionsGraphSVG;
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions_graph.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return false;
}

document.addEventListener("click", function (event) {
  const tagsDropdown = document.getElementById("addExpense-tags");
  const guestsDropdown = document.getElementById("addExpense-guests");

  if (
    !tagsDropdown.contains(event.target) &&
    !event.target.matches(".input-button")
  ) {
    tagsDropdown.classList.add("hidden");
  }

  if (
    !guestsDropdown.contains(event.target) &&
    !event.target.matches(".input-button")
  ) {
    guestsDropdown.classList.add("hidden");
  }
});

// Call loadSettings and loadExpenseTrackerState on page load
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  loadExpenseTrackerState();
  updateApp();
});
