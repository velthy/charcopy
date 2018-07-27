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
				$( 'body' ).removeClass( 'about-open' );
			}
		}
		if ( e.keyCode === 27 ) { esc
			$( 'input[type="search"]' ).val('').focus();
			$( 'body' ).removeClass( 'about-open' );
		}
	});
	$(document).keyup(function(e) {
		if ( e.keyCode === 65 ) { // s(earch), f(ind), or esc
			if ( ! $( 'input[type="search"]' ).is( ':focus' ) ) {
				$( 'body' ).addClass( 'about-open' );
			}
		}
	});

	$(document).on('click', '.open-about', function(e){
		$( 'body' ).addClass( 'about-open' );
		e.preventDefault();
	});
	$(document).on('click', '.close-about', function(e){
		$( 'body' ).removeClass( 'about-open' );
		$( 'input[type="search"]' ).focus();
		e.preventDefault();
	});

}(jQuery));
