Readme - FiTotal App by Arie Muller ID: 308258243

URL: http://fitotal.herokuapp.com/

The goal behind the UI
- Design a clear login page with indicative warnings for bad input by the user (explained later on).
- Provide a simple dynamic workout planner for people to track their workouts.
  The exercise list is dynamically loaded from the server and later on can be moved to a DB.
  The user creates a workout and can gradually add exercises to any of its workouts.
  Any workout can be shared with a single user and allow him to see your workouts in his app.
  The logout button enables the user to remove the cookie and go back to the login page.

How to use the UI?
** Run "npm install" to get all necessary dependencies **
- Start by running "npm start" inside node-backend directory and react-client dir.
- In chrome, go to http://localhost:3000/ for local version and fitotal.herokuapp.com for online.
- Enter username + password and register
  Trying to login with non-existing user should show red warning "User doesn't exist. Please register first."
  Trying to login with wrong password should show red warning "Bad credentials for admin. Please try again."
  Trying to register with a registered user should show red warning "User already exist."
  *** The user names are managed only by lowercase even if entered differently.
- After login, content page will be loaded with a short description.

- You can add an empty workout by pressing the '+' button.
    Fill out all the necessary fields and press create.
    I've added fields validation to assure no empty fields are being sent to the server.
    The workout is associated with the logged user and owned by him. Only the creating user can add/remove exercises from the workout.
    The "Your workouts" Panel should be updated right after a successful creation.
	*** Sometimes the panel isn't updated right away.
	*** This is caused by the browsers' cache that returns 304 (not modified) instead of 200 for our new workout list
	*** If that happens, refreshing the page should solve the issue.
	*** I hoped that by using res.setHeader('Last-Modified', (new Date()).toUTCString()); the problem is solved.

- After creating the workout, you may add exercises in the "Your workouts" Panel.
    Add an exercise by pressing the '+' under the workout panel.
    Choose your exercise and decide the sets/reps/weight.
    Click "Add" to finish.
    You can remove the exercise later on by pressing "X" near the exercise.
    The workout should be updated instantly.

- You can show only some of the workouts by using the filter field.
    The filter field instantly filters out workouts that doesn't match your search term.
    The fields only filters by workout title or date.

- At the bottom of a specific workout, you can share the workout or delete it completely.
    Sharing a workout opens a modal that checks if the shared user really exists. Only a single user can be shared.
    Trying to share additional user with delete the previous shared user.
    Deleting a workout will delete its' exercises as well.
- Under the "Follow Your Friends" panel you can see all the workouts shared with you (Readonly)
    Any change in the original workout will affect this window as well.
    Shared workouts can also be filtered similarly to the previous filter field.

- In Summary panel you can see all the progress you made over time. 
	The aggregations are made according to the date of the workout


- By pressing "Delete account" the user will be deleted with its' workouts and the cookie as well.
- By pressing the logout button on the bottom, you'll return to the login page and be asked to enter your credentials again.
  Warning: Although not in the original design, The cookie will be deleted when logging out.
           To return to the login menu without deleting the cookie, refresh the page.
