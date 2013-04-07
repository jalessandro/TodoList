package com.toptal.domain

class Task {
	
	String title
	String description
	User owner
	TaskPriority priority
	
	static constraints = {
		title blank: false
		description maxSize: 1000
	}
	
	public Task() {
		priority = TaskPriority.NORMAL
	}
}
