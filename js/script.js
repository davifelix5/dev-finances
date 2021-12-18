export const transactions = [
  {
    "description": "Luz",
    "value": 800,
    "type": "-",
    "date": "2021-01-23"
  },
  {
    "description": "Criação de Website",
    "value": 56000,
    "type": "+",
    "date": "2021-01-24"
  },
  {
    "description": "Aluguel",
    "value": 5000,
    "type": "-",
    "date": "2021-01-28"
  }
];

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

  formElement.reset();
  closeModal();

  populateTable(transactionsTable, transactions);
  fillBalace(transactions);
}

function onInputNumber() {
  let numberInput = ''
  function inputNumber(event) {
    const keyPressed = event.data;
    const keyInvalid = keyPressed && isNaN(keyPressed);
    const input = event.target;

    // Input type when backspace is pressed
    const deleteInputType = "deleteContentBackward"

    if (keyInvalid) {
      input.value = input.value.slice(0, -1);
      return;
    } else if (keyPressed) {
      numberInput += keyPressed;
    } else if (event.inputType === deleteInputType) {
      numberInput = numberInput.slice(0, -1);
    }

    const inputValue = numberInput.padStart(3, "0");
    const firstDigits = inputValue.slice(0, -2)
    const lastTwoDigits = inputValue.slice(-2)

    input.value = numberInput.length ? `${firstDigits},${lastTwoDigits}` : '';

  }

  return inputNumber;
}

newTrasactionBtn.addEventListener('click', openModal);

modalCancelBtn.addEventListener('click', closeModal);
modalForm.addEventListener('submit', submitModal);
valueInput.addEventListener('input', onInputNumber());


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

function fillBalace(transactions = []) {
  const outValue = getBalanceValue("-")
  const inValue = getBalanceValue("+")
  const totalValue = inValue - outValue;

  if (totalValue < 0) {
    totalContainer.classList.add('negative')
  } else {
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
fillBalace(transactions)