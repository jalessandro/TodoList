var UsersCollection = Backbone.Collection.extend({
	
	model: UserModel,
	
	url: '/TodoList/user'
});