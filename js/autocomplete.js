document.addEventListener("DOMContentLoaded", () => {
	  const input = document.getElementById("fromInput");
	  const dropdown = document.getElementById("fromDropdown");
	  const selectedContainerId = "selectedFromLocations";
	
	  input.addEventListener("input", async () => {
		const query = input.value.trim();
		if (query.length < 2) {
		  dropdown.style.display = "none";
		  return;
		}
	
		try {
        const res = await fetch(`http://localhost:8000/api/server.php?q=${encodeURIComponent(query)}`);
		  const data = await res.json();

          
		  populateDropdown(data, dropdown, selectedContainerId, input.id);
		} catch (err) {
		  console.error("Autocomplete fetch failed:", err);
		  dropdown.style.display = "none";
		}
	  });
	});
	
	function populateDropdown(data, dropdown, selectedContainerId, inputId) {
	  dropdown.innerHTML = "";
	  if (!data?.data?.length) {
		dropdown.style.display = "none";
		return;
	  }
	
	  data.data.forEach(item => {
		const div = document.createElement("div");
		div.className = "autocomplete-item";
		div.innerHTML = `<span class="icon"><img src="images/drop1.png" width="20" height="20"></span> ${item.displayName} <span class="plus-icon">+</span>`;
		div.onclick = () => selectLocation(item.displayName, selectedContainerId, inputId, dropdown.id);
		dropdown.appendChild(div);
	  });
	
	  dropdown.style.display = "block";
	}
	
	function selectLocation(location, selectedContainerId, inputId, dropdownId) {
	  const input = document.getElementById(inputId);
	  input.value = "";
	  input.placeholder = "";
	  document.getElementById(dropdownId).style.display = "none";
	
	  const inputParent = input.parentElement;
	  inputParent.style.border = "";
	
	  const selectedLocations = document.getElementById(selectedContainerId);
	  if (selectedLocations.children.length >= 2) return;
	
	  const selectedDiv = document.createElement("div");
	  selectedDiv.className = "selected-location";
	  selectedDiv.innerHTML = `
		<span>${location}</span> 
		<span class='remove-icon' onclick='removeLocation(this, "${inputId}")'>×</span>
	  `;
	
	  selectedLocations.appendChild(selectedDiv);
	
	  if (selectedLocations.children.length === 1) {
		addMoreButton(selectedContainerId, inputId);
	  }
	
	  checkAndDisplayMergeIcon();
	}
	
	function removeLocation(element, inputId) {
	  const selectedContainer = element.parentElement.parentElement;
	  element.parentElement.remove();
	  checkAndDisplayMergeIcon();
	
	  const input = document.getElementById(inputId);
	  const inputParent = input.parentElement;
	
	  if (selectedContainer.children.length === 1) {
		input.placeholder = "City, airport or place";
		document.getElementById(`moreBtn-${selectedContainer.id}`).remove();
	  }
	
	  if (selectedContainer.children.length === 0) {
		inputParent.style.border = "2px solid red";
	  }
	}
	
	function addMoreButton(selectedContainerId, inputId) {
	  const selectedLocations = document.getElementById(selectedContainerId);
	  if (document.getElementById(`moreBtn-${selectedContainerId}`)) return;
	
	  const moreBtn = document.createElement("div");
	  moreBtn.id = `moreBtn-${selectedContainerId}`;
	  moreBtn.className = "more-button";
	  moreBtn.textContent = "+ Add more";
	  moreBtn.onclick = () => document.getElementById(inputId).focus();
	
	  selectedLocations.appendChild(moreBtn);
	}
	
	function checkAndDisplayMergeIcon() {
	  // Implement if needed, otherwise leave empty
	}

