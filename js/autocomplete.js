document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("fromInput");
  const dropdown = document.getElementById("fromDropdown");

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    if (query.length < 2) {
      dropdown.style.display = "none";
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/server.php?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      const items = json?.data?.data || []; // ✅ FIX: handles your nested `data.data`

      dropdown.innerHTML = "";
      if (!items.length) {
        dropdown.style.display = "none";
        return;
      }

      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "autocomplete-item";
        div.textContent = `${item.cityName}, ${item.countryName} (${item.airportCode})`;
        div.addEventListener("click", () => {
          input.value = div.textContent;
          dropdown.style.display = "none";
        });
        dropdown.appendChild(div);
      });

      dropdown.style.display = "block";
    } catch (err) {
      console.error("Autocomplete fetch failed:", err);
      dropdown.style.display = "none";
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});