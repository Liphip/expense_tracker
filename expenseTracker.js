MAX_ITERATIONS = 1000;
MAX_ENTITIES = 1000000;

function round2Decimals(number) {
  return Number(Number(number).toFixed(2));
}

class ExpenseTracker {
  static tags = {};
  static expenses = {};
  static guests = {};

  static get allTags() {
    return Object.values(ExpenseTracker.tags);
  }

  static get totalTags() {
    return ExpenseTracker.allTags.length;
  }

  static get expensesPerTag() {
    return ExpenseTracker.allTags.map((tag) => tag.totalExpenses);
  }

  static get all() {
    return {
      tags: ExpenseTracker.allTags,
      expenses: ExpenseTracker.allExpenses,
      guests: ExpenseTracker.allGuests,
    };
  }

  static encode() {
    return JSON.stringify(ExpenseTracker.format());
  }

  static decode(data) {
    const { tags, expenses, guests } = JSON.parse(data);
    for (let tag of Object.values(tags)) {
      ExpenseTracker.createTag(tag.id, tag.name);
    }
    for (let guest of Object.values(guests)) {
      ExpenseTracker.createGuest(guest.id, guest.name, guest.tags);
    }
    for (let expense of Object.values(expenses)) {
      ExpenseTracker.createExpense(
        expense.id,
        expense.name,
        expense.amount,
        expense.issuer,
        expense.tags
      );
    }
  }

  static get transactionsCSV() {
    const transactions = ExpenseTracker.clauclateBestDebtDistribution();
    let csv = "From,To,Amount\n";
    for (let fromGuestID of Object.keys(transactions)) {
      for (let transaction of transactions[fromGuestID]) {
        csv += `${ExpenseTracker.getGuest(fromGuestID).name},${
          ExpenseTracker.getGuest(transaction[0]).name
        },${transaction[1]}\n`;
      }
    }
    return csv;
  }

  static get transactionsGraphSVG() {
    const transactions = ExpenseTracker.clauclateBestDebtDistribution();
    const debts = ExpenseTracker.claculateDebts();
    const guests = ExpenseTracker.allGuests;
    const guestNames = guests.map((guest) => guest.name);
    const guestDebts = guests.map((guest) => debts[guest.id]);
    const guestTransactions = guests.map((guest) => {
      const transactionsTo = transactions[guest.id].map((transaction) => {
        return { to: transaction[0], amount: transaction[1] };
      });
      return { name: guest.name, transactions: transactionsTo };
    });

    const svg = `
    <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="1000" height="1000" fill="white"/>
      <text x="500" y="50" font-size="30" text-anchor="middle">Debts</text>
      <text x="50" y="500" font-size="30" transform="rotate(270 50,500)" text-anchor="middle">Guests</text>
      <text x="50" y="50" font-size="20">0</text>
      <text x="50" y="950" font-size="20">${Math.max(...guestDebts)}</text>
      <text x="950" y="50" font-size="20">0</text>
      <text x="950" y="950" font-size="20">${Math.max(...guestDebts)}</text>
      ${guestNames
        .map((name, i) => {
          return `<text x="50" y="${
            100 + i * 50
          }" font-size="20">${name}</text>`;
        })
        .join("\n")}
      ${guestNames
        .map((name, i) => {
          return `<text x="950" y="${
            100 + i * 50
          }" font-size="20">${name}</text>`;
        })
        .join("\n")}
      ${guestDebts
        .map((debt, i) => {
          return `<rect x="100" y="${100 + i * 50}" width="${
            debt * 10
          }" height="20" fill="red"/>`;
        })
        .join("\n")}
      ${guestTransactions
        .map((guest, i) => {
          return guest.transactions
            .map((transaction) => {
              const toIndex = guestNames.indexOf(
                ExpenseTracker.getGuest(transaction.to).name
              );
              return `<line x1="100" y1="${110 + i * 50}" x2="900" y2="${
                110 + toIndex * 50
              }" stroke="black" stroke-width="2"/>`;
            })
            .join("\n");
        })
        .join("\n")}
    </svg>`;
    return svg;
  }

  static toString() {
    return `ExpenseTracker: ${ExpenseTracker.totalTags} tags, ${ExpenseTracker.totalExpenses} expenses, ${ExpenseTracker.totalGuests} guests`;
  }

  static getTag(id) {
    return ExpenseTracker.tags[id];
  }

  static getTagByName(name) {
    for (let tag of ExpenseTracker.allTags) {
      if (tag.name === name) return tag;
    }
  }

  static get allExpenses() {
    return Object.values(ExpenseTracker.expenses);
  }

  static get totalExpenses() {
    return ExpenseTracker.allExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }

  static getExpense(id) {
    return ExpenseTracker.expenses[id];
  }

  static getExpenseByName(name) {
    for (let expense of ExpenseTracker.allExpenses) {
      if (expense.name === name) return expense;
    }
  }

  static get allGuests() {
    return Object.values(ExpenseTracker.guests);
  }

  static get totalGuests() {
    return ExpenseTracker.allGuests.length;
  }

  static get expensesPerGuest() {
    return ExpenseTracker.allGuests.map((guest) => guest.totalIssuedExpenses);
  }

  static getGuest(id) {
    return ExpenseTracker.guests[id];
  }

  static getGuestByName(name) {
    for (let guest of ExpenseTracker.allGuests) {
      if (guest.name === name) return guest;
    }
  }

  static get totalExpenses() {
    return ExpenseTracker.allExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }

  static createID(classType) {
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const id = classType + "_" + Math.round(Math.random() * MAX_ENTITIES);
      if (!ExpenseTracker[classType][id]) return id;
    }
    throw new Error("Could not generate ID");
  }

  static getOrCreateTag(
    id = null,
    name = null,
    expenseIDs = [],
    guestIDs = []
  ) {
    if (id !== null) {
      const tag = ExpenseTracker.getTag(id);
      if (tag) return tag;
      if (name === null)
        throw new Error("Tag does not exist and no name was provided");
      return ExpenseTracker.createTag(id, name, expenseIDs, guestIDs);
    }
    if (name === null) throw new Error("No name or ID was provided");
    const tag = ExpenseTracker.allTags.find((tag) => tag.name === name);
    if (tag) return tag;
    return ExpenseTracker.createTag(null, name, expenseIDs, guestIDs);
  }

  static createTag(id = null, name, expenseIDs = [], guestIDs = []) {
    if (ExpenseTracker.getTagByName(name))
      throw new Error("Tag already exists");
    const tag = new Tag(id, name, (expenseIDs = []), (guestIDs = []));
    this.tags[tag.id] = tag;
    return tag;
  }

  static deleteTag(id) {
    const tag = ExpenseTracker.getTag(id);
    if (!tag) {
      console.warn(`Tag ${id} not found`);
      return;
    }
    tag.removeSelf();
  }

  static getOrCreateGuest(
    id = null,
    name = null,
    tagIDs = [],
    issuedExpenseIDs = []
  ) {
    if (id !== null) {
      const guest = ExpenseTracker.getGuest(id);
      if (guest) return guest;
      if (name === null)
        throw new Error("Guest does not exist and no name was provided");
      return ExpenseTracker.createGuest(id, name, tagIDs, issuedExpenseIDs);
    }
    if (name === null) throw new Error("No name or ID was provided");
    const guest = ExpenseTracker.allGuests.find((guest) => guest.name === name);
    if (guest) return guest;
    return ExpenseTracker.createGuest(null, name, tagIDs, issuedExpenseIDs);
  }

  static createGuest(id = null, name, tagIDs = [], issuedExpenseIDs = []) {
    if (ExpenseTracker.getGuestByName(name))
      throw new Error("Guest already exists");
    const guest = new Guest(id, name, tagIDs, issuedExpenseIDs);
    this.guests[guest.id] = guest;
    return guest;
  }

  static deleteGuest(id) {
    const guest = ExpenseTracker.getGuest(id);
    if (!guest) {
      console.warn(`Guest ${id} not found`);
      return;
    }
    guest.removeSelf();
  }

  static getOrCreateExpense(id = null, name = null, amount, issuerID, tagID) {
    if (id !== null) {
      const expense = ExpenseTracker.getExpense(id);
      if (expense) return expense;
      if (name === null)
        throw new Error("Expense does not exist and no name was provided");
      return ExpenseTracker.createExpense(id, name, amount, issuerID, tagID);
    }
    if (name === null) throw new Error("No name or ID was provided");
    const expense = ExpenseTracker.allExpenses.find(
      (expense) => expense.name === name
    );
    if (expense) return expense;
    return ExpenseTracker.createExpense(null, name, amount, issuerID, tagID);
  }

  static createExpense(id = null, name, amount, issuerID, tagIDs) {
    if (ExpenseTracker.getExpenseByName(name))
      throw new Error("Expense already exists");
    const expense = new Expense(id, name, amount, issuerID, tagIDs);
    this.expenses[expense.id] = expense;
    return expense;
  }

  static deleteExpense(id) {
    const expense = ExpenseTracker.getExpense(id);
    if (!expense) {
      console.warn(`Expense ${id} not found`);
      return;
    }
    expense.removeSelf();
  }

  static addGuestTagAssociation(guestID, tagID) {
    const guest = ExpenseTracker.getGuest(guestID);
    if (!guest) throw new Error("Guest not found");
    const tag = ExpenseTracker.getTag(tagID);
    if (!tag) throw new Error("Tag not found");
    guest.addTag(tagID);
    tag.addGuest(guestID);
  }

  static removeGuestTagAssociation(guestID, tagID) {
    const guest = ExpenseTracker.getGuest(guestID);
    if (!guest) throw new Error("Guest not found");
    const tag = ExpenseTracker.getTag(tagID);
    if (!tag) throw new Error("Tag not found");
    guest.removeTag(tagID);
    tag.removeGuest(guestID);
  }

  /**
   * Calculates the debts of each guest.
   *
   * The algorithm calculates the debts of each guest by subtracting the average expenses all tags the guest is in
   * from the total expenses of each guest.
   *
   * @returns {Object} An object containing the debts of each guest. The keys are the guest IDs and the values are
   * the debts.
   */
  static claculateDebts() {
    const debts = {};
    for (let guest of ExpenseTracker.allGuests) {
      debts[guest.id] = -guest.totalIssuedExpenses;
      for (let tagID of guest.tags) {
        debts[guest.id] += ExpenseTracker.getTag(tagID).perGuestExpenses;
      }
    }

    Object.keys(debts).forEach(
      (guestID) => (debts[guestID] = round2Decimals(debts[guestID]))
    );

    return debts;
  }

  /**
   * Clauclates the best debt distribution.
   *
   * The algorithm claculates the best debt distribution by minimizing the number of transactions.
   * A transaction is a payment from one guest to another.
   * The optimal result is a debt distribution where each guest has only one transaction to make.
   * Therefore a result where two guests make a transaction to one other guest, who then makes a
   * transaction to a fourth guest, is better than a result where two guests make a transaction to
   * a third guest but one of them has to make a second transaction to the fourth guest.
   *
   * @returns {Object} An object containing the best debt distribution. The keys are the guest IDs
   * and the values are arrays of the form [toGuestID, amount].
   */
  static clauclateBestDebtDistribution() {
    const debts = ExpenseTracker.claculateDebts();
    const transactions = {};
    for (let guest of ExpenseTracker.allGuests) {
      transactions[guest.id] = [];
    }

    for (let guest of ExpenseTracker.allGuests) {
      if (debts[guest.id] > 0) {
        const sortedDebts = Object.entries(debts).sort((a, b) => b[1] - a[1]);
        let i = 0;
        let amount = debts[guest.id];
        while (amount > 0 && i < sortedDebts.length) {
          if (sortedDebts[i][1] < 0 && sortedDebts[i][0] !== guest.id) {
            const transactionAmount = Math.min(amount, -sortedDebts[i][1]);
            transactions[guest.id].push([sortedDebts[i][0], transactionAmount]);
            amount -= transactionAmount;
          }
          i++;
        }
      }
    }

    return transactions;
  }

  /**
   * Clalculates the debt distribution after applying the given transactions.
   *
   * @param {Object} transactions An object containing the transactions to apply. The keys are the guest IDs
   * and the values are arrays of the form [toGuestID, amount].
   *
   * @returns {Object} An object containing the debt distribution after applying the given transactions.
   * The keys are the guest IDs and the values are the debts.
   */
  static calculateDebtDistribution(transactions) {
    const debts = ExpenseTracker.claculateDebts();
    for (let guest of Object.keys(transactions)) {
      for (let transaction of transactions[guest]) {
        debts[guest] -= transaction[1];
        debts[transaction[0]] += transaction[1];
      }
    }
    return debts;
  }

  static format() {
    return {
      tags: ExpenseTracker.tags,
      expenses: ExpenseTracker.expenses,
      guests: ExpenseTracker.guests,
    };
  }
}

class Guest {
  constructor(id, name, tagIDs = [], issuedExpenseIDs = []) {
    if (!id) id = ExpenseTracker.createID("guests");
    if (ExpenseTracker.guests[id]) throw new Error("ID already exists");
    if (!name) throw new Error("Name is required");
    if (!tagIDs) throw new Error("Tags are required");
    if (!issuedExpenseIDs) throw new Error("Expenses are required");

    for (let tagID of tagIDs) {
      let tag = ExpenseTracker.getOrCreateTag(tagID);
      tag.addGuest(id, true);
    }

    for (let expenseID of issuedExpenseIDs) {
      if (ExpenseTracker.expenses[expenseID])
        throw new Error("Expense already exists");
      let expense = ExpenseTracker.getOrCreateExpense(expenseID);
      expense.setIssuer(id, true);
    }

    this.id = id;
    this.name = name;
    this.ExpenseTracker = ExpenseTracker;
    this.tags = tagIDs;
    this.issuedExpenses = issuedExpenseIDs;
    return this;
  }

  toString() {
    return `${this.name}#${this.id}`;
  }

  removeSelf() {
    for (let tagID of this.tags) {
      ExpenseTracker.getTag(tagID)?.removeGuest(this.id);
    }
    for (let expenseID of this.issuedExpenses) {
      ExpenseTracker.getExpense(expenseID)?.setIssuer(null);
    }
    let guests = { ...ExpenseTracker.guests };
    delete guests[this.id];
    ExpenseTracker.guests = guests;
  }

  addTag(id, constructorCall = false) {
    if (this.tags.find((tagID) => tagID === id)) return this;
    this.tags.push(id);
    if (!constructorCall) ExpenseTracker.getOrCreateTag(id)?.addGuest(this.id);
    return this;
  }

  removeTag(id) {
    if (!this.tags.find((tagID) => tagID === id)) return this;
    this.tags = this.tags.filter((tagID) => tagID !== id);
    ExpenseTracker.getTag(id)?.removeGuest(this.id);
    return this;
  }

  addIssuedExpense(id, constructorCall = false) {
    if (this.issuedExpenses.find((expenseID) => expenseID === id)) return this;
    this.issuedExpenses.push(id);
    if (!constructorCall)
      ExpenseTracker.getOrCreateExpense(id)?.setIssuer(this.id);
    return this;
  }

  removeIssuedExpense(id) {
    this.issuedExpenses = this.issuedExpenses.filter(
      (expenseID) => expenseID !== id
    );
    ExpenseTracker.getExpense(id)?.setIssuer(null);
    return this;
  }

  get totalIssuedExpenses() {
    return this.issuedExpenses.reduce(
      (sum, expense) => sum + (ExpenseTracker.getExpense(expense)?.amount || 0),
      0
    );
  }
}

class Tag {
  constructor(id, name, expenseIDs = [], guestIDs = []) {
    if (!id) id = ExpenseTracker.createID("tags");
    if (ExpenseTracker.tags[id]) throw new Error("ID already exists");
    if (!name) throw new Error("Name is required");
    if (!expenseIDs) throw new Error("Expenses are required");
    if (!guestIDs) throw new Error("Guests are required");

    for (let expenseID of expenseIDs) {
      let expense = ExpenseTracker.getOrCreateExpense(expenseID);
      expense.addTag(id, true);
    }

    for (let guestID of guestIDs) {
      let guest = ExpenseTracker.getOrCreateGuest(guestID);
      guest.addTag(id, true);
    }

    this.id = id;
    this.name = name;
    this.ExpenseTracker = ExpenseTracker;
    this.expenses = expenseIDs;
    this.guests = guestIDs;
    return this;
  }

  toString() {
    return `${this.name}#${this.id}`;
  }

  removeSelf() {
    for (let expenseID of this.expenses) {
      ExpenseTracker.getExpense(expenseID)?.removeTag(this.id);
    }
    for (let guestID of this.guests) {
      ExpenseTracker.getGuest(guestID)?.removeTag(this.id);
    }
    let tags = { ...ExpenseTracker.tags };
    delete tags[this.id];
    ExpenseTracker.tags = tags;
  }

  addGuest(id, constructorCall = false) {
    if (this.guests.find((guestID) => guestID === id)) return this;
    this.guests.push(id);
    if (!constructorCall) ExpenseTracker.getOrCreateGuest(id)?.addTag(this.id);
    return this;
  }

  removeGuest(id) {
    if (!this.guests.find((guestID) => guestID === id)) return this;
    this.guests = this.guests.filter((guestID) => guestID !== id);
    ExpenseTracker.getGuest(id)?.removeTag(this.id);
    return this;
  }

  addExpense(id, constructorCall = false) {
    if (this.expenses.find((expenseID) => expenseID === id)) return this;
    this.expenses.push(id);
    if (!constructorCall)
      ExpenseTracker.getOrCreateExpense(id)?.addTag(this.id);
    return this;
  }

  removeExpense(id) {
    if (!this.expenses.find((expenseID) => expenseID === id)) return this;
    this.expenses = this.expenses.filter((expenseID) => expenseID !== id);
    ExpenseTracker.getExpense(id)?.removeTag(this.id);
    return this;
  }

  get totalExpenses() {
    return this.expenses.reduce(
      (sum, expenseID) => sum + ExpenseTracker.getExpense(expenseID)?.amount,
      0
    );
  }

  get totalGuests() {
    return this.guests.length;
  }

  get perGuestExpenses() {
    return round2Decimals(this.totalExpenses / this.totalGuests);
  }
}

class Expense {
  constructor(id, name, amount, issuerID, tagIDs) {
    if (!id) id = ExpenseTracker.createID("expenses");
    if (ExpenseTracker.expenses[id]) throw new Error("ID already exists");
    if (!name) throw new Error("Name is required");
    if (!amount) throw new Error("Amount is required");
    if (!issuerID) throw new Error("Issuer is required");
    if (!tagIDs) throw new Error("Tags are required");

    if (issuerID !== null) {
      let guest = ExpenseTracker.getOrCreateGuest(issuerID);
      guest.addIssuedExpense(id, true);
    }

    if (tagIDs !== null && tagIDs.length > 0) {
      for (let tagID of tagIDs) {
        let tag = ExpenseTracker.getOrCreateTag(tagID);
        tag.addExpense(id, true);
      }
    }

    this.id = id;
    this.name = name;
    this.ExpenseTracker = ExpenseTracker;
    this.amount = amount;
    this.tags = tagIDs;
    this.issuer = issuerID;
    return this;
  }

  toString() {
    return `${this.name}#${this.id}`;
  }

  removeSelf() {
    ExpenseTracker.getGuest(this.issuer)?.removeIssuedExpense(this.id);
    for (let tag of this.tags)
      ExpenseTracker.getTag(tag)?.removeExpense(this.id);
    let expenses = { ...ExpenseTracker.expenses };
    delete expenses[this.id];
    ExpenseTracker.expenses = expenses;
  }

  addTag(id, constructorCall = false) {
    if (!id || this.tags.find((tagID) => tagID === id)) return this;
    let oldTags = this.tags;
    this.tags.push(id);
    if (!constructorCall)
      ExpenseTracker.getOrCreateTag(id)?.addExpense(this.id);
    return this;
  }

  removeTag(id, constructorCall = false) {
    if (!id || !this.tags.find((tagID) => tagID === id)) return this;
    this.tags = this.tags.filter((tagID) => tagID !== id);
    if (!constructorCall) ExpenseTracker.getTag(id)?.removeExpense(this.id);
    return this;
  }

  setIssuer(id, constructorCall = false) {
    if (this.issuer === id) return this;
    let oldIssuer = this.issuer;
    this.issuer = id;
    if (id !== null) {
      if (!constructorCall)
        ExpenseTracker.getOrCreateGuest(id)?.addIssuedExpense(this.id);
      ExpenseTracker.getGuest(oldIssuer)?.removeIssuedExpense(this.id);
    } else ExpenseTracker.getGuest(oldIssuer)?.removeIssuedExpense(this.id);
    return this;
  }
}

class ExpenseTrackerTester {
  static runAllTests() {
    console.group("Running all tests");
    const previosState = ExpenseTrackerTester.prepare();
    console.group("Running basic test");
    try {
      ExpenseTrackerTester.testBasic();
    } catch (e) {
      console.error(e);
    }
    console.groupEnd("Finished basic test");
    ExpenseTrackerTester.prepare();
    console.group("Running complex test");
    try {
      ExpenseTrackerTester.testComplexDebts();
    } catch (e) {
      console.error(e);
    }
    console.groupEnd("Finished complex test");
    ExpenseTrackerTester.restore(previosState);
    console.groupEnd("Finished all tests");
  }

  static prepare() {
    const previosState = {
      expenses: ExpenseTracker.expenses,
      tags: ExpenseTracker.tags,
      guests: ExpenseTracker.guests,
    };
    ExpenseTracker.expenses = {};
    ExpenseTracker.tags = {};
    ExpenseTracker.guests = {};
    return previosState;
  }

  static restore(previosState) {
    ExpenseTracker.expenses = previosState.expenses;
    ExpenseTracker.tags = previosState.tags;
    ExpenseTracker.guests = previosState.guests;
  }

  static testBasic() {
    console.log("Creating tags, guests and expenses");
    const tag1 = ExpenseTracker.createTag(null, "tag1");
    const tag2 = ExpenseTracker.createTag(null, "tag2");
    const tag3 = ExpenseTracker.createTag(null, "tag3");
    const guest1 = ExpenseTracker.createGuest(null, "guest1", [
      tag1.id,
      tag2.id,
    ]);
    const guest2 = ExpenseTracker.createGuest(null, "guest2", [
      tag2.id,
      tag3.id,
    ]);
    const guest3 = ExpenseTracker.createGuest(null, "guest3", [
      tag1.id,
      tag3.id,
    ]);
    const expense1 = ExpenseTracker.createExpense(
      null,
      "expense1",
      10,
      guest1.id,
      [tag1.id]
    );
    const expense2 = ExpenseTracker.createExpense(
      null,
      "expense2",
      20,
      guest2.id,
      [tag2.id]
    );
    const expense3 = ExpenseTracker.createExpense(
      null,
      "expense3",
      30,
      guest3.id,
      [tag1.id]
    );
    let debts = ExpenseTracker.claculateDebts();
    console.log("Debts: ", debts);
    let transactions = ExpenseTracker.clauclateBestDebtDistribution();
    console.log("Transactions: ", transactions);
    let deptDistribution =
      ExpenseTracker.calculateDebtDistribution(transactions);
    console.log("DeptDistribution: ", deptDistribution);
    console.log("ExpenseTracker: ", ExpenseTracker.format());
    console.log("Deleting expense1, tag1 and guest1");
    ExpenseTracker.deleteExpense(expense1.id);
    ExpenseTracker.deleteTag(tag1.id);
    ExpenseTracker.deleteGuest(guest1.id);
    console.log("ExpenseTracker: ", ExpenseTracker.format());
    debts = ExpenseTracker.claculateDebts();
    console.log("Debts: ", debts);
    transactions = ExpenseTracker.clauclateBestDebtDistribution();
    console.log("Transactions: ", transactions);
    deptDistribution = ExpenseTracker.calculateDebtDistribution(transactions);
    console.log("DeptDistribution: ", deptDistribution);
  }

  static testComplexDebts() {
    console.log("Creating tags, guests and expenses");
    const tag1 = ExpenseTracker.createTag(null, "tag1");
    const tag2 = ExpenseTracker.createTag(null, "tag2");
    const tag3 = ExpenseTracker.createTag(null, "tag3");
    const guest1 = ExpenseTracker.createGuest(null, "guest1", [
      tag1.id,
      tag2.id,
    ]);
    const guest2 = ExpenseTracker.createGuest(null, "guest2", [
      tag2.id,
      tag3.id,
    ]);
    const guest3 = ExpenseTracker.createGuest(null, "guest3", [
      tag1.id,
      tag3.id,
    ]);
    const guest4 = ExpenseTracker.createGuest(null, "guest4", [
      tag1.id,
      tag2.id,
      tag3.id,
    ]);
    const expense1 = ExpenseTracker.createExpense(
      null,
      "expense1",
      10,
      guest1.id,
      [tag1.id]
    );
    const expense2 = ExpenseTracker.createExpense(
      null,
      "expense2",
      20,
      guest2.id,
      [tag2.id]
    );
    const expense3 = ExpenseTracker.createExpense(
      null,
      "expense3",
      30,
      guest3.id,
      [tag3.id]
    );
    const expense4 = ExpenseTracker.createExpense(
      null,
      "expense4",
      40,
      guest4.id,
      [tag1.id]
    );
    let debts = ExpenseTracker.claculateDebts();
    let totalDept = Array.from(Object.values(debts)).reduce(
      (sum, debt) => sum + debt,
      0
    );
    console.log("Debts: ", debts);
    let expectedDebts = {
      [guest1.id]: round2Decimals(16.67 + 6.67 - 10),
      [guest2.id]: round2Decimals(6.67 + 10 - 20),
      [guest3.id]: round2Decimals(16.67 + 10 - 30),
      [guest4.id]: round2Decimals(16.67 + 6.67 + 10 - 40),
    };
    let expectedTotalDept = Array.from(Object.values(expectedDebts)).reduce(
      (sum, debt) => sum + debt,
      0
    );
    console.log("Expected debts: ", expectedDebts);
    console.log("Expected total debt: ", expectedTotalDept);
    console.assert(
      totalDept === expectedTotalDept,
      `Total debt is ${totalDept} but should be ${expectedTotalDept}`
    );
    for (let guest of ExpenseTracker.allGuests) {
      console.assert(
        debts[guest.id] === expectedDebts[guest.id],
        `Debt of guest ${guest.toString()} is ${
          debts[guest.id]
        } but should be ${expectedDebts[guest.id]}`
      );
    }

    let transactions = ExpenseTracker.clauclateBestDebtDistribution();
    console.log("Transactions: ", transactions);
    let deptDistribution =
      ExpenseTracker.calculateDebtDistribution(transactions);
    let totalDept2 = Array.from(Object.values(deptDistribution)).reduce(
      (sum, debt) => sum + debt,
      0
    );
    console.log("DeptDistribution: ", deptDistribution);
    let expectedDeptDistribution = {
      [guest1.id]: 0,
      [guest2.id]: 0,
      [guest3.id]: 0,
      [guest4.id]: 0,
    };
    console.log("Expected dept distribution: ", expectedDeptDistribution);
    console.assert(
      totalDept2 === expectedTotalDept,
      `Total debt is ${totalDept2} but should be ${expectedTotalDept}`
    );
    for (let guest of ExpenseTracker.allGuests) {
      console.assert(
        deptDistribution[guest.id] <=
          Math.max(expectedDeptDistribution[guest.id], expectedTotalDept),
        `Debt of guest ${guest.toString()} is ${
          deptDistribution[guest.id]
        } but should be at most ${Math.max(
          expectedDeptDistribution[guest.id],
          expectedTotalDept
        )}`
      );
      expectedTotalDept -= deptDistribution[guest.id];
    }
    console.assert(
      expectedTotalDept === 0,
      `Expected total debt remaining after all partial depts is ${expectedTotalDept} but should be 0`
    );
    console.log("ExpenseTracker: ", ExpenseTracker.format());
  }
}
