const API_KEY = "0133cc5316757ac730cc46ae342334e4";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");
const logBox = document.getElementById("logBox");

// Utility function to handle logging to console and UI
function log(message) {
    console.log(message);
    if (logBox) {
        logBox.textContent += message + "\n";
    }
}

async function fetchWeather(city) {
    log("1️⃣ Sync Start");

    Promise.resolve().then(() => {
        log("3️⃣ Promise.then (Microtask)");
    });

    setTimeout(() => {
        log("4️⃣ setTimeout (Macrotask)");
    }, 0);

    try {
        log("2️⃣ [ASYNC] Start fetching...");

        // Safely encode the city name (handles spaces like "New York")
        const encodedCity = encodeURIComponent(city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`
        );

        // FIX: Extract the actual API error instead of defaulting to "City not found"
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "City not found");
        }

        const data = await response.json();
        log("5️⃣ [ASYNC] Data received");

        displayWeather(data);
        saveToLocalStorage(city);

    } catch (error) {
        // Capitalize the first letter of the error for better UI
        const errorMsg = error.message.charAt(0).toUpperCase() + error.message.slice(1);
        weatherResult.innerHTML = `<p style="color:red; font-weight:bold; background:#fff0f0; border-left: 4px solid red;">❌ Error: ${errorMsg}</p>`;
        log(`❌ Error: ${errorMsg}`);
    }

    log("6️⃣ Sync End");
}

function displayWeather(data) {
    // Safely check if the country code exists
    const country = data.sys && data.sys.country ? `, ${data.sys.country}` : "";
    
    weatherResult.innerHTML = `
        <p><span>City</span> <span>${data.name}${country}</span></p>
        <p><span>Temp</span> <span>${Math.round(data.main.temp)} °C</span></p>
        <p><span>Weather</span> <span>${data.weather[0].main} (${data.weather[0].description})</span></p>
        <p><span>Humidity</span> <span>${data.main.humidity}%</span></p>
        <p><span>Wind</span> <span>${data.wind.speed} m/s</span></p>
    `;
}

function saveToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    // Remove the city if it already exists so we can move it to the front
    cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());

    // Add new search to the beginning of the array
    cities.unshift(city);

    // Keep only the most recent 5 searches
    if (cities.length > 5) {
        cities.pop();
    }

    localStorage.setItem("cities", JSON.stringify(cities));
    loadHistory();
}

function loadHistory() {
    if (!historyList) return;
    
    historyList.innerHTML = "";
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (cities.length === 0) {
        historyList.style.display = "none";
        return;
    }

    historyList.style.display = "flex";

    cities.forEach(city => {
        const span = document.createElement("span");
        // Capitalize history buttons nicely (e.g., "new york" -> "New York")
        span.textContent = city.replace(/\b\w/g, char => char.toUpperCase());
        span.classList.add("history-item");

        span.addEventListener("click", () => {
            if (logBox) logBox.textContent = "";
            weatherResult.innerHTML = "<p>Loading...</p>";
            fetchWeather(city);
        });

        historyList.appendChild(span);
    });
}

// Event Listeners
if (searchBtn && cityInput) {
    // Click event for the Search button
    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (!city) {
            alert("Please enter a city name");
            return;
        }
        
        if (logBox) logBox.textContent = "";
        weatherResult.innerHTML = "<p style='padding:10px; font-weight:bold;'>⏳ Loading...</p>";
        fetchWeather(city);
        cityInput.value = ""; // Clear the input field
    });

    // Keypress event to allow hitting "Enter" to search
    cityInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
}

// Initialize history on page load
loadHistory();