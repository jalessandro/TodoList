/**
 * App.js
 * 
 * Object that contains the application resources.
 */

var App = {

	/**
	 * Initializes the application and all of its resources.
	 */
	initialize : function() {
		$.ajaxSetup({
		  cache: false
		});
		this.router = new AppRouter();
		this.eventHandler = _.clone(Backbone.Events);
		
		Backbone.history.start();
	},

	isDefined: function(variable) {
		return !_.isUndefined(variable) && !_.isNull(variable);
	},
	
	refresh: function() {
		window.location.reload();
	},
	
	redirect : function(url, options) {
		var navigateOptions = {trigger: true};
		_.extend(navigateOptions, options);
		this.router.navigate(url, navigateOptions);
	},
	
	log: function(object) {
		if (typeof console !== "undefined" && typeof console.log !== "undefined") {
			console.log(object);
		}
	},
	
	/**
	 * Defines a package (or namespace) to hold the application objects.
	 */
	namespace: function (namespaceString) {
	    var parts = namespaceString.split('.'),
	        parent = this,
	        currentPart = '';    
	        
	    for(var i = 0, length = parts.length; i < length; i++) {
	        currentPart = parts[i];
	        parent[currentPart] = parent[currentPart] || {};
	        parent = parent[currentPart];
	    }
	},
	
	/**
	 * Sets the title of the Main Nav bar
	 */
	setMainTitle: function(title) {
		if (this.views.MainView) {
			this.views.MainView.setTitle(title);
		}
	},
	
	/**
	 * Shows an specific navigation buttons in the Main Nav bar.
	 */
    enableMainState: function(state) {
    	if (this.views.MainView) {
			this.views.MainView.enableState(state);
		}
    },
    
    /**
	 * Hides an specific navigation buttons in the Main Nav bar.
	 */
    disableMainState: function(state) {
    	if (this.views.MainView) {
			this.views.MainView.disableState(state);
		}
    },
    
    disableAllMainStates: function() {
    	if (this.views.MainView) {
			this.views.MainView.disableAllStates();
		}
    },
	
	/**
	 * Makes an ajax get call.
	 * options:
	 * 	- data
	 *  - success
	 *  - error
	 *  - context
	 * */
	get: function(url, options) {
		App._ajax('GET', url, options);
	},
	
	/**
	 * Makes an ajax post call.
	 * options:
	 * 	- data
	 *  - success
	 *  - error
	 *  - context
	 * */
	post: function(url, options) {
		App._ajax('POST', url, options);
	},
	
	_ajax: function(type, url, options) {
		
		var thiz = options.context || this; // Holds the context to execute the callbacks
		
		var failureCallback = (options.error) ? $.proxy(options.error, thiz) : null;
		var successCallback = ((options.success) ? $.proxy(options.success, thiz) : function(data, textStatus, jqXHR) {
			App.log(data);
		}); 
		
		var errorOptions = {failure: failureCallback, success: successCallback};
		
		var opts = {
				type: type,
				data: options.data || {},
				success: successCallback,
				error: function(jqXHR, textStatus, errorThrown) {
					App.handleErrorResponse(jqXHR, errorOptions);
				}
		};
		
		$.ajax(url, opts);
	},
	
	showView: function(classView, elementId, attributes) {
		
		App.log('App.showView() ElementId: ' + elementId);
		
		this.disposeView(elementId);
		
		var constructorAttributes = {el : $(elementId)};
		
		if (attributes != null) {
			_.extend(constructorAttributes, attributes);
		}
		
		this.showingViews[elementId] = new classView(constructorAttributes);
		
		return this.showingViews[elementId];
	},
	
	/**
	 * Disposes a view from the view collections. Also, undelegates the events 
	 * and remove the children dom elements. 
	 * */
	disposeView: function(elementId) {
		var view = this.showingViews[elementId];
		
		if (view != null) {
			App.log('Removing view of ' + elementId);
			view.off();
			view.undelegateEvents();
			view.$el.children().remove();
			this.showingViews[elementId] = null;
		}
	},
	
	/**
	 * Removes all the views of the application, removing their events.
	 */
	clearApplication: function() {
		
		App.loggedUser = null;
		
		App.log('Removing all application views');
		_.each(_.keys(this.showingViews), function(elementId) {
			App.disposeView(elementId);
		});
		
		App.views.MainView = null;
	}	
};

_.extend(App, Backbone.Events);