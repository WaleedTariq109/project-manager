import axios from 'axios';

const form = <HTMLFormElement>document.querySelector('form');
const addressInput = <HTMLInputElement>document.querySelector('#address');

const GOOGLE_API_KEY = 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU';

// type GoogleResponse = {
//   results: { geometry: { location: { lat: number; lng: number } } }[];
//   status: 'OK' | 'ZERO_RESULTS';
// };

function searchHandler(e: Event) {
  e.preventDefault();
  const address = addressInput.value;

  axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)},+CA&key=${GOOGLE_API_KEY}`)
    .then((res) => {
      console.log(res);
      if (res.data.status !== 'OK') {
        throw new Error(res.data.error_message);
      }
      const coords = res.data.results[0].geometry.location;

      const map = new google.maps.Map(<HTMLDivElement>document.getElementById('map'), {
        center: coords,
        zoom: 8,
      });
      new google.maps.Marker({
        position: coords,
        map: map,
      });
    })
    .catch((err) => {
      alert(err.message);
    });
}

form.addEventListener('submit', searchHandler);
