package com.toptal.domain

import org.springframework.dao.DataIntegrityViolationException

class TaskController {

    static allowedMethods = [show: 'GET', save: "POST", update: "PUT", delete: "DELETE"]
	
	def show(Long userId, Long id) {
		
		if (!id) {
			User user = User.get(userId)
			if (!user) {
				log.error(message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), userId]))
				render(contentType: 'text/json') { [] }
			} else {
				render(contentType: 'text/json') {
					Task.findAllByOwner(user)
				}
			}
		} else {
		
			def taskInstance = Task.get(id)
			if (!taskInstance) {
				render(contentType: 'text/json') {
					[message : message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'Task'), id])]
				}
			} else {
				render(contentType: 'text/json') {
					taskInstance
				}
			}
		}
	}

    def save(Long userId) {
        def taskInstance = new Task(params)
		taskInstance.owner = User.get(userId);
		
        if (!taskInstance.save(flush: true)) {
			
			render(contentType: 'text/json') {
				[
					message : 'Error creating the task',
					success : false
				]
			}
        } else {
			render(contentType: 'text/json') {
				[
					success: true,
					message: message(code: 'default.created.message', args: [message(code: 'task.label', default: 'Task'), taskInstance.id])
				]
			}
		}
    }

    def update(Long userId, Long id) {
        def taskInstance = Task.get(id)
        if (!taskInstance) {
			render(contentType: 'text/json') {
				[
					success: false,
					message : message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'Task'), id])
				]
			}
		} else {
			taskInstance.properties = params.task
					
			if (!taskInstance.save(flush: true)) {
				render(contentType: 'text/json') {
					[
						message : 'Error saving the task',
						success : false
					]
				}
			} else {
				render(contentType: 'text/json') {
					[
						success: true,
						message: message(code: 'default.updated.message', args: [message(code: 'task.label', default: 'Task'), taskInstance.id])
					]
				}
			}
		}
    }

    def delete(Long userId, Long id) {
        def taskInstance = Task.get(id)
        if (!taskInstance) {
			render(contentType: 'text/json') {
				[
					success: false,
					message : message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'Task'), id])
				]
			}
			return
		}

        try {
            taskInstance.delete(flush: true)
			render(contentType: 'text/json') {
				[
					success: true,
					message: message(code: 'default.deleted.message', args: [message(code: 'task.label', default: 'Task'), id])
				]
            }
        }
        catch (DataIntegrityViolationException e) {
			render(contentType: 'text/json') {
				[
					success: false,
					message : message(code: 'default.not.deleted.message', args: [message(code: 'task.label', default: 'Task'), id])
				]
			}
            redirect(action: "show", id: id)
        }
    }
}
