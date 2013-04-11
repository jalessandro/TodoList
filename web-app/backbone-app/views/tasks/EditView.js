App.namespace('classes.tasks');

App.classes.tasks.EditView = Backbone.View.extend({
	
	events: {
		'click #save-button': 'saveTask',
		'click #cancel-button': 'cancelEdition'
	},
	
	render: function() {
		
		var data = {
			priorities: App.priorities,
			_: _
		}
		
		var compiledTemplate = _.template(App.templates.tasks.editTemplate, data);
		this.$el.html(compiledTemplate);
		
		this.updateForm();
		
		if (!this.model.isNew()) {
			App.setMainTitle('Edit Task');
		} else {
			App.setMainTitle('Create Task');
		}
		
		App.disableAllMainStates();
	},
	
	updateForm: function() {
		if (!this.model.isNew()) {
			this.$('#title').val(this.model.get('title'));
			this.$('#description').val(this.model.get('description'));
			this.$('#priority').val(this.model.getPriority());
		}
	},
	
	saveTask: function() {
		
		var changedAttributes = {
			title: this.$('#title').val(),
			description: this.$('#description').val(),
			priority: this.$('#priority').val()
		};
		
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
		App.redirect('#home/' + this.model.getOwnerId());
		return false;
	}
});