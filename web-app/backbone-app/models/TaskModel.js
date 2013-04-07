var TaskModel = Backbone.Model.extend({
	
	urlRoot: function() {
		return '/TodoList/user/' + this.getOwnerId() + '/task';
	},
	
	getOwnerId: function() {
		
		if (this.isNew()) {
			return this.ownerId;
		} else {
			return this.get('owner').id;
		}
	},
	
	getPriority: function() {
		return this.get('priority') ? this.get('priority').name : 'NO PRIORITY';
	}
});

