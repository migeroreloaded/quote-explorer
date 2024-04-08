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
});