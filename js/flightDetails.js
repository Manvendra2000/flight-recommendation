document.getElementById('flightForm').addEventListener('submit', function(e) {
    e.preventDefault();
    fetchFlights();
  });
  
  function fetchFlights() {
    const token = document.getElementById('token').value.trim();
    const provider = document.getElementById('provider').value.trim();
  
    const url = `http://localhost:8000/api/poll_flight.php?token=${token}&provider=${provider}`;
  
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