// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Buttons for expanding sections
    const addCurrentAssetsBtn = document.querySelector(".current-assets-item button");
    const addCurrentLiabilitiesBtn = document.querySelector(".current-liabilities-item button");
    const addInvestmentsBtn = document.querySelector(".investments-item button");
    const addLongTermLiabilitiesBtn = document.querySelector(".long-term-liabilities-item button");
    const addIntangiblesBtn = document.querySelector(".intangibles-item button");
    const addTotalPositionsBtn = document.querySelector(".total-position button");

    // Section to display totals
    /*
    const totalAssetsSpan = document.querySelector(".total-details .position-details:nth-child(1)");
    const totalLiabilitiesSpan = document.querySelector(".total-details .position-details:nth-child(2)");
    const positionSpan = document.querySelector(".total-details .position-details:nth-child(3)");
    */
    const totalAssetsSpan = document.querySelector(".total-position .position-assets");
    const totalLiabilitiesSpan = document.querySelector(".total-position .position-liabilities");
    const positionSpan = document.querySelector(".total-position .position-total");

    // Create form that is reusable
    function createForm(sectionDisplayName, sectionName, fields) {
        const form = document.createElement("form");
        form.classList.add(`${sectionName}-form`);
        form.style.display = "flex";
        form.style.flexDirection = "column"; // Align fields vertically
        form.style.alignItems = "flex-end"; // Align items to the right
      
        // Generate fields 
        fields.forEach((field) => {
            const label = document.createElement("label");
            label.textContent = `${field}: `;
            const input = document.createElement("input");
            input.type = "number";
            input.classList.add(`${sectionName}-${field.toLowerCase().replace(/\s/g, "-")}`);
            input.value = "0"; // Default value

            // Recalculate totals on input
            input.addEventListener("input", () => updateSectionTotal(form, sectionDisplayName));

            label.appendChild(input);
            form.appendChild(label);
            //form.appendChild(document.createElement("br"));
        });

        // Placeholder for displaying the section's total
        const totalDisplay = document.createElement("p");
        totalDisplay.classList.add("total-display");
        totalDisplay.textContent = `Total ${sectionDisplayName}: 0.00`;
        form.appendChild(totalDisplay);

        return form;
    }

    // Calculate total for a section 
    function updateSectionTotal(form, sectionDisplayName) {
        const inputs = form.querySelectorAll("input");
        let total = 0;

        inputs.forEach((input) => {
            total += parseFloat(input.value) || 0; // Convert value to number or default to 0
        });

        // Update the total display for the section
        const totalDisplay = form.querySelector(".total-display");
        totalDisplay.textContent = `Total ${sectionDisplayName}: ${total.toFixed(2)}`;

        // Update the overall totals and position
        updatePosition();
    }

    // Add forms for each section when a button is clicked
    addCurrentAssetsBtn.addEventListener("click", () => {
        toggleSection(addCurrentAssetsBtn, "Current Assets", "current-assets", ["Cash", "Inventory", "Supplies", "Temporary Investments"]);
    });

    addCurrentLiabilitiesBtn.addEventListener("click", () => {
        toggleSection(addCurrentLiabilitiesBtn, "Current Liabilities", "current-liabilities", ["Accounts Payable", "Notes Payable", "Interest Payable", "Wages Payable", "Account Expenses"]);
    });

    addInvestmentsBtn.addEventListener("click", () => {
        toggleSection(addInvestmentsBtn, "Investment Property & Equipment", "investments", ["Land", "Building & Improvements", "Equipment", "Temporary Investments"]);
    });

    addLongTermLiabilitiesBtn.addEventListener("click", () => {
        toggleSection(addLongTermLiabilitiesBtn, "Long Term Liabilities", "long-term-liabilities", ["Notes Payable", "Bonds Payable"]);
    });

    addIntangiblesBtn.addEventListener("click", () => {
        toggleSection(addIntangiblesBtn, "Intangibles", "Intangibles", ["Trademarks", "Goodwill"]);
    });

    addTotalPositionsBtn.addEventListener("click", () => {
        updatePosition();
    });

    // Show/hide section form
    function toggleSection(button, sectionDisplayName, sectionName, fields) {
        const parentDiv = button.parentElement;

        // Make the button disappear when clicked
        button.style.display = "none";

        // Check if the form already exists
        let form = parentDiv.querySelector(`.${sectionName}-form`);
        if (!form) {
            // Create and append the form
            form = createForm(sectionDisplayName, sectionName, fields);
            parentDiv.appendChild(form);
        }
    }

    // Update totals and calculate position
    function updatePosition() {
        let totalAssets = 0;
        let totalLiabilities = 0;

        // Sum up totals from each section
        document.querySelectorAll(".total-display").forEach((totalDisplay) => {
            const text = totalDisplay.textContent;
            const value = parseFloat(text.split(": ")[1]) || 0;

            if (text.includes("Assets") || text.includes("Investment") || text.includes("Intangibles")) {
                totalAssets += value;
            } else if (text.includes("Liabilities")) {
                totalLiabilities += value;
            }
        });

        // Update the display
        totalAssetsSpan.textContent = `Total Assets: ${totalAssets.toFixed(2)}`;
        totalLiabilitiesSpan.textContent = `Total Liabilities: ${totalLiabilities.toFixed(2)}`;
        positionSpan.textContent = `Position: ${(totalAssets - totalLiabilities).toFixed(2)}`;
    }
});
