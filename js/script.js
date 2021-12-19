const TRANSACTIONS = "transactions"

const openModal = (modal) => {
  modal.classList.add('show');
}

const closeModal = (modal, modalForm) => {
  modalForm.reset();
  modal.classList.remove('show');
}

const getTransactions = () => {
  return JSON.parse(localStorage.getItem(TRANSACTIONS)) || []
}

const setTransactions = (transactions) => {
  localStorage.setItem(TRANSACTIONS, JSON.stringify(transactions))
}

function submitModal() {
  const form = new FormData(event.target);
  const {
    desc: description,
    date,
    value,
    type,
  } = Object.fromEntries(form);
  const numberValue = value.replace(',', '.');

  const transactions = getTransactions()

  transactions.push({
    description,
    date,
    value: Number(numberValue),
    type,
  });

  setTransactions(transactions)
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

function formatMoneyValue(value) {
  const number = Number(value);
  return `${number.toLocaleString("pt-BR", {
    style: "currency",
    useGrouping: true,
    currency: "BRL" 
  })}`;
}

function getBalanceValue(type) {
  const transactions = getTransactions();
  const value = transactions.reduce((acc, item ) => {
    const newAcc = (item.type ===type) ? acc + item.value : acc;
    return newAcc;
  }, 0);
  return value
}

function fillBalace() {
  const balanceIn = document.querySelector("#balance .in p");
  const balanceOut = document.querySelector("#balance .out p");
  const balanceTotal = document.querySelector("#balance .total p");
  const totalContainer = document.querySelector("#balance li:last-child")

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

  const imageTd = document.createElement('td');
  const image = document.createElement('img');
  image.src = './assets/img/trash.svg';
  image.alt = 'Exluir';
  imageTd.appendChild(image);

  image.addEventListener('click', () => removeTask(description));
  
  valueTd.classList.add(valueClass);
  tr.appendChild(descriptionTd);
  tr.appendChild(valueTd);
  tr.appendChild(dateTd);
  tr.appendChild(imageTd);

  return tr;

}

function removeTask(description) {
  const userConfirms = window.confirm('Você realmente deseja remover esta transação?');
  if (!userConfirms) {
    return
  }
  const transactions = getTransactions()
    .filter(t => t.description !== description)
  console.log(transactions);
  setTransactions(transactions)
  populateTable();
  fillBalace()
}

function populateTable() {
  const transactionsTable = document.querySelector("#transactions table");
  const transactions = getTransactions()
  const transactionElements = transactions.map(createTransactionsItem)
  const tableBody = transactionsTable.querySelector('tbody');
  tableBody.innerHTML = '';
  transactionElements.forEach(element => tableBody.appendChild(element))
  transactionsTable.appendChild(tableBody);
}

window.addEventListener('load', () => {
  const newTrasactionBtn = document.querySelector("#transactions button");

  const modal = document.querySelector("#modal-container");
  const modalCancelBtn = document.querySelector("#modal-container button");
  const modalForm = document.querySelector("#modal-container form");
  const valueInput = modalForm.querySelector('input[name="value"]');

  newTrasactionBtn.addEventListener('click', () => openModal(modal));

  modalCancelBtn.addEventListener('click', () => closeModal(modal, modalForm));
  modalForm.addEventListener('submit', (event) => {
    event.preventDefault()
    submitModal();
    closeModal(modal, modalForm);
    populateTable();
    fillBalace();
  });
  valueInput.addEventListener('input', inputNumber);

  populateTable();
  fillBalace();
})

