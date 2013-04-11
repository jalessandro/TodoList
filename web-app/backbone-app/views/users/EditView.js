App.namespace('classes.users');

App.classes.users.EditView = Backbone.View.extend({
	
	events: {
		'click #save-button': 'saveUser',
		'click #cancel-button': 'cancelEdition'
	},
	
	render: function() {
		
		var compiledTemplate = App.templates.users.editTemplate;
		if (this.model.isNew()) {
			compiledTemplate = App.templates.users.createTemplate;
		}
		
		this.$el.html(compiledTemplate);
		
		this.updateForm();
		
		if (!this.model.isNew()) {
			App.setMainTitle('Edit User');
			App.disableAllMainStates();
		} else {
			App.setMainTitle('Create User');
		}
	},
	
	updateForm: function() {
		if (!this.model.isNew()) {
			this.$('#email').val(this.model.get('email'));
			this.$('#firstName').val(this.model.get('firstName'));
			this.$('#lastName').val(this.model.get('lastName'));
		}
	},
	
	saveUser: function() {
		
		var changedAttributes = {
			firstName: this.$('#firstName').val(),
			lastName: this.$('#lastName').val()
		};
		
		if (this.model.isNew()) {
			changedAttributes['password'] = this.$('#password').val();
			changedAttributes['email'] = this.$('#email').val();
		}
		
		var successCallback = function() {
			this.cancelEdition();
		};
		
		var saveSuccessCallback = $.proxy(successCallback, this);
		
		this.model.save(changedAttributes, {
			success: saveSuccessCallback
		});
		
		return false;
	},
	
	cancelEdition: function() {
		if (this.model.isNew()) {
			App.redirect('#login');
		} else {
			App.redirect('#home/1');
		}
		return false;
	}
});