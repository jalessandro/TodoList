var UserModel = Backbone.Model.extend({
	
	urlRoot: '/TodoList/user',
	
	initialize: function() {
		this.tasks = new TasksCollection();
		this.once('change:id', this.updateCollectionOwnerId, this);
	},
	
	updateCollectionOwnerId: function() {
		this.tasks.ownerId = this.id;
	},
	
	getFullName: function() {
		return this.get('firstName') + ' ' + this.get('lastName');
	}
});