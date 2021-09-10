jQuery(document).ready(function($) {
	var sbe_already_submitted = false;
	var buttonText = $( 'input[name="submit-subscribe-user"]').text();
	$( '.subscribe-by-email-subscribe-form' ).submit( function(event) {
		event.preventDefault();

		var form = $(this);

		$( '.subscribe-by-email-loader' ).show();
		$( 'input[name="submit-subscribe-user"]').text( 'Subscribing...' ).attr({ 'disabled': true, 'aria-live': 'assertive' });
		if ( sbe_already_submitted ) {
			$( '.subscribe-by-email-loader' ).hide();
			return false;
		}
		
		grecaptcha.ready(function() {
			grecaptcha.execute(sbe_localized.recaptcha_v3_site_key, {action: 'sbe'}).then(function(token) {
				form.find('.g-recaptcha-response').val(token);

				var data = form.serialize();
				$.post( sbe_localized.ajaxurl, data, function(response) {
					if ( 'TRUE' === response ) {
						$( '.subscribe-by-email-error' ).hide().removeAttr( 'aria-live' );
						$( '.subscribe-by-email-updated' ).slideDown().attr( 'aria-live', 'assertive' ).focus();
						sbe_already_submitted = true;
					}
					else {
						if( 'BAD CAPTCHA' === response ) {
							form.find('.sbe-recaptcha-holder p.subscribe-by-email-error').show().attr('role', 'alert');
						}
						else {
							$( '.subscribe-by-email-updated' ).hide().removeAttr( 'aria-live' );
							$( '.subscribe-by-email-error' ).slideDown().attr( 'aria-live', 'assertive' ).focus();
							$( 'input[name="submit-subscribe-user"]').attr( 'disabled', false ).text( buttonText ).removeAttr( 'aria-live' );
						}
					}
					$( '.subscribe-by-email-loader' ).hide();
		
				});
			});
		});
		


		return false;
	});
});