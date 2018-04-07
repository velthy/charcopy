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
}(jQuery));
