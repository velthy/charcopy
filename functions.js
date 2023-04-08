// Set focus on the search input
document.querySelector('input[type="search"]').focus();

// Reset the search when the reset button is clicked
document.addEventListener('click', function(e) {
	if (e.target.matches('.reset-search')) {
		document.querySelector('input[type="search"]').value = '';
		document.querySelectorAll('.char-cards .char').forEach(function(char) {
			char.style.display = 'block';
		});
		e.target.classList.add('hidden');
		e.preventDefault();
  	}
});

// Listen for key events to activate search input
document.addEventListener('keyup', function(e) {
	if (e.keyCode === 83 || e.keyCode === 70) { // s(earch), f(ind), or esc
		if (document.querySelector('input[type="search"]') !== document.activeElement) {
			document.querySelector('input[type="search"]').value = '';
			document.querySelector('input[type="search"]').focus();
		}
	}
	if (e.keyCode === 27) { // esc
		document.querySelector('input[type="search"]').value = '';
		document.querySelector('input[type="search"]').focus();
	}
});


document.querySelectorAll('input[type="search"]').forEach(function(input) {
	input.addEventListener('keyup', function() {
	  var search_term = this.value.toLowerCase();
		document.querySelectorAll('.char-cards .char').forEach(function(char) {
			if (char.getAttribute('data-search-term').toLowerCase().includes(search_term) || search_term.length < 1) {
				char.style.display = 'block';
			} else {
				char.style.display = 'none';
			}
		});
		window.scrollTo(0, 0);
		if (this.value !== '') {
			document.querySelector('.reset-search').classList.remove('hidden');
		}
	});
});

/**
 * Darkmode.
 */

(() => {
	const modeToggle = document.getElementById( 'dark-mode-toggle' );
	if (!modeToggle) {
	  return;
	}

	let activeMode = localStorage.getItem( 'charcopy-mode' );

	const setMode = (isDark, isUserTriggered) => {
		localStorage.setItem('charcopy-mode', isDark ? 'dark' : 'light');
		modeToggle.checked = isDark ? true : false;

		const applyModeClasses = () => {
			if (isDark) {
				document.body.classList.add( 'dark-mode' );
				document.body.classList.remove( 'light-mode' );
			} else {
				document.body.classList.add( 'light-mode' );
				document.body.classList.remove( 'dark-mode' );
			}
		};

		if (isUserTriggered) {
			document.body.classList.add( 'mode-switching' );
			setTimeout(() => {
				document.body.classList.remove( 'mode-switching' );
			}, 1000);

			setTimeout( applyModeClasses, 400 );
		} else {
			applyModeClasses();
		}
	};

	// When no mode was set, get current system default.
	if (!activeMode) {
		activeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	// Set mode based on localStorage or default system setting.
	setMode('dark' === activeMode, false);

	// Set mode based on toggle.
	modeToggle.addEventListener('click', (e) => {
		setMode(e.target.checked, true);
	});
})();

// define the color options
const colorOptions = {
	yellow: 'color-scheme-yellow',
	green: 'color-scheme-green',
	blue: 'color-scheme-blue',
	purple: 'color-scheme-purple',
	pink: 'color-scheme-pink'
};

// Define the favicon options
const faviconOptions = {
	yellow: 'favicon-yellow.ico',
	green: 'favicon-green.ico',
	blue: 'favicon-blue.ico',
	purple: 'favicon-purple.ico',
	pink: 'favicon-pink.ico'
};

// check if there is a color preference stored in localStorage
const colorPref = localStorage.getItem( 'colorPref' );

// if there is a color preference, use it, otherwise use the default color
const initialColor = colorPref ? colorOptions[colorPref] : colorOptions.yellow;

// set the initial color
setTheme( initialColor );

// attach event listeners to the color switcher buttons
Object.keys(colorOptions).forEach(color => {
	const button = document.getElementById(`${color}-button`);
	button.addEventListener('click', () => {
		localStorage.setItem('colorPref', color);
		updateFavicon( color );

		setTimeout(() => {
			setTheme(colorOptions[color]);
		}, 400);

		document.body.classList.add( 'mode-switching' );
		setTimeout(() => {
			document.body.classList.remove( 'mode-switching' );
		}, 1000);

		Object.keys(colorOptions).forEach(otherColor => {
			const otherButton = document.getElementById(`${otherColor}-button`);
			if (color === otherColor) {
				otherButton.classList.add('current');
			} else {
				otherButton.classList.remove('current');
			}
		});
	});
});

// set the theme of the page
function setTheme(theme) {
	document.body.classList.forEach(className => {
		if (className.startsWith( 'color-scheme-' )) {
		  document.body.classList.remove(className);
		}
	});
	document.body.classList.add(theme);

	Object.keys(colorOptions).forEach(color => {
		const button = document.getElementById(`${color}-button`);
		if (theme === colorOptions[color]) {
			button.classList.add('current');
		} else {
			button.classList.remove('current');
		}
	});
}

// Update the favicon according to the current color
function updateFavicon(color) {
	const favicon = document.querySelector("link[rel*='icon']");
	favicon.href = faviconOptions[color];
}

// Update the initial favicon
updateFavicon(colorPref ? colorPref : 'yellow');



// Load characters dynamically

const charactersContainer = document.querySelector( "#characters-container" );
const loadingMessage = document.querySelector( "#loading-message" );

function renderCharacters(characters) {
	loadingMessage.style.display = "none";
	charactersContainer.classList.remove( "loading" );

	characters.forEach(character => {
		const charElement = document.createElement("div");
		charElement.classList.add("char");
		if (character.searchTerm === "shrug") {
			charElement.classList.add("shrug");
		}
		charElement.setAttribute("data-search-term", character.searchTerm);

		const charButton = document.createElement("button");
		charButton.classList.add("char-button");
		charButton.setAttribute("data-clipboard-text", character.clipboardText);
		charButton.innerHTML = character.character;

		charElement.appendChild(charButton);
		charactersContainer.appendChild(charElement);
	});
}
fetch( "characters.json" )
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error('Network response was not ok');
		}
	})
	.then(characters => {
		// Cache the characters.json file
		caches.open('offline-cache').then(cache => {
			cache.put('characters.json', new Response(JSON.stringify(characters)));
		});

		// Render the characters on the page
		renderCharacters(characters);
	})
	.catch(error => {
		console.log('Fetch error:', error);

		// If the user is offline, try to get the characters.json file from the cache
		caches.match('characters.json').then(response => {
			if (response) {
				return response.json();
			}
		}).then(characters => {
			// If the characters are found in the cache, render them on the page
			if (characters) {
				renderCharacters(characters);
			} else {
				// If the characters are not found in the cache, display an error message
				loadingMessage.innerHTML = "Unable to load characters";
			}
		});
	});


// Copy characters to clipboard
charactersContainer.addEventListener("click", function(event) {
	if (event.target.classList.contains("char-button")) {
		var charText = event.target.getAttribute("data-clipboard-text");
		navigator.clipboard
			.writeText(charText)
			.then(function() {
				var confirmationText =
				'<span class="character">' +
				charText +
				'</span><span class="message"> copied to clipboard</span>';
		  		var confirmationElement = document.getElementById("confirmation-message");
		  		var confirmationInnerElement = confirmationElement.querySelector(
				".copy-confirmation-inner"
			);
			confirmationInnerElement.innerHTML = confirmationText;
			confirmationElement.classList.add("visible");
			setTimeout(function() {
				confirmationElement.classList.remove("visible");
				}, 750); // Remove "visible" class after 750 ms
			})
		.catch(function() {
			console.error("Failed to copy to clipboard");
		});
	}
});

// Offline Mode
document.addEventListener('DOMContentLoaded', () => {
	function updateOnlineStatus() {
		const offlineTextDiv = document.querySelector('.offline-text');
		const body = document.body;

	 	if (navigator.onLine) {
			body.classList.remove('offline-mode');
			// Remove the offline-text div when online
			if (offlineTextDiv && body) {
				body.removeChild(offlineTextDiv);
			}
		} else {
			body.classList.add('offline-mode');
			// Add the offline-text div when offline
			if (!offlineTextDiv && body) {
				const newOfflineTextDiv = document.createElement('div');
				newOfflineTextDiv.classList.add('offline-text');
				newOfflineTextDiv.innerText = 'You are offline. But no worries, the app still works!';
				body.insertBefore(newOfflineTextDiv, body.firstChild);
			}
		}
	}

	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
	updateOnlineStatus();
});

// Clear Cache

const clearCacheButton = document.querySelector( "#clear-cache-button" );

if (
	window.location.search === "?debug" ||
	window.location.search === "?cache" ||
	window.location.search === "?clear"
) {
	clearCacheButton.style.display = "block";
}

clearCacheButton.addEventListener("click", function() {
	caches.delete( "offline-cache" ).then(function() {
		console.log("Cache cleared successfully");
		window.location.reload();
		window.location.search = "";
	});
});
