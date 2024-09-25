from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite que qualquer frontend consuma a API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para listar os países
@app.get("/countries/")
async def get_countries(
    search: str = None,
    region: str = None,
    subregion: str = None,
    population_range: str = None,
    order_by: str = None,
):
    url = "https://restcountries.com/v3.1/all"
    response = requests.get(url)
    countries = response.json()

    # Filtros
    if search:
        countries = [country for country in countries if search.lower() in country["name"]["common"].lower()]
    if region:
        countries = [country for country in countries if country.get("region") == region]
    if subregion:
        countries = [country for country in countries if country.get("subregion") == subregion]
    if population_range:
        if population_range == "<1M":
            countries = [country for country in countries if country.get("population", 0) < 1_000_000]
        elif population_range == "1M-10M":
            countries = [country for country in countries if 1_000_000 <= country.get("population", 0) < 10_000_000]
        elif population_range == "10M-100M":
            countries = [country for country in countries if 10_000_000 <= country.get("population", 0) < 100_000_000]
        elif population_range == ">100M":
            countries = [country for country in countries if country.get("population", 0) >= 100_000_000]

    # Ordenação
    if order_by == "name":
        countries = sorted(countries, key=lambda x: x["name"]["common"])
    elif order_by == "population":
        countries = sorted(countries, key=lambda x: x.get("population", 0), reverse=True)
    elif order_by == "area":
        countries = sorted(countries, key=lambda x: x.get("area", 0), reverse=True)

    return countries

# Endpoint para detalhes de um país específico
@app.get("/countries/{country_name}")
async def get_country_details(country_name: str):
    url = f"https://restcountries.com/v3.1/name/{country_name}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()[0]
    return {"error": "Country not found"}