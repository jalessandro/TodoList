package com.toptal.conf

import com.toptal.util.FileUtils
import com.toptal.util.TemplateCompiler

class DependenciesController {

    def index() {

		def compiler = new TemplateCompiler ('web-app/backbone-app/templates')
		compiler.compile()

		def dependencies = [libs:null, application:null]

		dependencies.libs = [
			'backbone-app/libs/less-1.3.3.min.js',
			'backbone-app/libs/jquery-1.9.1.js',
			'backbone-app/libs/bootstrap-2.3.1-dev.js',
			'backbone-app/libs/underscore-1.4.4.js',
			'backbone-app/libs/backbone-1.0.0-dev.js'
		]

		dependencies.application = [
			//			'backbone-app/main.js',
			'backbone-app/App.js',
			'backbone-app/AppRouter.js',
			'backbone-app/templates/compiledTemplates.js'
		]

		FileUtils.getFileNamesFromDir('web-app/backbone-app/models', 'backbone-app').each { file ->
			println ('Adding backbone model: ' + file)
			dependencies.application.add(file)
		}

		FileUtils.getFileNamesFromDir('web-app/backbone-app/collections', 'backbone-app').each { file ->
			println ('Adding backbone collection: ' + file)
			dependencies.application.add(file)
		}

		FileUtils.getFileNamesFromDir('web-app/backbone-app/views', 'backbone-app').each { file ->
			println ('Adding backbone view: ' + file)
			dependencies.application.add(file)
		}

		// Returns dependencies as json
		render (contentType: "text/json") {  dependencies  }
	}
}
