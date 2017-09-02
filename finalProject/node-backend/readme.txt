Readme - FiTotal App by Arie Muller

The goal behind the UI
- Design a clear login page with indicative warnings for bad input by the user (explained later on).
- Provide a simple dynamic task list for people intending to go on a trip.
  The recommended list is predefined and gives some guide lines and tips for the user.
  Each task completed by the user can be transferred to the "DONE" section.
  The remaining "TODO" tasks are dynamically updated according to the "DONE" tasks so no task will appear twice.
  The logout button enables the user to remove the cookie and go back to the login page.

How to use the UI?
- Start by running "set DEBUG=ex3:* & npm start" inside ex3 directory
- In chrome, go to http://localhost:3000/public/hello.html
- Enter username + password and register
  Trying to login with non-existing user should show red warning "Error 500: User doesn't exist. Did you register?"
  Trying to login with wrong password should show red warning "Error 403: Credentials do not match"
- After login, content page will be loaded with a short description of the app and predefined tasks list
- To add a task to the "DONE" section, simply enter the task ID to the input field and press "ADD"
  If you decided you want to redo the task, enter the task ID and press remove.
  This will return the task to the "TODO" section.
- DONE tasks will stay that way even after a refresh or logout as long as the server is running.
- By pressing the logout button on the bottom, you'll return to the login page and be asked to enter your credentials again.
  Warning: Although not in the original design, The cookie will be deleted when logging out.
           To return to the login menu without deleting the cookie, refresh the page.

What was hard?
- Design-wise: managing to squeeze different HTML elements in the same line, or position them as expected.
  CSS turned out to be quite tricky in that aspect.
- Dynamically updating the "TODO" section was challenging, until we decided it's better to build the list
  as the difference all the tasks minus the ones the user already transferred to the "DONE" section.
- Building the table by always adding new rows and content took some time to understand.

How did we test our app?
- By entering the app in chrome and manually trying out various flows the user might encounter
- Using the "network" tab in developer tools to inspect requests and responses to the server
- Using the "Postman" chrome extension to generate GET/POST requests which doesn't included in the basic UI.
  for example - the /item/ PUT request was only tested with Postman, since we couldn't find the right place in the UI.

General notes
- The exercise required us to extend the cookie in every API request beside login/register.
  Instead of doing that in every single app.use function, we decided to push it to the general app.use('/')
  That works a middleware for checking the existence of the cookie and extending it if necessary.
- Not in the original design but, Login returns 200 for ok, 403 if the password doesn't match, and 500 otherwise.
