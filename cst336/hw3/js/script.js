// Global variables
const API_KEY = "67a40c96b506d0722e886519b79d7aee";
const GEO_ZIP = "https://api.openweathermap.org/geo/1.0/zip";
const GEO_DIRECT = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER = "https://api.openweathermap.org/data/2.5/weather";

// Elements
const $ = (s) => document.querySelector(s); //reduce code verbosity with alias "$"
const form = $("#weatherForm");
const errorEl = $("#formError");
const zipGroup = $("#zipGroup");
const placeGroup = $("#placeGroup");
const zipEl = $("#zip");
const cityEl = $("#city");
const stateEl = $("#state");
const choicesEl = $("#choices");
const resultsEl = $("#results");

const showError = (m = "") => (errorEl.textContent = m);
const clearUI = () => { choicesEl.innerHTML = ""; resultsEl.innerHTML = ""; };

// ZIP validation: exactly 5 digits
function validZip(z) { return /^\d{5}$/.test(z.trim()); }

// Render weather card
function renderWeatherCard(loc, weather) {
    const name = `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`;
    const w = weather.weather?.[0] || {};
    const iconUrl = w.icon ? `https://openweathermap.org/img/wn/${w.icon}@2x.png` : "";
    const temp = Math.round(weather.main?.temp);
    const feels = Math.round(weather.main?.feels_like);

    resultsEl.innerHTML = `
    <article class="card">
      <div class="place">${name}</div>
      <div class="weather">
        ${iconUrl ? `<img class="icon" src="${iconUrl}" alt="${w.description || ""}">` : ""}
        <div>
          <div class="temp">${temp}°F</div>
          <div class="hint">Feels like ${feels}°F • ${w.description || "—"}</div>
        </div>
      </div>
      <div class="meta">
        <div class="tile"><div class="label">Humidity</div><div class="value">${weather.main?.humidity ?? "—"}%</div></div>
        <div class="tile"><div class="label">Wind</div><div class="value">${weather.wind?.speed?.toFixed?.(1) ?? "—"} mph</div></div>
        <div class="tile"><div class="label">Pressure</div><div class="value">${weather.main?.pressure ?? "—"} hPa</div></div>
        <div class="tile"><div class="label">Coordinates</div><div class="value">${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}</div></div>
      </div>
    </article>
  `;
}

// Fetch weather data given coordinates
async function getWeather(lat, lon) {
    const url = `${WEATHER}?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
    const r = await fetch(url);
    return r.json();
}

// Get coordinates from zip code
async function lookupZip(zip) {
    const url = `${GEO_ZIP}?zip=${encodeURIComponent(zip)},US&appid=${API_KEY}`;
    const r = await fetch(url);
    const g = await r.json();
    const weather = await getWeather(g.lat, g.lon);
    renderWeatherCard({ name: g.name, country: g.country, state: "", lat: g.lat, lon: g.lon }, weather);
}

// Get one or more place names by city and optional state name
async function lookupPlace(city, stateOpt) {
    const q = `${city}${stateOpt ? "," + stateOpt : ""}`;
    const url = `${GEO_DIRECT}?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`;
    const r = await fetch(url);
    const arr = await r.json();
    if (!arr.length) { showError("No matching locations found."); return; }

    if (arr.length === 1) {
        const g = arr[0];
        const weather = await getWeather(g.lat, g.lon);
        renderWeatherCard(g, weather);
    } else {
        // Generate cards to select locations returned by geo API
        choicesEl.innerHTML = arr.map((g, i) => `
      <div class="choice-card">
        <div>
          <strong>${g.name}${g.state ? ", " + g.state : ""}, ${g.country}</strong>
          <div class="choice-meta">${g.lat.toFixed(3)}, ${g.lon.toFixed(3)}</div>
        </div>
        <button data-choice="${i}" type="button" class="btn">Select</button>
      </div>
    `).join("");
        // Add event listeners to the "Select" buttons, 
        // each containing a "data-choice" attribute
        choicesEl.addEventListener("click", async (ev) => {
            const btn = ev.target.closest("button[data-choice]");
            if (!btn) return;
            const g = arr[Number(btn.dataset.choice)];
            clearUI();
            const weather = await getWeather(g.lat, g.lon);
            renderWeatherCard(g, weather);
        }, { once: true });
    }
}

// Event listeners
// Toggle between searching by zip or by place name
form.addEventListener("change", (e) => {
    if (e.target.name !== "mode") return;
    const mode = e.target.value;
    zipGroup.classList.toggle("hidden", mode !== "zip");
    placeGroup.classList.toggle("hidden", mode !== "place");
    showError(""); clearUI();
});

// Handle form submit event
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError(""); clearUI();

    const mode = new FormData(form).get("mode");

    try {
        if (mode === "zip") {
            try {
                const zip = zipEl.value.trim();
                if (!validZip(zip)) {
                    showError("Please enter a valid 5-digit ZIP.");
                    return;
                }
                await lookupZip(zip);
            }
            catch {
                showError("Please enter a valid ZIP code.");
            }
        } else {
            const city = cityEl.value.trim();
            if (!city) { showError("Please enter a city."); return; }
            await lookupPlace(city, stateEl.value.trim());
        }
    } catch {
        showError("Something went wrong. Try again.");
    }
});