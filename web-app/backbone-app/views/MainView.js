App.namespace('classes');

App.classes.MainView = Backbone.View.extend({
	
	events: {
		'click #edit-user': 'editUser',
		'click ul.nav li a[data-action]': 'processAction'
	},
	
	render: function() {
		
		var compiledTemplate = App.templates.mainTemplate;
		this.$el.html(compiledTemplate);
		this._hideAll();
	},
	
	editUser: function() {
		App.redirect('#edit-user-settings');
		return false;
	},
	
	processAction: function(event) {
		var $element = $(event.currentTarget);
		var action = $element.data('action');
		
		App.eventHandler.trigger(action);
		
		return false;
	},
	
	_hideAll: function() {
		this.$("ul[data-state]").hide();
	},
	
	setTitle: function(title) {
		this.$('a.brand').html(title);
	},
	
	enableState: function(state) {
		this._hideAll();
		this.$("ul[data-state='" + state + "']").show();
	},
	
	disableState: function(state) {
		$("ul[data-state='" + state + "']").hide();
	}
});