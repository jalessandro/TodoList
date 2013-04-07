package com.toptal.domain

class TaskPrioritiesController {

    def index() {
		def result = []
		def priorities = TaskPriority.values()
		for (def priority : priorities) {
			result << priority.name()
		}
		
		render (contentType: "text/json") { result }
	}
}
