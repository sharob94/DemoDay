
const ObjectID = require('mongodb').ObjectID

const { response } = require('express');

module.exports = function (app, passport, db) {

  const fetch = require('node-fetch')



  // normal routes ===============================================================

  // show the home page (will also have our login links)


  console.log('routes.js here')

  app.get('/', function (req, res) {
    db.collection('comments').find().toArray((err, comments) => {
      if (err) return console.log(err)
      db.collection('topic').find().toArray((err, topics) => {
        if (err) return console.log(err)
        console.log('TOPICS!!!!',topics)
        res.render('index.ejs', {
          user: req.user,
          comments: comments,
          topics: topics
        })
      })
    })

  });

  // PROFILE SECTION =========================
  // app.get('/profile', isLoggedIn, function (req, res) {
  //   db.collection('messages').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('profile.ejs', {
  //       user: req.user,
  //       messages: result
  //     })
  //   })
  // });
  app.get('/resources', function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('resources.ejs', {
        user: req.user,
        messages: result
      })
    })
  });
  // app.get('/index', function (req, res) {
  //   db.collection('messages').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('index.ejs', {
  //       user: req.user,
  //       messages: result
  //     })
  //   })
  // });
  app.get('/lights', function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('lights.ejs', {
        user: req.user,
        messages: result
      })
    })
  });
  app.get('/maintenance', function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('maintenance.ejs', {
        user: req.user,
        messages: result
      })
    })
  });
  app.get('/profile', function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });
  // function listEvents() {
  //   // const calendar = google.calendar({version: 'v3', auth});
  //   calendar.events.list({
  //     calendarId: 'primary',
  //     timeMin: (new Date()).toISOString(),
  //     maxResults: 10,
  //     singleEvents: true,
  //     orderBy: 'startTime',
  //   }, (err, res) => {
  //     if (err) return console.log('The API returned an error: ' + err);
  //     const events = res.data.items;
  //     if (events.length) {
  //       console.log('Upcoming 10 events:');
  //       events.map((event, i) => {
  //         const start = event.start.dateTime || event.start.date;
  //         console.log(`${start} - ${event.summary}`);
  //       });
  //     } else {
  //       console.log('No upcoming events found.');
  //     }
  //   });
  // }
  app.post('/googleauth', function (req, res) {




    res.render('googleauth.ejs', {

    })
    console.log(req.body)



  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/messages', (req, res) => {
    db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.put('/upVote', (req, res) => {
    db.collection('messages')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $set: {
          thumbUp: req.body.thumbUp + 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/downVote', (req, res) => {
    db.collection('messages')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $set: {
          thumbUp: req.body.thumbDown - 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup',
    {
      // successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    }),
    function (req, res) {
      console.log("Need to do findOneAndUpdate with ectra fields ", req.body, req.user._id)
      res.redirect("/profile")
    });


  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/');
  }


  app.post('/comments', (req, res) => {
    console.log(req.body)
    db.collection('comments').insertOne({ what: req.body.comments, when: req.body.when, where: req.body.where, amount: req.body.amount }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })
  app.get('/search', (req, res) => {
    console.log(req.query.search)
    db.collection('comments').find({ "quote": { $regex: req.query.search, $options: 'i' } }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', { comments: result })
    })
  })

  app.put('/messages', (req, res) => {
    db.collection('comments')
      .findOneAndUpdate({ comments: req.body.comments }, {
        $inc: {
          heart: 1,
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/messages', (req, res) => {
    db.collection('comments').findOneAndDelete({ heart: req.body.heart, comments: req.body.comments }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


  app.post('/createTopic', (req, res) => {
    console.log(req.body)
    db.collection('topic').insertOne({ topic: req.body.topic, description: req.body.description,response:[] }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/')
    })
  })
  app.post('/createResponse', (req, res) => {
    console.log("CREATE RESPONSE",req.body)
    db.collection('topic').findOneAndUpdate({ _id: ObjectID(req.body.topicId )}, {

      $push: {
        response: {
          when: new Date(), description: req.body.description,
  

        }
      }
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/')
    })
  })

};






