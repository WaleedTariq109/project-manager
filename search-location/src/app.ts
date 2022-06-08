import axios from 'axios';

const form = <HTMLFormElement>document.querySelector('form');
const addressInput = <HTMLInputElement>document.querySelector('#address');

const GOOGLE_API_KEY = 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU';

type GoogleResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

function searchHandler(e: Event) {
  e.preventDefault();
  const address = addressInput.value;

  axios
    .get<GoogleResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)},+CA&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }

      const coords = res.data.results[0].geometry.location;
      console.log(coords);
    })
    .catch((err) => {
      alert(err.message);
    });
}

form.addEventListener('submit', searchHandler);
