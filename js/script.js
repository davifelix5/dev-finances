const TRANSACTIONS = "transactions"

export const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS)) || [];

const newTrasactionBtn = document.querySelector("#transactions button");

const modal = document.querySelector("#modal-container");
const modalCancelBtn = document.querySelector("#modal-container button");
const modalForm = document.querySelector("#modal-container form");
const valueInput = modalForm.querySelector('input[name="value"]');

const openModal = () => {
  modal.classList.add('show');
}

const closeModal = () => {
  modalForm.reset();
  modal.classList.remove('show');
}

function submitModal(event) {
  event.preventDefault();
  const formElement = event.target;
  const form = new FormData(event.target);
  const {
    desc: description,
    date,
    value,
    type,
  } = Object.fromEntries(form);
  const numberValue = value.replace(',', '.');

  transactions.push({
    description,
    date,
    value: Number(numberValue),
    type,
  });

  localStorage.setItem(TRANSACTIONS, JSON.stringify(transactions))

  formElement.reset();
  closeModal();

  populateTable(transactionsTable, transactions);
  fillBalace();
}

function inputNumber(event) {
  const keyPressed = event.data;
  const keyInvalid = keyPressed && isNaN(keyPressed);
  const input = event.target;

  if (keyInvalid) {
    input.value = input.value.slice(0, -1);
    return;
  }

  const numberValue = input.value.replace(/\D/g, '');
  const validNumberValue = numberValue.replace(/^(0+)/g, '');

  const filledValue = validNumberValue.padStart(3, '0');
  const start = filledValue.slice(0, -2);
  const lastTwoDigits = filledValue.slice(-2);

  input.value = `${start},${lastTwoDigits}`;
}

newTrasactionBtn.addEventListener('click', openModal);

modalCancelBtn.addEventListener('click', closeModal);
modalForm.addEventListener('submit', submitModal);
valueInput.addEventListener('input', inputNumber);


const balanceIn = document.querySelector("#balance .in p");
const balanceOut = document.querySelector("#balance .out p");
const balanceTotal = document.querySelector("#balance .total p");
const totalContainer = document.querySelector("#balance li:last-child")

const transactionsTable = document.querySelector("#transactions table");

function formatMoneyValue(value) {
  const number = Number(value);
  return `${number.toLocaleString("pt-BR", {
    style: "currency",
    useGrouping: true,
    currency: "BRL" 
  })}`;
}

function getBalanceValue(type) {
  const value = transactions.reduce((acc, item ) => {
    const newAcc = (item.type ===type) ? acc + item.value : acc;
    return newAcc;
  }, 0);
  return value
}

function fillBalace() {
  const outValue = getBalanceValue("-")
  const inValue = getBalanceValue("+")
  const totalValue = inValue - outValue;

  if (totalValue < 0) {
    totalContainer.classList.add('negative')
    totalContainer.classList.remove('positive')
  } else {
    totalContainer.classList.remove('negative')
    totalContainer.classList.add('positive')
  }

  balanceIn.innerHTML = formatMoneyValue(inValue);
  balanceOut.innerHTML = formatMoneyValue(outValue);
  balanceTotal.innerHTML = formatMoneyValue(totalValue);
}

function createTransactionsItem(expense) {
  const {
    type,
    value,
    description,
    date
  } = expense;

  const tr = document.createElement('tr');

  const descriptionTd = document.createElement('td')
  descriptionTd.innerText = description;

  const valueTd = document.createElement('td')
  const valueClass = type === "-" ? "expense" : "more";
  const moneyValue = formatMoneyValue(value);
  valueTd.innerText = type === "-" ? `- ${moneyValue} ` : moneyValue;
 
  const dateTd = document.createElement('td')
  const [year, month, day] = date.split('-');
  dateTd.classList.add('date');
  dateTd.innerText = `${day}/${month}/${year}`;
  
  valueTd.classList.add(valueClass);
  tr.appendChild(descriptionTd);
  tr.appendChild(valueTd);
  tr.appendChild(dateTd);

  return tr;

}

function populateTable(transactionsTable, transactions) {
  const transactionElements = transactions.map(createTransactionsItem)
  const tableBody = transactionsTable.querySelector('tbody');
  tableBody.innerHTML = '';
  transactionElements.forEach(element => tableBody.appendChild(element))
  transactionsTable.appendChild(tableBody);
}

populateTable(transactionsTable, transactions);
fillBalace();