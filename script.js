// =============================
// Expense Tracker
// =============================

let budget = Number(localStorage.getItem("budget")) || 5000;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editId = null;

// =============================
// DOM Elements
// =============================

const budgetLeft = document.getElementById("budgetLeft");
const totalBudget = document.getElementById("totalBudget");
const totalExpense = document.getElementById("totalExpense");

const amountInput = document.getElementById("amount");
const titleInput = document.getElementById("title");

const addBtn = document.getElementById("addBtn");
const budgetBtn = document.getElementById("budgetBtn");
const budgetInput = document.getElementById("budgetInput");

const historyContainer = document.getElementById("history");

const sortSelect = document.getElementById("sort");

// =============================
// Save Data
// =============================

function saveData() {

    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));

}

// =============================
// Total Expense
// =============================

function getTotalExpense() {

    return expenses.reduce((sum, item) => sum + item.amount, 0);

}

// =============================
// Update Dashboard
// =============================

function updateDashboard() {

    const spent = getTotalExpense();

    totalBudget.innerText = `₹${budget}`;

    totalExpense.innerText = `₹${spent}`;

    budgetLeft.innerText = `₹${budget - spent}`;

    saveData();

    renderHistory();

    updatePieChart();

}

// =============================
// Add Expense
// =============================

function addExpense() {

    const title = titleInput.value.trim();

    const amount = Number(amountInput.value);

    if (title === "" || amount <= 0) {

        alert("Please enter valid data.");

        return;

    }

    if (editId === null) {

        expenses.push({

            id: Date.now(),

            title,

            amount,

            date: new Date().toLocaleString()

        });

    }

    else {

        expenses = expenses.map(item => {

            if (item.id === editId) {

                item.title = title;

                item.amount = amount;

            }

            return item;

        });

        editId = null;

        addBtn.innerText = "Add +";

    }

    amountInput.value = "";
    titleInput.value = "";

    updateDashboard();

}

// =============================
// Render History
// =============================

function renderHistory() {

    historyContainer.innerHTML = "";

    let data = [...expenses];

    switch (sortSelect.value) {

        case "high":

            data.sort((a, b) => b.amount - a.amount);

            break;

        case "low":

            data.sort((a, b) => a.amount - b.amount);

            break;

        case "old":

            data.sort((a, b) => a.id - b.id);

            break;

        default:

            data.sort((a, b) => b.id - a.id);

    }

    data.forEach(item => {

        const div = document.createElement("div");

        div.className = "expense-card";

        div.innerHTML = `

        <div class="expense-info">

            <h3>-₹${item.amount}</h3>

            <p>${item.title}</p>

            <small>${item.date}</small>

        </div>

        <div class="actions">

            <button onclick="editExpense(${item.id})">

                ✏️

            </button>

            <button onclick="deleteExpense(${item.id})">

                🗑️

            </button>

        </div>

        `;

        historyContainer.appendChild(div);

    });

}

// =============================
// Delete
// =============================

function deleteExpense(id) {

    if (confirm("Delete this expense?")) {

        expenses = expenses.filter(item => item.id !== id);

        updateDashboard();

    }

}

// =============================
// Edit
// =============================

function editExpense(id) {

    const expense = expenses.find(item => item.id === id);

    titleInput.value = expense.title;

    amountInput.value = expense.amount;

    editId = id;

    addBtn.innerText = "Update Expense";

}

// =============================
// Budget
// =============================

function updateBudget() {

    const value = Number(budgetInput.value);

    if (value <= 0) {

        alert("Enter valid budget");

        return;

    }

    budget = value;

    budgetInput.value = "";

    updateDashboard();

}

// =============================
// Pie Chart
// =============================

function updatePieChart() {

    const spent = getTotalExpense();

    const remain = budget - spent;

    const total = spent + remain;

    const percent = (spent / total) * 360;

    const pie = document.getElementById("pie");

    pie.style.background =
        `conic-gradient(
        #ef6b6b 0deg ${percent}deg,
        #6fa48c ${percent}deg 360deg
    )`;

}

// =============================
// Events
// =============================

addBtn.addEventListener("click", addExpense);

budgetBtn.addEventListener("click", updateBudget);

sortSelect.addEventListener("change", renderHistory);

// =============================
// Init
// =============================

updateDashboard();