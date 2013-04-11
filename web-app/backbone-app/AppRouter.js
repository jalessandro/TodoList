/**
 * AppRouter.js
 * 
 * Class to define the Router configurations.
 */

var AppRouter = Backbone.Router.extend({

	routes : {
		
		'login' : 'showLogin',
		
		'home/:userId' : 'showHome',
		
		'home/:userId/task/create' : 'showCreateTask',
		'home/:userId/task/:taskId' : 'showTask',
		'home/:userId/task/:taskId/edit' : 'showEditTask',
		
		'register': 'showCreateUser',
		'edit-user-settings': 'showEditLoggedUser',
		
		'loadApp' : 'showMain',
		
		// Default
		'*path' : 'defaultAction'
	},

	/**
	 * The constructor of the Router is used to load the master view.
	 */
	initialize: function() {
		
		App.namespace('collections');
		App.namespace('views');
		App.namespace('showingViews');
		
		App.get('task-priorities', {
			success: function(data){ App.priorities = data; } 
		});
	},
	
	showLogin: function() {
		App.views.LoginView = App.showView(App.classes.LoginView, '#container');
		App.views.LoginView.render();
	},
	
	showMain: function() {
		
		this._defineMainView();
		
		App.redirect('#home/' + App.loggedUser.id, {replace: true});
	},
	
	showHome: function(userId) {
		
		this._defineMainView();
				
		var constructorOptions = {collection: App.loggedUser.tasks};
		App.views.TaskListView = App.showView(App.classes.tasks.ListView, '#body-container', constructorOptions);
		
		App.loggedUser.tasks.fetch({
			success: function() {
				App.views.TaskListView.render();
			}
		});
	},
	
	showTask: function(userId, taskId) {
		
		this._defineMainView();
		
		var task = App.loggedUser.tasks.get(taskId);
		
		var constructorOptions = {model: task};
		App.views.TaskItemView = App.showView(App.classes.tasks.ItemView, '#body-container', constructorOptions);
		App.views.TaskItemView.render();
	},
	
	showEditTask: function(userId, taskId) {
		
		this._defineMainView();
		
		var task = App.loggedUser.tasks.get(taskId);
		
		var constructorOptions = {model: task};
		App.views.EditTaskView = App.showView(App.classes.tasks.EditView, '#body-container', constructorOptions);
		App.views.EditTaskView.render();
	},
	
	showCreateTask: function(userId) {
		
		this._defineMainView();
		
		var task = new TaskModel();
		task.ownerId = userId;
		
		var constructorOptions = {model: task};
		App.views.EditTaskView = App.showView(App.classes.tasks.EditView, '#body-container', constructorOptions);
		App.views.EditTaskView.render();
	},
	
	showCreateUser: function() {
		
		var user = new UserModel();
		
		var constructorOptions = {model: user};
		App.views.EditUserView = App.showView(App.classes.users.EditView, '#container', constructorOptions);
		App.views.EditUserView.render();
	},
	
	showEditLoggedUser: function() {
		
		this._defineMainView();
		
		var user = App.loggedUser;
		
		var constructorOptions = {model: user};
		App.views.EditUserView = App.showView(App.classes.users.EditView, '#body-container', constructorOptions);
		App.views.EditUserView.render();
	},
	
	/**
	 * Default handler, executed when there is no matching route.
	 */
	defaultAction : function(actions) {
		App.redirect('#login');
	},
	
	// Private methods
	
	_defineMainView: function() {
		
		if (!App.loggedUser) {
			// Redirect to Login
			App.redirect('#login');
		}
		
		if (!App.isDefined(App.views.MainView)) {
			App.views.MainView = App.showView(App.classes.MainView, '#container');
			App.views.MainView.render();
		}
	}
});