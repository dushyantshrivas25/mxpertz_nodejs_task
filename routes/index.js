var express = require('express');
var router = express.Router();
const passportLocal = require("passport-local")
const userModel = require("./users")
const passport = require("passport");

const  { 
         Homepage,
         Signup,
         Signin,
         Logout,
         isLoggedIn,
         mainPage,
         SigninPage,
         AddNewListPage,
         Add_Student_Profile,
         List_of_Interviews,
         ScheduleD_Interview,
         Schedule_an_Interview,
         updateResult

} = require('../controllers/indexcontroller')

//passport authentication
passport.use(new passportLocal(userModel.authenticate()));

/* GET home page. */
router.get('/', Homepage);

// Signup
router.post("/SignUp", Signup );

//login
router.post("/Signin", Signin);

// To render mainPage
router.get('/mainPage',isLoggedIn, mainPage)

// To render signInPage
router.get('/SigninPage',SigninPage)

//logout
router.get("/Logout",Logout);

// AddNewList
router.get('/AddNewListPage', isLoggedIn, AddNewListPage)

//Add_Student_Profile
router.post('/Add_Student_Profile',isLoggedIn, Add_Student_Profile)

//List_of_Interviews
router.get('/List_of_Interviews',isLoggedIn, List_of_Interviews )

// /Schedule_Interview_/<%= data._id %>
router.get('/Schedule_an_Interview_/:Student_ID',isLoggedIn,Schedule_an_Interview)

// /Schedule_Interview_/<%= data._id %> Schedule_Interview
router.post('/ScheduleD_Interview/:Student_ID',isLoggedIn,ScheduleD_Interview)

router.post('/updateResult/:interviewId', isLoggedIn, updateResult)


module.exports = router;
