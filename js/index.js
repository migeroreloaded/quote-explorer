document.addEventListener("DOMContentLoaded", function() {
    // function to fetch data from Quote Garden API
    function getQuotes() {
        return fetch('https://quote-garden.onrender.com/api/v3/quotes')
        .then(res => res.json())
        .then(quotes =>{
            return quotes;
        })
        .catch(error => {
             console.log('Error fetching quotes:', error);
        });
    };

    // fumction to display a random quote on the page
    function displayRandomQuote() {
        // Call the functionQuotes function to get quotes
        fetch('https://quote-garden.onrender.com/api/v3/quotes/random')
        .then(res => res.json())
        .then(quotes => {
            //Get a random quote from the feched quotes
            const randomQuote = quotes.data[0]; 
            //Display the author and text of the quote
            const quoteDisplay = document.getElementById('quoteDisplay');
            // Create a new div element to contain the quote
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote');
            quoteElement.innerHTML = `
                <p>${randomQuote.quoteText}</p>
                <span>- ${randomQuote.quoteAuthor} -</span>
            `;
            // Append the quote element to the quote display section
            quoteDisplay.innerHTML = '';
            quoteDisplay.appendChild(quoteElement);
        })
        .catch(error => {
             console.log('Error fetching random quotes:', error);
        });
    };

    // Call the displayRandomQuote function when the page loads
    displayRandomQuote();

    // Function to fetch genres from the API
    function getGenres() {
        return fetch('https://quote-garden.onrender.com/api/v3/genres')
        .then(res => res.json())
        .then(genres =>{
            return genres.data
        })
        .catch(error => {
             console.log('Error fetching genres:', error);
        });
    };

    function populateGenresFilter(genres) {
        const genresFilter = document.getElementById('genresFilter');
        genres.forEach(genre => {
            const optionElement = document.createElement('option');
            optionElement.value = genre;
            optionElement.innerText = genre;
            genresFilter.appendChild(optionElement);
        });
    };


    // Call the getGenres function when page loads
    getGenres()
    .then(genres => {
       populateGenresFilter(genres); 
    })

    // Add event listener to form
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('searchInput');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        searchQuotes(searchTerm)
            .then(filteredQuotes => {
                // Display the filtered quotes
                const quoteDisplay = document.getElementById('quoteDisplay');
                quoteDisplay.innerHTML = ''; // Clear previous quotes

                if (filteredQuotes.length === 0) {
                    quoteDisplay.innerHTML = '<p>No quotes found.</p>';
                } else {
                    filteredQuotes.forEach(quote => {
                        const quoteElement = document.createElement('div');
                        quoteElement.classList.add('quote');
                        quoteElement.innerHTML = `
                            <p>${quote.quoteText}</p>
                            <span>- ${quote.quoteAuthor} -</span>
                        `;
                        quoteDisplay.appendChild(quoteElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error searching quotes:', error);
            });
    });

    // Function to search quotes based on the search term
    function searchQuotes(searchTerm) {
        // Fetch quotes from the API
        return getQuotes()
            .then(quotes => {
                // Filter quotes based on the search term
                const filteredQuotes = quotes.data.filter(quote => {
                    return quote.quoteText.toLowerCase().includes(searchTerm.toLowerCase());
                });
                return filteredQuotes;
            })
            .catch(error => {
                console.error('Error fetching quotes:', error);
                return [];
            });
    }

});