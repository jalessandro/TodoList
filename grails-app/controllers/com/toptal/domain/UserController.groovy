package com.toptal.domain

import org.springframework.dao.DataIntegrityViolationException

class UserController {

    static allowedMethods = [show: 'GET', save: "POST", update: "PUT", delete: "DELETE"]
	
	def show(Long id) {
		
		if (!id) {
			render(contentType: 'text/json') {
				User.list()
			}
		} else {
		
			def userInstance = User.get(id)
			if (!userInstance) {
				render(contentType: 'text/json') {
					[message : message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), id])]
				}
			} else {
				render(contentType: 'text/json') {
					userInstance
				}
			}
		}
	}

    def save() {
        def userInstance = new User(params)
        if (!userInstance.save(flush: true)) {
			render(contentType: 'text/json') {
				[
					message : 'Error creating the user',
					success : false
				]
			}
        } else {
			render(contentType: 'text/json') {
				[
					message : message(code: 'default.created.message', args: [message(code: 'user.label', default: 'User'), userInstance.id]),
					success : true
				]
			}
		}
    }


    def update(Long id) {
        def userInstance = User.get(id)
        if (!userInstance) {
			render(contentType: 'text/json') {
				[
					success: false,
					message : message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), id])
				]
			}
			return;
        }
		
		bindData(userInstance, params, [include: ['firstName', 'lastName', 'password']])

        userInstance.properties = params

        if (!userInstance.save(flush: true)) {
			render(contentType: 'text/json') {
				[
					message : 'Error saving the user',
					success : false
				]
			}
        } else {
			render(contentType: 'text/json') {
				[
					message : message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), userInstance.id]),
					success : true
				]
			}
		}
    }

    def delete(Long id) {
        def userInstance = User.get(id)
        if (!userInstance) {
			render(contentType: 'text/json') {
				[
					success: false,
					message : message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), id])
				]
			}
			return;
        }

        try {
            userInstance.delete(flush: true)
			render(contentType: 'text/json') {
				[
					message : message(code: 'default.deleted.message', args: [message(code: 'user.label', default: 'User'), id]),
					success : true
				]
            }
        }
        catch (DataIntegrityViolationException e) {
			render(contentType: 'text/json') {
				[
					message : message(code: 'default.not.deleted.message', args: [message(code: 'user.label', default: 'User'), id]),
					success : false
				]
			}
        }
    }
}
