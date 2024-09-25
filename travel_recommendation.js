// Função para buscar dados do arquivo JSON
const fetchTravelData = async () => {
    try {
        const response = await fetch('travel_recommendation_api.json'); // Substitua pelo caminho correto do seu arquivo JSON
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        const data = await response.json(); // Converte a resposta em JSON
        console.log(data); // Exibe os dados no console

        // Chama a função para exibir os dados
        displayTravelData(data); // Certifique-se de que "data" contém a estrutura esperada
    } catch (error) {
        console.error('Houve um problema com a operação de fetch:', error);
    }
};

// Função para exibir os dados no HTML
const displayTravelData = (data) => {
    const countriesContainer = document.getElementById('countries'); // O container para os países
    const templesContainer = document.getElementById('temples'); // O container para os templos
    const beachesContainer = document.getElementById('beaches'); // O container para as praias

    // Exibe os países e suas cidades
    if (Array.isArray(data.countries)) { // Verifica se é um array
        data.countries.forEach(country => {
            const countryElement = document.createElement('div');
            countryElement.innerHTML = `<h2>${country.name}</h2>`;
            
            if (Array.isArray(country.cities)) { // Verifica se "cities" é um array
                country.cities.forEach(city => {
                    const cityElement = document.createElement('div');
                    cityElement.innerHTML = `
                        <h3>${city.name}</h3>
                        <img src="${city.imageUrl}" alt="${city.name}" />
                        <p>${city.description}</p>
                    `;
                    countryElement.appendChild(cityElement);
                });
            }
            
            countriesContainer.appendChild(countryElement);
        });
    }

    // Exibe os templos
    if (Array.isArray(data.temples)) { // Verifica se "temples" é um array
        data.temples.forEach(temple => {
            const templeElement = document.createElement('div');
            templeElement.innerHTML = `
                <h3>${temple.name}</h3>
                <img src="${temple.imageUrl}" alt="${temple.name}" />
                <p>${temple.description}</p>
            `;
            templesContainer.appendChild(templeElement);
        });
    }

    // Exibe as praias
    if (Array.isArray(data.beaches)) { // Verifica se "beaches" é um array
        data.beaches.forEach(beach => {
            const beachElement = document.createElement('div');
            beachElement.innerHTML = `
                <h3>${beach.name}</h3>
                <img src="${beach.imageUrl}" alt="${beach.name}" />
                <p>${beach.description}</p>
            `;
            beachesContainer.appendChild(beachElement);
        });
    }
};

// Chama a função para buscar os dados ao carregar a página
fetchTravelData();
