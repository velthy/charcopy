/**
 * Here goes all the JS Code you need in your child theme buddy!
 */
(function($) {
	$( 'input[type="search"]' ).focus();

	$( 'input[type="search"]' ).on( 'keyup', function(){
		var search_term = $( this ).val().toLowerCase();
		$('.char-cards .char').each(function(){
			if ( $( this ).filter( '[data-search-term *= ' + search_term + ']').length > 0 || search_term.length < 1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
		$( 'html, body' ).scrollTop(0);
		if ( ! $( this ).val() == '' ) {
			$( '.reset-search ').removeClass( 'hidden' );
		}
	});

	$(document).on('click', '.reset-search', function(e){
		$( 'input[type="search"]' ).val('').focus();
		$('.char-cards .char').show();
		$( this ).addClass( 'hidden' );
		e.preventDefault();
	});

	$(document).keyup(function(e) {
		if ( e.keyCode === 83 || e.keyCode === 70 ) { // s(earch), f(ind), or esc
			if ( ! $( 'input[type="search"]' ).is( ':focus' ) ) {
				$( 'input[type="search"]' ).val('').focus();
			}
		}
		if ( e.keyCode === 27 ) { esc
			$( 'input[type="search"]' ).val('').focus();
		}
	});

	$(document).on('click', '.color-scheme-selector button', function(e){
		var color_scheme = $( this ).attr( 'data-color-scheme');
		$( 'body' ).removeClass( 'color-scheme-yellow color-scheme-green color-scheme-blue color-scheme-purple color-scheme-pink' ).addClass( color_scheme );
		$( '.color-scheme-selector button' ).removeClass( 'current' );
		$( this ).addClass( 'current' );
		e.preventDefault();
	});
}(jQuery));


/**
 * Darkmode.
 */

( () => {
	const themeToggle = document.getElementById( 'dark-mode-toggle' );
	if ( ! themeToggle ) {
		return;
	}

	let activeTheme = false;
	if ( document.cookie.split( ';' ).some( ( item ) => item.trim().startsWith( 'charcopy-theme=' ) ) ) {
		activeTheme = document.cookie.split( '; ' ).find( row => row.startsWith( 'charcopy-theme=' ) ).split( '=' )[1];
	}

	const setTheme = ( isDark ) => {
		document.cookie = `charcopy-theme=${ isDark ? 'dark' : 'light' }; path=/`;
		themeToggle.checked = isDark ? true : false;
		if ( isDark ) {
			document.body.classList.add( 'dark-mode');
			document.body.classList.remove( 'light-mode');
		} else {
			document.body.classList.add( 'light-mode');
			document.body.classList.remove( 'dark-mode');
		}
	};

	// When no theme was set, get current system default.
	if ( false === activeTheme ) {
		activeTheme = window.matchMedia( '(prefers-color-scheme: dark)' ).matches ? 'dark' : 'light';
	}

	// Set theme based on localStorage or default system setting.
	setTheme( 'dark' === activeTheme );

	// Set theme based on toggle.
	themeToggle.addEventListener( 'click', ( e ) => {
		setTheme( e.target.checked );
	} );
} )();
