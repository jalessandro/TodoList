class UrlMappings {

	static mappings = {
		
		"/conf/dependencies"(controller: "dependencies", action: "index")
		
		"/task-priorities"(controller: "taskPriorities", action: "index")
		
		"/login-user"(controller: "user", action: "loginUser")
		
		"/user/$id?"(resource:"user")
		
		"/user/$userId/task/$id?"(resource:"task")
		

		"/"(view:"/index")
		"500"(view:'/error')
	}
}
