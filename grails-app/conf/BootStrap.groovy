import com.toptal.domain.User

class BootStrap {

    def init = { servletContext ->
		
		String userEmail = 'user@test.com'
		String userFirstName = 'John'
		String userLastName = 'Smith'
		String userPassword = '123'
		
		def firstUser = User.findByEmail(userEmail)
		
		if (!firstUser) {
			firstUser = new User([email: userEmail, firstName: userFirstName, lastName: userLastName, password: userPassword])
			firstUser.save()
		}
    }
	
    def destroy = {
    }
}
