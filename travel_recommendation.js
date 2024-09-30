// Variável global para armazenar os dados
let travelData = null;

// Função para pré-carregar imagens
const preloadImages = (data) => {
    const imageUrls = [];

    // Coleta todas as URLs de imagens das cidades
    if (Array.isArray(data.countries)) {
        data.countries.forEach(country => {
            if (Array.isArray(country.cities)) {
                country.cities.forEach(city => {
                    imageUrls.push(city.imageUrl);
                });
            }
        });
    }

    // Coleta todas as URLs de imagens dos templos
    if (Array.isArray(data.temples)) {
        data.temples.forEach(temple => {
            imageUrls.push(temple.imageUrl);
        });
    }

    // Coleta todas as URLs de imagens das praias
    if (Array.isArray(data.beaches)) {
        data.beaches.forEach(beach => {
            imageUrls.push(beach.imageUrl);
        });
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block'; // Mostra o indicador de carregamento
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    // Pré-carrega cada imagem
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none'; // Esconde o indicador após o carregamento
                }
                console.log('Todas as imagens foram pré-carregadas.');
            }
        };
        img.onerror = () => {
            loadedCount++;
            console.warn(`Falha ao carregar a imagem: ${url}`);
            if (loadedCount === totalImages) {
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none'; // Esconde o indicador após o carregamento
                }
                console.log('Todas as imagens foram pré-carregadas (com falhas).');
            }
        };
    });
};

// Função para buscar dados do arquivo JSON
const fetchTravelData = async () => {
    try {
        const response = await fetch('travel_recommendation_api.json'); // Substitua pelo caminho correto do seu arquivo JSON
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        travelData = await response.json(); // Armazena os dados na variável global
        console.log('Dados de viagem carregados:', travelData); // Exibe os dados no console

        // Armazena os dados no localStorage para pesquisa
        localStorage.setItem('travelData', JSON.stringify(travelData)); // Salva os dados para pesquisa futura

        // Pré-carrega as imagens
        preloadImages(travelData);

        // Exibe os dados de viagem após o carregamento das imagens
        displayCountries(); // Exibe os países e cidades após carregar as imagens
    } catch (error) {
        console.error('Houve um problema com a operação de fetch:', error);
    }
};

// Função para exibir países e suas cidades
function displayCountries() {
    const resultsContainer = document.getElementById('results'); // O container onde os resultados são exibidos
    resultsContainer.innerHTML = ''; // Limpa os resultados anteriores

    if (Array.isArray(travelData.countries)) { // Verifica se é um array
        travelData.countries.forEach(country => {
            console.log(`Verificando país: ${country.name}`); // Debug: mostra o país sendo verificado
            if (Array.isArray(country.cities)) { // Verifica se "cities" é um array
                country.cities.forEach(city => {
                    console.log(`Exibindo cidade: ${city.name}`); // Debug: mostra a cidade sendo exibida
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
            } else {
                console.warn(`Não há cidades para o país: ${country.name}`); // Mensagem de alerta
            }
        });
    } else {
        console.error('Não é um array de países'); // Mensagem de erro
    }
}

// Chama a função para buscar os dados quando a página carrega
window.onload = fetchTravelData;

// Adiciona a funcionalidade de pesquisa com filtragem por categorias
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores

    if (travelData) {
        let filteredResults = [];

        // Verifica se a consulta corresponde a uma categoria específica
        if (query === 'country') {
            if (Array.isArray(travelData.countries)) {
                travelData.countries.forEach(country => {
                    filteredResults.push(country);
                });
            }
        } else if (query === 'temple') {
            if (Array.isArray(travelData.temples)) {
                travelData.temples.forEach(temple => {
                    filteredResults.push(temple);
                });
            }
        } else if (query === 'beach') {
            if (Array.isArray(travelData.beaches)) {
                travelData.beaches.forEach(beach => {
                    filteredResults.push(beach);
                });
            }
        } else {
            // Pesquisa padrão por nome em todas as categorias
            // Filtra Cidades
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

            // Filtra Templos
            if (Array.isArray(travelData.temples)) {
                travelData.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(query)) {
                        filteredResults.push(temple);
                    }
                });
            }

            // Filtra Praias
            if (Array.isArray(travelData.beaches)) {
                travelData.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(query)) {
                        filteredResults.push(beach);
                    }
                });
            }
        }

        if (filteredResults.length > 0) {
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
            resultsContainer.style.display = 'block'; // Mostra resultados
        } else {
            // Mostra mensagem de nenhum resultado encontrado
            resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            resultsContainer.style.display = 'block';
        }
    }
});

// Adiciona a funcionalidade de redefinir a pesquisa
document.getElementById('reset-button').addEventListener('click', () => {
    document.getElementById('search-input').value = ''; // Limpa o campo de pesquisa
    document.getElementById('results-container').style.display = 'none'; // Oculta resultados
});
