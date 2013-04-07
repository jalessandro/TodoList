package com.toptal.domain

class User {
	
	String email
	String password
	String firstName
	String lastName
	
	static hasMany = [tasks: Task]
	
	static mapping = {
		tasks cascade: "all-delete-orphan"
	}
	
	static constraints = {
		email email: true, unique: true, blank: false
		password blank: false
	}
}
