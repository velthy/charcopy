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
	const modeToggle = document.getElementById('dark-mode-toggle');
	if (!modeToggle) {
	  return;
	}

	let activeMode = localStorage.getItem('charcopy-mode');

	const setMode = (isDark) => {
	  localStorage.setItem('charcopy-mode', isDark ? 'dark' : 'light');
	  modeToggle.checked = isDark ? true : false;
	  if (isDark) {
		document.body.classList.add('dark-mode');
		document.body.classList.remove('light-mode');
	  } else {
		document.body.classList.add('light-mode');
		document.body.classList.remove('dark-mode');
	  }
	};

	// When no mode was set, get current system default.
	if (!activeMode) {
	  activeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	// Set mode based on localStorage or default system setting.
	setMode('dark' === activeMode);
	// Set mode based on toggle.
	modeToggle.addEventListener('click', (e) => {
	  setMode(e.target.checked);
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
		setTheme(colorOptions[color]);
		localStorage.setItem('colorPref', color);
		updateFavicon( color );

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

// Copy characters to clipboard
var charButtons = document.querySelectorAll( '.char-button' );
charButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		var charText = this.getAttribute('data-clipboard-text');
		navigator.clipboard.writeText(charText).then(function () {
		var confirmationText = '<span class="character">' + charText + '</span>' +
			'<span class="message"> copied to clipboard</span>';
		var confirmationElement = document.getElementById('confirmation-message');
		var confirmationInnerElement = confirmationElement.querySelector('.copy-confirmation-inner');
		confirmationInnerElement.innerHTML = confirmationText;
		confirmationElement.classList.add('visible');
		setTimeout(function () {
			confirmationElement.classList.remove('visible');
		}, 750); // Remove "visible" class after 750 ms
		}).catch(function () {
		console.error('Failed to copy to clipboard');
		});
	});
});

// Offline Mode
document.addEventListener('DOMContentLoaded', () => {
	function updateOnlineStatus() {
		if (navigator.onLine) {
			document.body.classList.remove('offline-mode');
		} else {
		document.body.classList.add('offline-mode');
		}
	}
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
	updateOnlineStatus();
});