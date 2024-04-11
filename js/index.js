document.addEventListener("DOMContentLoaded", function() {
    //Display the author and text of the quote
    const randomQuoteDisplay = document.getElementById('randomQuoteDisplay');
    const searchQuoteDisplay = document.getElementById('searchQuoteDisplay');
    const likedQuotesDisplay = document.getElementById('likedQuoteDisplay');
    const viewLikedQuotesBtn = document.getElementById('viewSavedQuotesBtn');
    const genresFilter = document.getElementById('genresFilter');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('searchInput');
    const themeToggleBtn = document.getElementById('themeToggle');

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

    // function to display a random quote on the page
    function displayRandomQuote() {
        // Call the functionQuotes function to get quotes
        fetch('https://quote-garden.onrender.com/api/v3/quotes/random')
        .then(res => res.json())
        .then(quotes => {
            //Get a random quote from the feched quotes
            const randomQuote = quotes.data[0];
            const heading = randomQuoteDisplay.querySelector('h2');
            // Create a new div element to contain the quote
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote');
            quoteElement.innerHTML = `
                <p>${randomQuote.quoteText}</p>
                <span>- ${randomQuote.quoteAuthor} -</span>
            `;
            // Append the quote element to the quote display section
            randomQuoteDisplay.innerHTML = '';
            // Append the <h2> element back
            if (heading) {
                randomQuoteDisplay.appendChild(heading);
            }
            randomQuoteDisplay.appendChild(quoteElement);
        })
        .catch(error => {
             console.log('Error fetching random quotes:', error);
        });
    };

    function populateGenresFilter(genres) {
        genres.forEach(genre => {
            const optionElement = document.createElement('option');
            optionElement.value = genre;
            optionElement.innerText = genre;
            genresFilter.appendChild(optionElement);
        });
    };

    // Add event listener to form
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        const selectedGenre = genresFilter.value.trim();

        searchQuotes(searchTerm, selectedGenre)
            .then(filteredQuotes => {
                // Display the filtered quotes
                const heading = searchQuoteDisplay.querySelector('h2');
                searchQuoteDisplay.innerHTML = ''; // Clear previous quotes

                if (heading) {
                    searchQuoteDisplay.appendChild(heading);
                }

                if (filteredQuotes.length === 0) {
                    searchQuoteDisplay.innerHTML = '<p>No quotes found.</p>';
                } else {
                    filteredQuotes.forEach(quote => {
                        const quoteElement = document.createElement('div');
                        quoteElement.classList.add('quote');
                        quoteElement.innerHTML = `
                            <p>${quote.quoteText}</p>
                            <span>- ${quote.quoteAuthor} -</span>
                            <br>
                            <br>
                            <button class="like-btn" data-id="${quote._id}">
                                <svg class="heart" viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 28.8C15.6 28.8 15.2 28.7 14.8 28.6C9.2 26.7 0 20.6 0 9.9C0 4.5 4.5 0 9.9 0C12.7 0 15.1 1.5 16 3.8C16.9 1.5 19.3 0 22.1 0C27.5 0 32 4.5 32 9.9C32 20.6 22.8 26.7 17.2 28.6C16.8 28.7 16.4 28.8 16 28.8Z"/>
                                </svg>
                            </button>
                        `;
                        searchQuoteDisplay.appendChild(quoteElement);

                        // Add event listener to the like button
                        const likeButton = quoteElement.querySelector('.like-btn');
                        likeButton.addEventListener('click', () => {
                            const quoteId = likeButton.dataset.id;
                            likeButton.classList.toggle('clicked');
                            saveLikedQuote(quoteId); // Save liked quote
                        });                        

                    });
                }
            })
            .catch(error => {
                console.error('Error searching quotes:', error);
            });
    });

    // Function to save liked quotes to localStorage
    function saveLikedQuote(quoteId) {
        let likedQuotes = JSON.parse(localStorage.getItem('likedQuotes')) || [];
        // Check if the quoteId is already saved to prevent duplicates
        if (!likedQuotes.includes(quoteId)) {
            likedQuotes.push(quoteId);
            localStorage.setItem('likedQuotes', JSON.stringify(likedQuotes));
            console.log(`Liked quote with ID ${quoteId} saved to localStorage`);
        } else {
            console.log(`Quote with ID ${quoteId} is already liked.`);
        }
    }

    // Function to load liked quotes from localStorage using only quoteId
    function loadLikedQuotes() {
        const likedQuoteIds = JSON.parse(localStorage.getItem('likedQuotes')) || [];
        console.log('Retrieved liked quote IDs from localStorage:', likedQuoteIds);
        return likedQuoteIds;
    }

    // Function to display liked quotes
    function displayLikedQuotes() {
        const likedQuoteIds = loadLikedQuotes();
        const heading = likedQuotesDisplay.querySelector('h2');
        likedQuotesDisplay.innerHTML = ''; // Clear previous liked quotes

        if (heading) {
            likedQuotesDisplay.appendChild(heading);
        }

        if (likedQuoteIds.length === 0) {
            likedQuotesDisplay.innerHTML = '<p>No liked quotes found.</p>';
        } else {
            getQuotes()
            // fetch('../db.json')
            //.then(response => response.json())
            .then(quotes => {
                likedQuoteIds.forEach(quoteId => {
                    // Convert the quoteId to integer for comparison
                    const id = (quoteId);
                    // Fetch quote details from localStorage using the quoteId
                    const savedQuote = quotes.data.find(quote => quote._id === id);
                    // const savedQuote = quotes.genres.find(quote => quote.id === id);
                    if (savedQuote) {
                        const savedQuoteElement = document.createElement('div');
                        savedQuoteElement.classList.add('quote');
                        savedQuoteElement.innerHTML = `
                            <p>${savedQuote.quoteText}</p>
                            <span>- ${savedQuote.quoteAuthor} -</span>
                        `;
                        likedQuotesDisplay.appendChild(savedQuoteElement);
                    }
                });
            });
        }
    }

    // Event listener for the "View Liked Quotes" button
    // viewLikedQuotesBtn.addEventListener('click', () => {
        displayLikedQuotes();
    // });

    // Function to search quotes based on the search term
    function searchQuotes(searchTerm, genre) {
        // Fetch quotes from the API
        return getQuotes()
        // return fetch('../db.json')
            // .then(response => response.json())
            .then(quotes => {
                // Filter quotes based on the search term and genre
                let filteredQuotes = quotes.data.filter(quote => {
                // let filteredQuotes = quotes.genres.filter(quote => {
                    const matchSearchTerm = quote.quoteText.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchGenre = genre === 'All genres' || quote.quoteGenre.toLowerCase() === genre.toLowerCase();
                    return matchSearchTerm && matchGenre;
                });
                return filteredQuotes;
            })
            .catch(error => {
                console.error('Error fetching quotes:', error);
                return [];
            });
    }
    
    // Function to toggle between light and dark themes
    function toggleDarkMode() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('dark-theme', document.body.classList.contains('dark-theme')? 'dark' : 'light');
    }

    // Initialize theme based on previous choice
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-theme');
    }

    // Add event listener to the theme toggle button
    themeToggleBtn.addEventListener('click', toggleDarkMode);

    // Call the displayRandomQuote function when the page loads
    displayRandomQuote();

    // Call the getGenres function when page loads
    getGenres()
    .then(genres => {
       populateGenresFilter(['All genres', ...genres]); 
    })

});
  