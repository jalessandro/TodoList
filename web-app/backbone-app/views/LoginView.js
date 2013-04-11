App.namespace('classes');

App.classes.LoginView = Backbone.View.extend({
	
	events: {
		'click #login-button' : 'performLogin',
		'keypress #password' : 'handleEnterPressed',
		'click #form-msg-error a' : 'hideErrorMessage',
		'click #create-user' : 'createUser'
	},
		
    /**
     * Renders the view component.
     * */
    render: function() {
    	
    	var compiledTemplate = App.templates.loginTemplate;		
		this.$el.html(compiledTemplate);
		
		$('#form-msg-error').hide();
		$('#email').focus();		
    },
    
    handleEnterPressed: function(e) {
    	if (e.which == 13) {
	       this.performLogin();
	       return false;
    	}
    },
    
    performLogin: function() {
    	
    	var email = $('#email').val();
    	var password = $('#password').val();
    	
    	var isValid = this.required(email);
    	
    	isValid = this.required(password) && isValid;
    	
		if (isValid) {
			
			var params = {'email' : email, 'password' : password};
			
			var options = {data: params, context: this};
			
			options.success = function(data) {
	    		if (data.success) {
					App.loggedUser = new UserModel(data.loggedUser);
					App.redirect('#loadApp');
	    		}
	    		else {
	    			$('#login-button').button('reset');
	    	    	$('#form-msg-error span').html(data.error);
	    			$('#form-msg-error').show('slow');
	    		}
			};
	    	
	    	App.post('login-user', options);
		}
		
		return false;
    },
    
    createUser: function() {
		App.redirect('#register');
		return false;
	},
	
	required: function(value) {
		return (!_.isUndefined(value) && !_.isNull(value) && value !== '');
	},
    
    hideErrorMessage: function() {
    	
    	$('#form-msg-error').hide('slow');
    	return false;
    }
});