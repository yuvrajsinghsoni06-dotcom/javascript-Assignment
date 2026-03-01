// ================= API CONFIG =================
const API_KEY = "7b953070fd5a615ea59b73c535d29c00"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ================= DOM ELEMENTS =================
const weatherForm = document.getElementById("weather_form");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");
const eventConsole = document.getElementById("eventConsole");

// ================= EVENT LOOP LOGGER =================
function logEvent(msg, type = "sync") {
    if (!eventConsole) return; 

    const p = document.createElement("p");
    p.className = `log-${type}`;
    
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    p.textContent = `[${time}] ${msg}`;
    
    eventConsole.appendChild(p);
    eventConsole.scrollTop = eventConsole.scrollHeight; // Auto-scrolls to newest log
}

// ================= SHOW WEATHER (UPGRADED UI) =================
function displayWeather(data) {
    logEvent("Updating DOM with beautifully styled weather data", "sync");
    
    const country = data.sys && data.sys.country ? `, ${data.sys.country}` : "";
    const temp = Math.round(data.main.temp); 
    
    if (weatherResult) {
        weatherResult.innerHTML = `
            <div class="weather-card">
                <h4 class="weather-city">${data.name}${country}</h4>
                
                <div class="weather-main">
                    <span class="weather-temp">${temp}°C</span>
                    <span class="weather-cond">${data.weather[0].description}</span>
                </div>
                
                <div class="weather-details">
                    <div class="detail-box">
                        <span class="detail-icon">💧</span>
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${data.main.humidity}%</span>
                    </div>
                    <div class="detail-box">
                        <span class="detail-icon">💨</span>
                        <span class="detail-label">Wind</span>
                        <span class="detail-value">${data.wind.speed} m/s</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// ================= SAVE TO LOCAL STORAGE =================
function saveToLocalStorage(city) {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    } catch (e) {
        history = [];
    }

    const normalizedCity = city.toLowerCase();

    if (!history.includes(normalizedCity)) {
        history.push(normalizedCity);
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
    renderHistory();
}

// ================= RENDER HISTORY =================
function renderHistory() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    } catch (e) {
        history = [];
    }

    if (!historyList) return; 
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = "<p style='font-size: 14px; color: #666;'>No recent searches.</p>";
        return;
    }

    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        btn.addEventListener("click", () => {
            logEvent(`History button clicked: ${city}`, "system");
            fetchWeather(city);
        });

        historyList.appendChild(btn);
    });
}

// ================= FETCH WEATHER =================
async function fetchWeather(city) {
    logEvent(`fetchWeather('${city}') pushed to Call Stack`, "sync");
    
    try {
        if (weatherResult) weatherResult.innerHTML = "<p>Loading...</p>";

        logEvent("Initiating fetch() -> Handing off to Web APIs", "async");
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        logEvent("Network response received -> Microtask Queued", "async");
        logEvent("Executing Microtask to check response...", "sync");

        if (!response.ok) {
            throw new Error("City not found.");
        }

        logEvent("Parsing JSON data...", "async");
        const data = await response.json();
        
        logEvent("Data parsed successfully", "sync");
        displayWeather(data);
        saveToLocalStorage(city);

    } catch (error) {
        logEvent(`Error caught: ${error.message}`, "error");
        if (weatherResult) {
            weatherResult.innerHTML = `<p style="color:red; font-weight:bold; margin-top:20px;">❌ ${error.message}</p>`;
        }
    }
}

// ================= EVENT LISTENER =================
if (weatherForm) {
    weatherForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        
        const city = cityInput.value.trim();
        logEvent(`Form submitted for: ${city}`, "system");

        if (city === "") {
            alert("Please enter a city name");
            return;
        }

        fetchWeather(city);
        if (cityInput) cityInput.value = ""; 
    });
}

// ================= INITIALIZATION =================
logEvent("Initializing application...", "system");
renderHistory();