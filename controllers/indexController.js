// Controllers of the routes in index.js
const userModel = require('../routes/users')
const passport  = require('passport')
const studentModel = require('../routes/student')
const interviewModel = require('../routes/interview') 


  exports.Homepage =  async (req, res) => {
    try {
      res.render('index')

    } catch (error) {
      console.error('indexPage error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  };


  exports.Signup =  async (req, res, next) => {
    try {
      console.log(req.body)

      // Checking user already exist or not 
      const { username } = req.body;
      const existingUser = await userModel.findOne({ $or: [{ username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }

      // Creating new user
      const newUser = await new userModel({
        username:req.body.username,
      });
      await userModel.register(newUser,req.body.password)
      await passport.authenticate("local")(req,res,function(){
        res.redirect("/mainPage")   
      });
    
    } catch (error) {
      console.error('SignUp error:', error);
      res.status(500).json({ message: 'SignUp failed' });
    }

  };


  exports.Signin = async (req, res, next) => {
    try {
      passport.authenticate("local", {
        successRedirect: "/mainPage", 
        failureRedirect: "/",
      })(req, res, next);
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ message: 'Signin failed' });
    }
  };

  
  exports.Logout =  async (req, res, next) => {
    try {
      console.log(req.body)
      await req.logOut(function(err){
        if(err) throw err;
        res.redirect('/');
      });
   

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  };


  exports.isLoggedIn =  async (req, res, next) => {
    try {
        if( await req.isAuthenticated()){
            return next();
          }
          else{
            res.redirect('/');
          }

    } catch (error) {
      console.error('isLoggedIn error:', error);
      res.status(500).json({ message: 'isLoggedIn failed' });
    }
  };

  exports.mainPage = async (req,res,next) => {
    try {
        const Student_Data  =  await studentModel.find()
        res.render('main', { Student_Data: Student_Data });
        
    } catch (error) {
      console.error('mainPage error:', error);
      res.status(500).json({ message: 'mainPage render failed' });
    }
  }

  exports.SigninPage = async (req,res,next) => {
    try {
        res.render('SigninPage')
    } catch (error) {
      console.error('SigninPage error:', error);
      res.status(500).json({ message: 'SigninPage render failed' });
    }
  }
  
  exports.AddNewListPage = async (req,res,next) => {
    try {
        const Student_Data  = studentModel.find()
        res.render('AddNewListPage', Student_Data )
    } catch (error) {
      console.error('AddNewListPage error:', error);
      res.status(500).json({ message: 'AddNewListPage render failed' });
    }
  }


  
exports.Add_Student_Profile = async (req, res, next) => {
    try {
      const {
        Batch,
        Student_Name,
        College,
        Status,
        DSA_Final_Score,
        WebD_final_Score,
        React_Final_Score,
   
      } = req.body;
  
      // Validation
      if (!Batch || !Student_Name || !College || !Status || !DSA_Final_Score || !WebD_final_Score || !React_Final_Score ) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Creating new student profile
      const newStudentProfile = await studentModel.create({
        Batch,
        Student_Name,
        Student_Details: {
          College,
          Status,
        },
        Course_Score: {
          DSA_Final_Score,
          WebD_final_Score,
          React_Final_Score,
        },
       
      });
  
      // Sending success response to mainpage
      res.status(201).redirect('/mainPage')
    } catch (error) {
      console.error('Add_Student_Profile error:', error);
      res.status(500).json({ message: 'Add_Student_Profile failed' });
    }
  };

  exports.List_of_Interviews = async (req, res, next) => {
    try {
        const list = await interviewModel.find(); // 
        console.log(list)
        res.render('List_of_Interviews_Page', { list: list });
    } catch (error) {
        console.error('List_of_Interviews error:', error);
        res.status(500).json({ message: 'List_of_Interviews failed' });
    }
};

exports.ScheduleD_Interview = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);
        const studentId = req.params.Student_ID;
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const newInterview = await interviewModel.create({
            Interviews_Details: {
                Company_Name: req.body.Company_Name,
                Date: req.body.Date,
              },
        });

        // conducting interview of student
        await student.Interviews.push(newInterview._id);
        await student.save();

        // Sending a success response to list of interviews page
        res.status(201).redirect('/List_of_Interviews');
    } catch (error) {
        console.error('ScheduleD_Interview error:', error);
        res.status(500).json({ message: `ScheduleD_Interview failed: ${error.message}` });
    }
};

exports.Schedule_an_Interview = async (req, res, next) => {
    const Student_ID = req.params.Student_ID;
    res.render('InterviewScheduled_Page', { Student_ID: Student_ID });
};


exports.updateResult  =  async (req, res, next) =>  {
    try {
      const interviewId = req.params.interviewId;
      const resultValue = req.body.result;
  
      if (!interviewId || !resultValue) {
        return res.status(400).json({ message: 'Invalid request' });
      }
  
      const interview = await interviewModel.findById(interviewId);
      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }
  
      // Updating result in database
      interview.Interviews_Details.Results = resultValue;
      await interview.save();
  
      // redirecting back to list of interviews
      res.redirect('/List_of_Interviews');
    } catch (error) {
      console.error('Update Result error:', error);
      res.status(500).json({ message: 'Update Result failed' });
    }
  } 
