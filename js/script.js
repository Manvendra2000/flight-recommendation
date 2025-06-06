function fetchFlights() {
  const from = document.getElementById('fromInput').value.trim().toUpperCase();
  const to = document.getElementById('toInput').value.trim().toUpperCase();
  const startDateRaw = document.getElementById('departure').value;
  const endDateRaw = document.getElementById('returnDate').value;
  const travelClass = document.querySelector('input[name="trip-type-2"]:checked').value;

  const startDate = formatDate(startDateRaw); // to DDMMYYYY
  const endDate = formatDate(endDateRaw);

  const url = `http://localhost:8000/api/flights.php?origin=${from}&destination=${to}&class=${travelClass}&startDate=${startDate}&endDate=${endDate}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      try {
        const data = JSON.parse(text);
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        document.getElementById('output').textContent = 'Invalid JSON:\n' + text;
      }
    });
}

function formatDate(yyyyMMdd) {
  const d = new Date(yyyyMMdd);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return dd + mm + yyyy;
}

function redirectWithParams() {
  const from = document.getElementById('from').value.trim().toUpperCase();
  const to = document.getElementById('to').value.trim().toUpperCase();
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const cls = document.getElementById('cls').value;

  const url = `search.html?origin=${from}&destination=${to}&startDate=${start}&endDate=${end}&class=${cls}`;
  window.location.href = url;
}