App.namespace('classes.tasks');

App.classes.tasks.ListView = Backbone.View.extend({
	
	events: {
		'click i': 'processTask'
	},
	
	initialize: function() {
	    this.listenTo(this.collection, "change", this.render);
	    this.listenTo(this.collection, "remove", this.render);
	    
	    App.eventHandler.once('add-task', this.addTask, this);
	    App.eventHandler.once('add-user', this.addUser, this);
	},
	
	render: function() {
		
		var data = {
			tasks: this.collection,
    		_: _
    	};
    	
		var compiledTemplate = _.template(App.templates.tasks.listTemplate, data);
		this.$el.html(compiledTemplate);
		
		this.$('i').tooltip();
		
		App.setMainTitle(App.loggedUser.getFullName() + '&#39;s Tasks');
		App.enableMainState('task-list');
	},
	
	addTask: function() {
		App.redirect('#home/' + this.collection.ownerId + '/task/create');
		return false;
	},
	
	editTask: function(taskId) {
		App.redirect('#home/' + this.collection.ownerId + '/task/' + taskId + '/edit');
	},
	
	showTaskDetails: function(taskId) {
		App.redirect('#home/' + this.collection.ownerId + '/task/' + taskId);
	},
	
	removeTask: function(taskId) {
		var task = this.collection.get(taskId);
		this.collection.remove(task);
		task.destroy();
	},
	
	processTask: function(event) {
		var $element = $(event.currentTarget);
		var action = $element.data('action');
		var taskId = $element.data('task-id');
		
		var actionFunction = this[action];
		
		actionFunction.call(this, taskId);
	},
	
	addUser: function() {
		App.redirect('#register');
		return false;
	}
});