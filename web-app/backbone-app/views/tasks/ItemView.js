App.namespace('classes.tasks');

App.classes.tasks.ItemView = Backbone.View.extend({
	
	initialize: function() {
		App.eventHandler.once('edit-task', this.editTask, this);
	},
	
	render: function() {
		
		var data = {	
			task: this.model,
    		_: _
    	};
    	
		var compiledTemplate = _.template(App.templates.tasks.itemTemplate, data);
		this.$el.html(compiledTemplate);
		
		App.setMainTitle('Task Details');
		App.enableMainState('task-details');
	},
	
	editTask: function() {
		App.redirect('#home/' + this.model.getOwnerId() + '/task/' + this.model.id + '/edit');
		return false;
	}
	
});