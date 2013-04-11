var UserModel = Backbone.Model.extend({
	
	urlRoot: '/TodoList/user',
	
	initialize: function() {
		this.tasks = new TasksCollection();
		this.tasks.ownerId = this.id;
	},
	
	getFullName: function() {
		return this.get('firstName') + ' ' + this.get('lastName');
	}
});