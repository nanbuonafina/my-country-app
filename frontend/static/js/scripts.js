const apiUrl = 'http://127.0.0.1:8000/countries';

async function fetchCountries() {
    const search = document.getElementById('search').value;
    const region = document.getElementById('region').value;
    const populationRange = document.getElementById('populationRange').value;
    const orderBy = document.getElementById('orderBy').value;

    let url = `${apiUrl}?search=${search}&region=${region}&population_range=${populationRange}&order_by=${orderBy}`;

    const response = await fetch(url);
    const countries = await response.json();

    displayCountries(countries);
}

function displayCountries(countries) {
    const countriesList = document.getElementById('countriesList');
    countriesList.innerHTML = '';

    countries.forEach(country => {
        countriesList.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${country.flags.png}" class="card-img-top" alt="${country.name.common} flag">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text">Capital: ${country.capital}</p>
                        <p class="card-text">Region: ${country.region}</p>
                        <a href="country_details.html?country=${country.name.common}" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
        `;
    });
}

async function fetchCountryDetails() {
    const params = new URLSearchParams(window.location.search);
    const countryName = params.get('country');
    const url = `${apiUrl}/${countryName}`;

    const response = await fetch(url);
    const country = await response.json();

    const countryDetails = document.getElementById('countryDetails');
    countryDetails.innerHTML = `
        <div class="col-md-6">
            <img src="${country.flags.png}" class="img-fluid mb-4" alt="Flag of ${country.name.common}">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Area:</strong> ${country.area} km²</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Subregion:</strong> ${country.subregion}</p>
            <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
            <p><strong>Timezones:</strong> ${country.timezones.join(', ')}</p>
        </div>
    `;
}

if (window.location.pathname.includes('country_details.html')) {
    fetchCountryDetails();
} else {
    fetchCountries();
}