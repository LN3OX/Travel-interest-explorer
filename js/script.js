document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Enhanced Dark/Light Mode Toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        
        if (isDarkMode) {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Modo Light';
            localStorage.setItem('darkMode', 'true');
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Modo Dark';
            localStorage.setItem('darkMode', 'false');
        }
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        body.classList.add('dark-mode');
        document.getElementById('theme-icon').textContent = '☀️';
        document.getElementById('theme-text').textContent = 'Modo Light';
    }

    const travelQuizForm = document.getElementById('travel-quiz');
    const countryListDiv = document.getElementById('country-list');
    const resultsSection = document.getElementById('results-section');
    const manualFiltersSection = document.getElementById('manual-filters-section');
    const applyFiltersButton = document.getElementById('apply-filters');
    const clearFiltersButton = document.getElementById('clear-filters');
    const favoriteCountryListDiv = document.getElementById('favorite-country-list');
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesCount = document.getElementById('favorites-count');
    const clearFavoritesButton = document.getElementById('clear-favorites');

    let allCountriesData = []; // To store all countries fetched from API

    // Function to fetch countries from REST Countries API
    const fetchCountries = async () => {
        try {
            // Fetch all countries with necessary fields
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,languages,region,subregion');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allCountriesData = await response.json();
            console.log('Countries fetched:', allCountriesData);
        } catch (error) {
            console.error('Error fetching countries:', error);
            countryListDiv.innerHTML = '<p>Erro ao carregar países. Tente novamente mais tarde.</p>';
        }
    };

    // Function to display countries with enhanced design
    const displayCountries = (countries) => {
        countryListDiv.innerHTML = ''; // Clear previous results
        if (countries.length === 0) {
            countryListDiv.innerHTML = '<div class="no-results"><p>🔍 Nenhum país encontrado com os critérios selecionados.</p><p>Tente ajustar suas preferências!</p></div>';
            return;
        }

        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');

            const countryName = country.name.common;
            const flagUrl = country.flags.png;
            const capital = country.capital ? country.capital[0] : 'N/A';
            const population = country.population ? country.population.toLocaleString('pt-BR') : 'N/A';
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
            const region = country.region || 'N/A';
            const subregion = country.subregion || '';

            countryCard.innerHTML = `
                <div class="country-header">
                    <h3>${countryName}</h3>
                    <span class="region-badge">${region}</span>
                </div>
                <div class="flag-container">
                    <img src="${flagUrl}" alt="Bandeira de ${countryName}" loading="lazy">
                </div>
                <div class="country-info">
                    <div class="info-item">
                        <span class="info-icon">🏛️</span>
                        <span class="info-label">Capital:</span>
                        <span class="info-value">${capital}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">👥</span>
                        <span class="info-label">População:</span>
                        <span class="info-value">${population}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🗣️</span>
                        <span class="info-label">Idiomas:</span>
                        <span class="info-value">${languages}</span>
                    </div>
                    ${subregion ? `<div class="info-item">
                        <span class="info-icon">🌍</span>
                        <span class="info-label">Sub-região:</span>
                        <span class="info-value">${subregion}</span>
                    </div>` : ''}
                </div>
                <button class="save-country-btn" data-country-name="${countryName}">
                    🎒 Salvar na minha mochila
                </button>
            `;
            countryListDiv.appendChild(countryCard);
        });
    };

    // Enhanced Recommendation System
    const recommendCountries = (preferences) => {
        let filteredCountries = [...allCountriesData];
        let scoreMap = new Map();

        // Initialize scores for all countries
        filteredCountries.forEach(country => {
            scoreMap.set(country.name.common, 0);
        });

        // Climate scoring
        if (preferences.climate === 'cold') {
            filteredCountries.forEach(country => {
                if (['Europe', 'Asia'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
                if (country.subregion && (country.subregion.includes('Northern') || country.subregion.includes('Eastern'))) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        } else if (preferences.climate === 'hot') {
            filteredCountries.forEach(country => {
                if (['Africa', 'Oceania'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
                if (country.subregion && (country.subregion.includes('Southern') || country.subregion.includes('Central') || country.subregion.includes('Caribbean'))) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        } else if (preferences.climate === 'mild') {
            filteredCountries.forEach(country => {
                if (['Europe', 'Americas'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        }

        // Environment scoring
        if (preferences.environment === 'nature') {
            filteredCountries.forEach(country => {
                if (country.population < 10000000) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
                if (['Oceania', 'Americas'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        } else if (preferences.environment === 'city') {
            filteredCountries.forEach(country => {
                if (country.population >= 10000000) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
                if (['Europe', 'Asia'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        } else if (preferences.environment === 'both') {
            filteredCountries.forEach(country => {
                scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 1);
            });
        }

        // Budget scoring (simplified economic indicators)
        if (preferences.budget === 'low') {
            filteredCountries.forEach(country => {
                if (['Africa', 'Asia'].includes(country.region) && country.population < 50000000) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
            });
        } else if (preferences.budget === 'medium') {
            filteredCountries.forEach(country => {
                if (['Americas', 'Europe'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        } else if (preferences.budget === 'high') {
            filteredCountries.forEach(country => {
                if (['Europe', 'Oceania'].includes(country.region) || 
                    (country.subregion && country.subregion.includes('Western'))) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
            });
        }

        // Language filtering (strict filter)
        if (preferences.language) {
            const preferredLang = preferences.language.toLowerCase();
            filteredCountries = filteredCountries.filter(country => {
                if (country.languages) {
                    return Object.values(country.languages).some(lang => 
                        lang.toLowerCase().includes(preferredLang) ||
                        preferredLang.includes(lang.toLowerCase())
                    );
                }
                return false;
            });
        }

        // Interest scoring
        if (preferences.interest === 'beach') {
            filteredCountries.forEach(country => {
                if (['Oceania', 'Americas'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
                if (country.subregion && (country.subregion.includes('Caribbean') || country.subregion.includes('Polynesia'))) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
            });
        } else if (preferences.interest === 'mountain') {
            filteredCountries.forEach(country => {
                if (['Europe', 'Asia', 'Americas'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 2);
                }
                if (country.subregion && (country.subregion.includes('Central') || country.subregion.includes('Southern'))) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 1);
                }
            });
        } else if (preferences.interest === 'history') {
            filteredCountries.forEach(country => {
                if (['Europe', 'Asia', 'Africa'].includes(country.region)) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 3);
                }
                if (country.subregion && (country.subregion.includes('Southern') || country.subregion.includes('Western'))) {
                    scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 1);
                }
            });
        } else if (preferences.interest === 'all') {
            filteredCountries.forEach(country => {
                scoreMap.set(country.name.common, scoreMap.get(country.name.common) + 1);
            });
        }

        // Sort by score and take top recommendations
        filteredCountries.sort((a, b) => {
            const scoreA = scoreMap.get(a.name.common);
            const scoreB = scoreMap.get(b.name.common);
            return scoreB - scoreA;
        });

        // Limit to top 20 recommendations
        const topRecommendations = filteredCountries.slice(0, 20);

        displayCountries(topRecommendations);
        resultsSection.style.display = 'block';
        manualFiltersSection.style.display = 'block';
        favoritesSection.style.display = 'block';
    };

    // Event listener for quiz form submission
    travelQuizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(travelQuizForm);
        const preferences = {};
        for (let [key, value] of formData.entries()) {
            preferences[key] = value;
        }
        recommendCountries(preferences);
    });

    // Manual Filters
    applyFiltersButton.addEventListener('click', () => {
        let currentFilteredCountries = [...allCountriesData];

        const filterLanguage = document.getElementById('filter-language').value.toLowerCase();
        const filterMinPopulation = parseInt(document.getElementById('filter-min-population').value);
        const filterMaxPopulation = parseInt(document.getElementById('filter-max-population').value);
        const filterContinent = document.getElementById('filter-continent').value;

        if (filterLanguage) {
            currentFilteredCountries = currentFilteredCountries.filter(country => 
                country.languages && Object.values(country.languages).some(lang => lang.toLowerCase().includes(filterLanguage))
            );
        }

        if (!isNaN(filterMinPopulation)) {
            currentFilteredCountries = currentFilteredCountries.filter(country => country.population >= filterMinPopulation);
        }

        if (!isNaN(filterMaxPopulation)) {
            currentFilteredCountries = currentFilteredCountries.filter(country => country.population <= filterMaxPopulation);
        }

        if (filterContinent) {
            currentFilteredCountries = currentFilteredCountries.filter(country => country.region === filterContinent);
        }

        displayCountries(currentFilteredCountries);
    });

    // Save to Backpack (Favorites)
    countryListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('save-country-btn')) {
            const countryName = e.target.dataset.countryName;
            const countryToSave = allCountriesData.find(country => country.name.common === countryName);
                if (countryToSave) {
                    let favorites = JSON.parse(localStorage.getItem('favoriteCountries')) || [];
                    if (!favorites.some(fav => fav.name.common === countryName)) {
                        favorites.push(countryToSave);
                        localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
                        displayFavorites();
                        updateFavoritesCount();
                        alert(`${countryName} foi adicionado à sua mochila!`);
                    } else {
                        alert(`${countryName} já está na sua mochila.`);
                    }
                }
        }
    });

    const displayFavorites = () => {
        favoriteCountryListDiv.innerHTML = '';
        let favorites = JSON.parse(localStorage.getItem('favoriteCountries')) || [];

        if (favorites.length === 0) {
            favoriteCountryListDiv.innerHTML = '<p>Sua mochila está vazia.</p>';
            return;
        }

        favorites.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');

            const countryName = country.name.common;
            const flagUrl = country.flags.png;
            const capital = country.capital ? country.capital[0] : 'N/A';
            const population = country.population ? country.population.toLocaleString() : 'N/A';
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';

            countryCard.innerHTML = `
                <h3>${countryName}</h3>
                <img src="${flagUrl}" alt="Bandeira de ${countryName}">
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>População:</strong> ${population}</p>
                <p><strong>Idiomas:</strong> ${languages}</p>
                <button class="remove-country-btn" data-country-name="${countryName}">Remover da mochila</button>
            `;
            favoriteCountryListDiv.appendChild(countryCard);
        });
    };

    // Remove from Favorites
    favoriteCountryListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-country-btn')) {
            const countryName = e.target.dataset.countryName;
            let favorites = JSON.parse(localStorage.getItem('favoriteCountries')) || [];
            favorites = favorites.filter(fav => fav.name.common !== countryName);
            localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
            displayFavorites();
            updateFavoritesCount();
            alert(`${countryName} foi removido da sua mochila.`);
        }
    });

    // Initial fetch of countries and display favorites
    fetchCountries();
    displayFavorites();
    updateFavoritesCount();
});



    // Clear Filters functionality
    clearFiltersButton.addEventListener('click', () => {
        document.getElementById('filter-language').value = '';
        document.getElementById('filter-min-population').value = '';
        document.getElementById('filter-max-population').value = '';
        document.getElementById('filter-continent').value = '';
        
        // Reset to show all countries
        displayCountries(allCountriesData.slice(0, 20));
    });

    // Clear Favorites functionality
    clearFavoritesButton.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar toda a sua mochila?')) {
            localStorage.removeItem('favoriteCountries');
            displayFavorites();
        }
    });

    // Update favorites count
    const updateFavoritesCount = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteCountries')) || [];
        favoritesCount.textContent = `${favorites.length} países salvos`;
    };

    // Enhanced displayFavorites function
    const displayFavorites = () => {
        favoriteCountryListDiv.innerHTML = '';
        let favorites = JSON.parse(localStorage.getItem('favoriteCountries')) || [];
        updateFavoritesCount();

        if (favorites.length === 0) {
            favoriteCountryListDiv.innerHTML = '<div class="no-results"><p>🎒 Sua mochila está vazia.</p><p>Comece a explorar países e salve seus favoritos!</p></div>';
            return;
        }

        favorites.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');

            const countryName = country.name.common;
            const flagUrl = country.flags.png;
            const capital = country.capital ? country.capital[0] : 'N/A';
            const population = country.population ? country.population.toLocaleString('pt-BR') : 'N/A';
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
            const region = country.region || 'N/A';
            const subregion = country.subregion || '';

            countryCard.innerHTML = `
                <div class="country-header">
                    <h3>${countryName}</h3>
                    <span class="region-badge">${region}</span>
                </div>
                <div class="flag-container">
                    <img src="${flagUrl}" alt="Bandeira de ${countryName}" loading="lazy">
                </div>
                <div class="country-info">
                    <div class="info-item">
                        <span class="info-icon">🏛️</span>
                        <span class="info-label">Capital:</span>
                        <span class="info-value">${capital}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">👥</span>
                        <span class="info-label">População:</span>
                        <span class="info-value">${population}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🗣️</span>
                        <span class="info-label">Idiomas:</span>
                        <span class="info-value">${languages}</span>
                    </div>
                    ${subregion ? `<div class="info-item">
                        <span class="info-icon">🌍</span>
                        <span class="info-label">Sub-região:</span>
                        <span class="info-value">${subregion}</span>
                    </div>` : ''}
                </div>
                <button class="remove-country-btn" data-country-name="${countryName}">
                    🗑️ Remover da mochila
                </button>
            `;
            favoriteCountryListDiv.appendChild(countryCard);
        });
    };

