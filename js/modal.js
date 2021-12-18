const newTrasactionBtn = document.querySelector("#transactions button");

const modal = document.querySelector("#modal-container");
const modalCancelBtn = document.querySelector("#modal-container button");
const modalForm = document.querySelector("#modal-container form");

const openModal = () => {
  modal.classList.add('show');
}

const closeModal = () => {
  modal.classList.remove('show');
}

function submitModal(event) {
  event.preventDefault();
  // Adicionar gasto
}

newTrasactionBtn.addEventListener('click', openModal);

modalCancelBtn.addEventListener('click', closeModal);
modalForm.addEventListener('submit', submitModal);
