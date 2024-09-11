let salary = 0;
let totalExpenses = 0;
let expenses = [];
let salaryFrequency = 'monthly';
let customSalaryDays = 0;

document.getElementById('salaryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const salaryAmount = parseFloat(document.getElementById('salaryAmount').value);
    salaryFrequency = document.getElementById('salaryFrequency').value;

    if (salaryFrequency === 'custom') {
        customSalaryDays = parseInt(document.getElementById('customSalaryDays').value);
        salary = (salaryAmount * 30) / customSalaryDays;  // Convert custom salary to monthly equivalent
    } else {
        salary = calculateMonthlySalary(salaryAmount, salaryFrequency);
    }
    
    updateSavings();
});

document.getElementById('salaryFrequency').addEventListener('change', function() {
    if (this.value === 'custom') {
        document.getElementById('customSalaryDaysField').style.display = 'block';
    } else {
        document.getElementById('customSalaryDaysField').style.display = 'none';
    }
});

function calculateMonthlySalary(amount, frequency) {
    switch (frequency) {
        case 'annually':
            return amount / 12;  // Annual to monthly
        case 'fortnightly':
            return amount * 2.17;  // Fortnightly to monthly
        case 'monthly':
        default:
            return amount;  // No conversion needed
    }
}

document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const recurrence = document.getElementById('expenseRecurrence').value;
    let customDays = 0;
    
    if (recurrence === 'custom') {
        customDays = parseInt(document.getElementById('customExpenseDays').value);
    }

    const expenseItem = { name, amount, date, recurrence, customDays };
    expenses.push(expenseItem);
    addExpenseToList(expenseItem);
    updateTotalExpenses();
    updateSavings();
});

document.getElementById('expenseRecurrence').addEventListener('change', function() {
    if (this.value === 'custom') {
        document.getElementById('customExpenseDaysField').style.display = 'block';
    } else {
        document.getElementById('customExpenseDaysField').style.display = 'none';
    }
});

function addExpenseToList(expenseItem) {
    const expenseElement = document.createElement('li');
    expenseElement.innerHTML = `
        ${expenseItem.name} - $${expenseItem.amount} - ${expenseItem.date} (${expenseItem.recurrence})
        <button class="delete-btn">Delete</button>
    `;
    document.getElementById('expenseItems').appendChild(expenseElement);
    
    expenseElement.querySelector('.delete-btn').addEventListener('click', function() {
        expenseElement.remove();
        expenses = expenses.filter(exp => exp !== expenseItem);
        updateTotalExpenses();
        updateSavings();
    });
}

function updateTotalExpenses() {
    totalExpenses = expenses.reduce((total, expense) => {
        let frequencyMultiplier = 1;
        
        switch (expense.recurrence) {
            case 'weekly':
                frequencyMultiplier = 4.33;  // Weekly to monthly
                break;
            case 'fortnightly':
                frequencyMultiplier = 2.17;  // Fortnightly to monthly
                break;
            case 'monthly':
                frequencyMultiplier = 1;  // Monthly remains the same
                break;
            case 'annually':
                frequencyMultiplier = 1 / 12;  // Annual to monthly
                break;
            case 'custom':
                frequencyMultiplier = 30 / expense.customDays;  // Custom days to monthly
                break;
            default:
                frequencyMultiplier = 0;  // One-time expenses don't recur
        }

        return total + (expense.amount * frequencyMultiplier);
    }, 0);
    
    document.getElementById('totalExpenses').innerText = `$${totalExpenses.toFixed(2)}`;
}

function calculateTax(annualSalary) {
    let tax = 0;
    
    if (annualSalary <= 18200) {
        tax = 0;
    } else if (annualSalary <= 45000) {
        tax = (annualSalary - 18200) * 0.19;
    } else if (annualSalary <= 120000) {
        tax = 5092 + (annualSalary - 45000) * 0.325;
    } else if (annualSalary <= 180000) {
        tax = 29467 + (annualSalary - 120000) * 0.37;
    } else {
        tax = 51667 + (annualSalary - 180000) * 0.45;
    }

    return tax;
}

function updateSavings() {
    let annualSalary = salary * 12;  // Convert monthly salary to annual
    let tax = calculateTax(annualSalary);
    let netAnnualSalary = annualSalary - tax;
    let netMonthlySalary = netAnnualSalary / 12;
    let netFortnightlySalary = netAnnualSalary / 26;  // Corrected conversion

    if (salary > 0) {
        const monthlySavings = netMonthlySalary - totalExpenses;
        const fortnightlySavings = netFortnightlySalary - (totalExpenses / 2);  // Corrected formula
        const annualSavings = netAnnualSalary - (totalExpenses * 12);
        
        document.getElementById('monthlySavings').innerText = `$${monthlySavings.toFixed(2)}`;
        document.getElementById('fortnightlySavings').innerText = `$${fortnightlySavings.toFixed(2)}`;
        document.getElementById('annualSavings').innerText = `$${annualSavings.toFixed(2)}`;
    }
}
