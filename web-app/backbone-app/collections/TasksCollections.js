var TasksCollection = Backbone.Collection.extend({
	
	model: TaskModel,
	
	url: function() {
		return '/TodoList/user/' + this.ownerId + '/task';
	}
});