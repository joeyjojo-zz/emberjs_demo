var App = Em.Application.create();

App.store = DS.Store.create({
  revision: 4,
  adapter: DS.fixtureAdapter
});

/*
Models
*/

App.Employer = DS.Model.extend({
	name: DS.attr('string'),
	address: DS.attr('string'),
	employees: DS.hasMany('App.Employee')
});

App.Employee =DS.Model.extend({
	employer: DS.belongsTo('App.Employer'),
	name: DS.attr('string')
})


/*
Fixtures
*/
App.Employer.FIXTURES = [
	{
	    id: 1,
	    name: "Test Employer",
	    address: "123 Fake Street, Fake Town, FA12 3KE",
	    employees: [1, 3]
	},
	{
	    id: 2,
	    name: "Another Test Employer",
	    address: "Some address",
	    employees: [2]
	}
];

App.Employee.FIXTURES = [
	{
		id: 1,
		name: "Test Employee",
		employer_id: 1
	},
	{
		id: 2,
		name: "Another Test Employee",
		employer_id: 2
	},
	{
		id: 3,
		name: "Not Another Test Employee",
		employer_id: 1
	}
];

/*
Controllers
*/
App.ApplicationController = Em.Controller.extend();

App.EmployersController = Em.ArrayController.extend({
	content: App.store.findAll(App.Employer)
});

App.EmployerController = Em.ObjectController.extend();


App.EmployeesController = Em.ArrayController.extend({
	content: App.store.findAll(App.Employee)
})

/*
Routers
*/
App.Router = Em.Router.extend({
    enableLogging: true,
    location: 'hash',
    root: Em.Route.extend({

        // STATES
        index: Em.Route.extend({
            route: '/',
            redirectsTo: 'employers'
        }),
        // All employers
        employers: Em.Route.extend({
        	route: '/employers',
        	connectOutlets: function(router, context) {
                router.get('applicationController').connectOutlet({
                    name: 'employers'
                });
            }
        }),
        // Individual employer detail
        employer: Em.Route.extend({
        	// display the employer detail
        	route: '/employers/:employer_id',
        	connectOutlets: function(router, employer) {
    			router.get('applicationController').connectOutlet({
    				name:'employer', 
    				context:employer
    			});
  			},/*
  			index: Em.Route.extend({
    			route: '/',
    			redirectsTo: 'employees'
  			}),*/
  			/*
  			// show the employees for the employer
  			index: Ember.State.extend({
    			route: '/',
    			redirectsTo: 'employees'
  			}),
  			employee: Em.Route.extend({
			    route: '/employees/:employee_id',
			    connectOutlets: function(router, employee) {
			      
			    }
			}),
            */
            employees: Em.Route.extend({
                route: '/employees',
                connectOutlets: function(router) {
                    var employerController = router.get('employerController');
                    employerController.connectOutlet('employees', employerController.get('employees'));
                }
            }),
        	// Actions
        	showEmployees: Em.Route.transitionTo('employees')
            
        }),
        // All employees
        
        // Actions
        showEmployer: Em.Route.transitionTo('employer')
     })
});

/*
Views
*/
App.ApplicationView = Em.View.extend({
    templateName: 'application'
});

App.EmployersView = Em.View.extend({
    templateName: 'employers'
});

App.EmployerView = Em.View.extend({
	templateName: 'employer'
});

App.EmployeesView = Em.View.extend({
	templateName: 'employees'
});

App.initialize();