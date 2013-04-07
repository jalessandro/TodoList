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
		this.isIE = this.isAnIEBrowser();
		Backbone.history.start();
		
		this.eventHandler = _.clone(Backbone.Events);
	},

	isAnIEBrowser: function() {
		var rv = -1;
		if (navigator.appName === 'Microsoft Internet Explorer') {
		    var ua = navigator.userAgent;
		    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		    if (re.exec(ua) != null) {
		    	rv = parseFloat( RegExp.$1 );
		    }
		}
		return (rv != -1);
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
	
	goBack: function() {
		window.history.back();
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
	
	/**
	 * Loads a collection from the server.
	 * options: 
	 *  - context: Object context which will execute the callbacks. If not defined the currentView will be the context of the callbacks.
	 *  - success: Success callback.
	 *  - callbackParams: Arguments to attach to the Success Callback.
	 * */	
	populateCollectionWithContext: function(currentView, collectionsToPopulate, params, options) {
		
		options || (options = {});
		var requestCount = _.size(collectionsToPopulate);
		App.log('App.populateCollection() Request Count: ' + requestCount);
		
		var thiz = options.context || currentView; // Holds the context to execute the callbacks
		
		var failureCallback = (options.error) ? $.proxy(options.error, thiz) : null;
		
		var successCallback = function(collection, response) {
			
			collection.reset();
			
			if (!App.isDefined(collection.metadata)) {
				collection.metadata = {};
			}
			
			_.extend(collection.metadata, response.metadata);
			
			var responseList = response.data;
			if (App.isDefined(collection.metadata.parseFunction)) {
				var parseFunction = $.proxy(collection.metadata.parseFunction, collection);
				responseList = parseFunction(response.data);
			}
			
			collection.add(responseList);
			
			requestCount = requestCount - 1;
			if (requestCount == 0) {
				if (!App.isDefined(options.success)) {
					currentView.render();
				}
				else {
					var successFunction = $.proxy(options.success, thiz);
					successFunction(options.callbackParams);
				}
			}
		};
		
		var errorOptions = {success: successCallback, failure: failureCallback};
		
		_.each(collectionsToPopulate, function(collectionToPopulate)
		{
			App.log('collectionToPopulate: ' + collectionToPopulate.url);
			
			collectionToPopulate.fetch({ data: params,
				success: successCallback,
				error: function(collection, response, options) {
					errorOptions.success = options.success;
					App.handleErrorResponse(response, errorOptions);
				}
			});
		});
	},
	
	/**
	 * Loads a model from the server.
	 * options: 
	 * 	- success: Success callback.
	 * 	- error: Error callback.
	 *  - params: Arguments to attach to the fetch.
	 *  - context: Object context which will execute the callbacks.
	 *  - parse: Method to parse the response.
	 * */
	loadModel: function(model, options) {
		
		// Sets the parse method
		model.parse = (options.parse) ? options.parse : function(rsp) {
			var attrs = rsp.data;
			attrs._metadata = rsp.metadata;
			return attrs;
		};
		
		var thiz = options.context || this; // Holds the context to execute the callbacks
		
		var failureCallback = (options.error) ? $.proxy(options.error, thiz) : null;
		
		var successCallback = ((options.success) ? $.proxy(options.success, thiz) : function(model, response) {
			App.log(model);
		});
		
		var errorOptions = {success: successCallback, failure: failureCallback};
				
		var opts = {
			data: options.params || {},
			success: successCallback,
			error: function(model, response, options) {
				errorOptions.success = options.success;
				App.handleErrorResponse(response, errorOptions);
			}
		};
		
		model.fetch(opts);
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
		App.currentBranchOfficeId = null;
		App.hasPendingNotifications = null;
		
		App.log('Removing all application views');
		_.each(_.keys(this.showingViews), function(elementId) {
			App.disposeView(elementId);
		});
	},
	
	/**
	 * Adds a display function (to change visual elements) to the queue in the setTimeout 0.
	 * options:
	 *  - context: The context where the callback will be called.
	 *  - args: Arguments to pass to the callback.
	 * */
	addToDisplayQueue: function(callback, options) {
		
		var thiz = options.context || this;
		var callback = $.proxy(callback, thiz);
		
		setTimeout(function() {
			(options.args) ? callback(options.args) : callback();
		}, 0);
	},
};

_.extend(App, Backbone.Events);