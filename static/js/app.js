OAuth.initialize('PJwJfQ241P-NtKscEwjbWP2QH-g');

// Global Vars
var alias = "";
var avatar = "";
var email = "";
var character = "";
var level = "";

$(document).ready(function() {
  // If the user hasn't started playing
  $('#game').load(function(){
    if (level == "") {
      // Look for a cookie once the iframe loads
      findUser();
      var iframe = $('#game').contents();
      // capture the github login click
      iframe.find('#github').click(function(){
        githubLogin();
      });
      // capture the character selection click
      iframe.find('a.profile').click(function(){
        createCharacter(this);
      });
    }
  });
})

// See if the user is logged in
function findUser() {
  loadCookieData();

  // Found a user
  if(alias != "") {

    // Hide the login
    $('#game').contents().find('section#oauth').addClass('hide');

    // If this user has started playing, load their level
    if (level != "") {
      loadLevel(level);
    } else {
      // If they haven't started playing, start the intro animation
      setTimeout(function() {
        opening_scene();
      }, 1000);
    }
  } else {
    // If this is a new user, fade to the opening scene
    $('#game').contents().find('body').addClass('opening');
    $('#game').contents().find('body').removeClass('fadebg');
  }
}

function loadCookieData() {
  var user = document.cookie;

  // Load the cookie data into the global vars
  user = user.replace("user=","");
  user_data = user.split("|");
  alias = user_data[0];
  if (user_data.length > 1) {
    avatar = user_data[1];
  }
  if (user_data.length > 2) {
    email = user_data[2];
  }
  if (user_data.length > 3) {
    character = user_data[3];
  }
  if (user_data.length > 4) {
    level = user_data[4];
  }
}

// Use Oauth.io to login to GitHub
function githubLogin() {
  var provider = 'github';

  OAuth.popup(provider)
  .done(function(result) {
    result.me()
    .done(function (response) {
      // capture the global vars
      alias = response.alias;
      avatar = response.avatar;
      email = response.email;
      // set the cookie
      document.cookie="user=" + alias + "|" + avatar + "|" + email;
      // show the opening scene
      opening_scene();
    })
    .fail(function (err) {
      //alert("Error logging in to GitHub: " + err)
    });
  })
  .fail(function (err) {
    //alert("Error connecting to OAuth.io: " + err)
  });
}

// load the specified level
function loadLevel(level_name) {
  // Fade out the current scene
  $('#game').contents().find("body").addClass("fadebg");
  // Wait for BG fade to complete
  setTimeout(function() {
    // Switch the scene
    $('#game').attr("src", "/levels/" + level_name + ".article");
    // Fade in the new scene
    $('#game').load(function() {
      // Update the body bg
      body = $('#game').contents().find('body');
      body.addClass('level' + level_name);
      body.removeClass('fadebg');

      // Hide the title and update the nav bar
      level_heading = $('#game').contents().find('h1.title');
      level_title = level_heading.text();
      level_heading.remove()
      navbar_title = $('#game').contents().find('#navbar h2');
      navbar_title.text(navbar_title.text() + ": " + level_title);
      $('#game').contents().find('#navbar').removeClass('hide');
      laptop = $('#game').contents().find('#laptop');
      laptop.addClass('hide');

      // Show the intro script
      intro = $('#game').contents().find('#' + character);
      intro.insertAfter($('#game').contents().find('#laptop'));
      if(character == 'dee') {
        $('#game').contents().find('#jason').remove()
      } else {
        $('#game').contents().find('#dee').remove()
      }
      setTimeout(function() {
        laptop.removeClass('hide');
        intro.removeClass('hide');
        setTimeout(function() {
          laptop.addClass('movehigher');
        }, 100);
      }, 1000);
    });
  }, 500);
}

// move to the next level
function nextLevel(step) {
  level = step + 1;
  cookie_data = document.cookie;
  document.cookie = cookie_data.slice(0,cookie_data.length - step.length) + level;
  loadLevel(level);
}

// capture the user's character selection
function createCharacter(selected) {
  character = $(selected).attr('id');
  document.cookie = document.cookie + "|" + character + "|1";
  $('#game').contents().find('#profiles').fadeOut(300, function() {
    loadLevel(1);
  })
}

// show the opening scene
function opening_scene() {
  $('#game').contents().find('body').addClass('opening');
  $('#game').contents().find('body').removeClass('fadebg');
  $('#game').contents().find('section#oauth').fadeOut( 1000, function() {
    $('#game').contents().find('h1.title').fadeOut( 1000, function() {
      $('#game').contents().find('#navbar').slideDown( 300, function() {
        if(character == "") {
          $('#game').contents().find('#profiles').fadeIn(300, function() {
          })
        } else {
          loadLevel(1);
        }
      });
    });
  });
}
