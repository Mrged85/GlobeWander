// Variável global para armazenar os dados
let travelData = null;

// Função para buscar dados do arquivo JSON
const fetchTravelData = async () => {
    try {
        const response = await fetch('travel_recommendation_api.json'); // Substitua pelo caminho correto do seu arquivo JSON
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        travelData = await response.json(); // Armazena os dados na variável global
        console.log(travelData); // Exibe os dados no console

        // Armazena os dados no localStorage para pesquisa
        localStorage.setItem('travelData', JSON.stringify(travelData)); // Salva os dados para pesquisa futura
    } catch (error) {
        console.error('Houve um problema com a operação de fetch:', error);
    }
};

// Função para exibir os dados no HTML
const displayTravelData = (data) => {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores
    resultsContainer.style.display = 'block'; // Exibe o container

    // Exibe os países e suas cidades
    if (Array.isArray(data.countries)) { // Verifica se é um array
        data.countries.forEach(country => {
            if (Array.isArray(country.cities)) { // Verifica se "cities" é um array
                country.cities.forEach(city => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';

                    const image = document.createElement('img');
                    image.src = city.imageUrl; // Caminho da imagem
                    image.alt = city.name;

                    const title = document.createElement('h4');
                    title.textContent = city.name;

                    const description = document.createElement('p');
                    description.textContent = city.description;

                    resultItem.appendChild(image);
                    resultItem.appendChild(title);
                    resultItem.appendChild(description);
                    resultsContainer.appendChild(resultItem);
                });
            }
        });
    }

    // Exibe os templos
    if (Array.isArray(data.temples)) { // Verifica se "temples" é um array
        data.temples.forEach(temple => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            const image = document.createElement('img');
            image.src = temple.imageUrl; // Caminho da imagem
            image.alt = temple.name;

            const title = document.createElement('h4');
            title.textContent = temple.name;

            const description = document.createElement('p');
            description.textContent = temple.description;

            resultItem.appendChild(image);
            resultItem.appendChild(title);
            resultItem.appendChild(description);
            resultsContainer.appendChild(resultItem);
        });
    }

    // Exibe as praias
    if (Array.isArray(data.beaches)) { // Verifica se "beaches" é um array
        data.beaches.forEach(beach => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            const image = document.createElement('img');
            image.src = beach.imageUrl; // Caminho da imagem
            image.alt = beach.name;

            const title = document.createElement('h4');
            title.textContent = beach.name;

            const description = document.createElement('p');
            description.textContent = beach.description;

            resultItem.appendChild(image);
            resultItem.appendChild(title);
            resultItem.appendChild(description);
            resultsContainer.appendChild(resultItem);
        });
    }
};

// Chama a função para buscar os dados quando a página carrega
window.onload = fetchTravelData;

// Adiciona a funcionalidade de pesquisa
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores

    if (travelData) {
        const filteredResults = [];

        // Filtra os resultados
        if (Array.isArray(travelData.countries)) {
            travelData.countries.forEach(country => {
                if (Array.isArray(country.cities)) {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query)) {
                            filteredResults.push(city);
                        }
                    });
                }
            });
        }

        // Adiciona os templos filtrados
        if (Array.isArray(travelData.temples)) {
            travelData.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(query)) {
                    filteredResults.push(temple);
                }
            });
        }

        // Adiciona as praias filtradas
        if (Array.isArray(travelData.beaches)) {
            travelData.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(query)) {
                    filteredResults.push(beach);
                }
            });
        }

        // Exibe os resultados filtrados
        filteredResults.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" />
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            `;
            resultsContainer.appendChild(resultItem);
        });

        resultsContainer.style.display = filteredResults.length ? 'block' : 'none'; // Mostra ou oculta resultados
    }
});

// Adiciona a funcionalidade de redefinir a pesquisa
document.getElementById('reset-button').addEventListener('click', () => {
    document.getElementById('search-input').value = ''; // Limpa o campo de pesquisa
    document.getElementById('results-container').style.display = 'none'; // Oculta resultados
});
