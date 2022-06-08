const form = <HTMLFormElement>document.querySelector('form');
const addressInput = <HTMLInputElement>document.querySelector('#address');

function searchHandler(e: Event) {
  e.preventDefault();
  const address = addressInput.value;
  console.log(address);
}

form.addEventListener('submit', searchHandler);
