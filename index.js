document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown select");
    const btn = document.querySelector("form button");
    const fromCurr = document.querySelector(".from select");
    const toCurr = document.querySelector(".to select");
    const msg = document.querySelector(".msg");

    // Populate dropdowns with currency codes
    for (let select of dropdowns) {
        for (let currCode in countryList) {
            let option = document.createElement("option");
            option.value = currCode;
            option.innerText = currCode;
            if (select.name === "from" && currCode === "USD") {
                option.selected = true;
            } else if (select.name === "to" && currCode === "INR") {
                option.selected = true;
            }
            select.append(option);
        }
    }

    // Load flag when currency changes
    for (let select of dropdowns) {
        select.addEventListener("change", (e) => {
            loadFlag(e.target);
        });
    }

    // Function to load flags
    function loadFlag(element) {
        let currCode = element.value;
        let countryCode = countryList[currCode];
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    }

    // Fetch exchange rate
    async function updateExchangeRate() {
        let amount = document.querySelector(".amount input");
        let amtVal = parseFloat(amount.value);
        if (isNaN(amtVal) || amtVal <= 0) {
            amtVal = 1;
            amount.value = "1";
        }

        msg.innerText = "Getting exchange rate...";

        try {
            const URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurr.value.toLowerCase()}.json`;
            let response = await fetch(URL);
            let data = await response.json();
            let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
            let finalAmount = (amtVal * rate).toFixed(2);

            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } catch (error) {
            msg.innerText = "Error fetching data. Please try again.";
            console.error(error);
        }
    }

    // Default exchange rate load
    updateExchangeRate();

    // Button click event
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            updateExchangeRate();
        });
    } else {
        console.error("No <button> found inside <form>");
    }
});
