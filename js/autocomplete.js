let selectedFromCode = "";
let selectedToCode = "";

document.addEventListener("DOMContentLoaded", () => {
  const fromInput = document.getElementById("fromInput");
  const fromDropdown = document.getElementById("fromDropdown");

  const toInput = document.getElementById("toInput");
  const toDropdown = document.getElementById("toDropdown");

  // From Input
  fromInput.addEventListener("input", async () => {
    const query = fromInput.value.trim();
    if (query.length < 2) {
      fromDropdown.style.display = "none";
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/server.php?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      const items = json?.data?.data || [];

      fromDropdown.innerHTML = "";
      if (!items.length) {
        fromDropdown.style.display = "none";
        return;
      }

      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "autocomplete-item";
        div.textContent = `${item.cityName}, ${item.countryName} (${item.airportCode})`;
        div.addEventListener("click", () => {
          fromInput.value = div.textContent;
          selectedFromCode = item.airportCode; // ✅ Store code
          fromDropdown.style.display = "none";
        });
        fromDropdown.appendChild(div);
      });

      fromDropdown.style.display = "block";
    } catch (err) {
      console.error("Autocomplete fetch failed:", err);
      fromDropdown.style.display = "none";
    }
  });

  // To Input
  toInput.addEventListener("input", async () => {
    const query = toInput.value.trim();
    if (query.length < 2) {
      toDropdown.style.display = "none";
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/server.php?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      const items = json?.data?.data || [];

      toDropdown.innerHTML = "";
      if (!items.length) {
        toDropdown.style.display = "none";
        return;
      }

      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "autocomplete-item";
        div.textContent = `${item.cityName}, ${item.countryName} (${item.airportCode})`;
        div.addEventListener("click", () => {
          toInput.value = div.textContent;
          selectedToCode = item.airportCode; // ✅ Store code
          toDropdown.style.display = "none";
        });
        toDropdown.appendChild(div);
      });

      toDropdown.style.display = "block";
    } catch (err) {
      console.error("Autocomplete fetch failed:", err);
      toDropdown.style.display = "none";
    }
  });

  document.addEventListener("click", (e) => {
    if (!fromInput.contains(e.target) && !fromDropdown.contains(e.target)) {
      fromDropdown.style.display = "none";
    }
    if (!toInput.contains(e.target) && !toDropdown.contains(e.target)) {
      toDropdown.style.display = "none";
    }
  });
});