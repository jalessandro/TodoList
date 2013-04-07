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
		
		'register': 'showEditUser',
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
	
	showMain: function() {
		
		var successCallback = function() {
			this._defineMainView();
			App.redirect('#home/1', {replace: true});
		};
		
		var fetchSuccessCallback = $.proxy(successCallback, this);
		
		var options = {
			success: fetchSuccessCallback
		};
		
		App.loggedUser = new UserModel();
		App.loggedUser.set('id', 1);
		App.loggedUser.fetch(options);
		
	},
	
	showHome: function(userId) {
				
		var constructorOptions = {collection: App.loggedUser.tasks};
		App.views.TaskListView = App.showView(App.classes.tasks.ListView, '#body-container', constructorOptions);
		
		App.loggedUser.tasks.fetch({
			success: function() {
				App.views.TaskListView.render();
			}
		});
	},
	
	showTask: function(userId, taskId) {
		var task = App.loggedUser.tasks.get(taskId);
		
		var constructorOptions = {model: task};
		App.views.TaskItemView = App.showView(App.classes.tasks.ItemView, '#body-container', constructorOptions);
		App.views.TaskItemView.render();
	},
	
	showEditTask: function(userId, taskId) {
		var task = App.loggedUser.tasks.get(taskId);
		
		var constructorOptions = {model: task};
		App.views.EditTaskView = App.showView(App.classes.tasks.EditView, '#body-container', constructorOptions);
		App.views.EditTaskView.render();
	},
	
	showCreateTask: function(userId) {
		var task = new TaskModel();
		task.ownerId = userId;
		
		var constructorOptions = {model: task};
		App.views.EditTaskView = App.showView(App.classes.tasks.EditView, '#body-container', constructorOptions);
		App.views.EditTaskView.render();
	},
	
	showEditUser: function() {
		var user = new UserModel();
		
		var constructorOptions = {model: user};
		App.views.EditUserView = App.showView(App.classes.users.EditView, '#body-container', constructorOptions);
		App.views.EditUserView.render();
	},
	
	showEditLoggedUser: function() {
		var user = App.loggedUser;
		
		var constructorOptions = {model: user};
		App.views.EditUserView = App.showView(App.classes.users.EditView, '#body-container', constructorOptions);
		App.views.EditUserView.render();
	},
	
	/**
	 * Default handler, executed when there is no matching route.
	 */
	defaultAction : function(actions) {
		
		this.showMain();
	},
	
	// Private methods
	
	_defineMainView: function() {
		if (!App.isDefined(App.views.MainView)) {
			App.views.MainView = App.showView(App.classes.MainView, '#container');
			App.views.MainView.render();
		}
	}

});