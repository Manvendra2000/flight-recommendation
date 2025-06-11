fetch('/api/flights')
  .then(res => res.json())
  .then(data => {
    const results = document.getElementById('results');

    data.forEach(flight => {
      const card = document.createElement('div');
      card.className = 'card';

      const airlineLogo = `images/${flight.airline}.png`;

      card.innerHTML = `
        <div>
          <img src="${airlineLogo}" alt="${flight.airline}">
          <div>${flight.airline} ${flight.flightNumber}</div>
        </div>
        <div class="times">
          <strong>${flight.dep}</strong><br>Departure
        </div>
        <div class="times">
          ${flight.duration}<br>non-stop
        </div>
        <div class="times">
          <strong>${flight.arr}</strong><br>Arrival
        </div>
        <div>
          <div style="font-weight: bold;">${flight.price}</div>
          <button class="book-btn">BOOK</button>
        </div>
      `;

      results.appendChild(card);
    });
  });