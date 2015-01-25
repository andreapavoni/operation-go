OAuth.initialize('PJwJfQ241P-NtKscEwjbWP2QH-g');

// Global Vars
var alias = "";
var avatar = "";
var email = "";
var persona = "";
var level = 0;

$(document).ready(function() {

  // If the user hasn't started playing
  $('iframe#game').load(function(){

    if (level == "") {
      navbar = $('iframe#game').contents().find('section#navbar');
      navbar.addClass('hide');
      navbar.removeClass('slidedown');
      // Look for a cookie once the iframe loads
      findUser();
      var iframe = $('iframe#game').contents();
      // capture the github login click
      iframe.find('a#github').click(function(){
        githubLogin();
      });
      // capture the persona selection click
      iframe.find('a.profile').click(function(){
        createPersona(this);
      });
    }

    // Listen for the restart click
    restart = $('iframe#game').contents().find('a#restart');
    restart.click(function() {
      restartGame();
    });
  });
})

// See if the user is logged in
function findUser() {
  loadCookieData();

  // Found a user
  if(alias != "") {
    // Hide the login
    $('iframe#game').contents().find('section#oauth').addClass('hide');

    // If this user has started playing, load their level
    if (level != "") {
      loadLevel(level);
    } else {
      // If they haven't started playing, start the intro animation
      openingScene();
    }
  } else {
    // If this is a new user, fade to the opening scene
    oauth = $('iframe#game').contents().find('section#oauth');
    oauth.insertAfter($('iframe#game').contents().find('div#content'));

    title = $('iframe#game').contents().find('h1.title');
    title.insertAfter($('iframe#game').contents().find('div#content'));
    $('iframe#game').contents().find('h1.title').first().addClass('big');

    //$('iframe#game').contents().find('body').addClass('slidedown');
    $('iframe#game').contents().find('body').addClass('opening');
    $('iframe#game').contents().find('body').removeClass('fadebg');
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
    persona = user_data[3];
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
      openingScene();
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
  $('iframe#game').contents().find("body").addClass("fadebg");
  // Wait for BG fade to complete
  setTimeout(function() {
    // Switch the scene
    $('iframe#game').attr("src", "/levels/" + level_name + "/level.article");
    // Fade in the new scene
    $('iframe#game').load(function() {


      // Update the body bg
      body = $('iframe#game').contents().find('body');
      body.removeClass('fadebg');

      // Hide the title and update the nav bar
      level_heading = $('iframe#game').contents().find('h1.title');
      level_title = level_heading.text();
      level_heading.remove()
      setupNavBar();
      laptop = $('iframe#game').contents().find('section#laptop');
      laptop.addClass('hide');

      // Show the intro script
      intro = $('iframe#game').contents().find('#' + persona);
      intro.insertAfter(laptop);
      if(persona == 'dee') {
        $('iframe#game').contents().find('section#jason').remove()
      } else {
        $('iframe#game').contents().find('section#dee').remove()
      }

      output = $('iframe#game').contents().find('div.output')
      intro.append(output);

      been_run = false;

      // Listen for the run click
      run = $('iframe#game').contents().find('div#editor button.run').first();
      run.off();
      run.click(function(event) {
        // Keep the run button
        run.attr('style','');

        // Only replace the script the first time
        if (!been_run) {
          // Move the console output
          output = $('iframe#game').contents().find('div.output')
          intro.html('');
          intro.append(output);
          been_run = true;
        }
        pollForOutput();
      });

      // Listen for the restart click
      restart = $('iframe#game').contents().find('a#restart');
      restart.off();
      restart.click(function() {
        restartGame();
      });

      // ensure the right persona names are in the code
      replaceName();

      body.addClass('level' + level_name);

      // Render the animations
      setTimeout(function() {
        laptop.removeClass('hide');
        intro.removeClass('hide');
        setTimeout(function() {
          laptop.addClass('movehigher');
          intro.addClass('movehigher');
        }, 200);
      }, 1500);

    });
  }, 100);
}

function setupNavBar() {
  navbar_title = $('iframe#game').contents().find('section#navbar h2');
  if(level > 0 && level_title != '') {
    navbar_title.html("Operation Go: <span>" + level_title + "</span>");
    $('iframe#game').contents().find('span#alias').html(alias);
    if (avatar != "" && avatar != "undefined") {
      $('iframe#game').contents().find('span#avatar').html('<img src="' + avatar + '" height="20" width="20" />');
    }
  }
  if(level == 0) {
    $('iframe#game').contents().find('section#navbar h2').html("Operation Go");
  }

  $('iframe#game').contents().find('section#navbar').removeClass('hide');
}

// move to the next level
function nextLevel(step) {
  level = parseInt(step) + 1;
  cookie_data = document.cookie;
  document.cookie = cookie_data.slice(0,cookie_data.length - step.length) + level;
  loadLevel(level);
}

// capture the user's persona selection
function createPersona(selected) {
  persona = $(selected).attr('id');
  document.cookie = document.cookie + "|" + persona + "|1";
  $('iframe#game').contents().find('div#profiles').removeClass('slideup');
  setTimeout(function() {
    level = 1;
    loadLevel(1);
  }, 1000);
}

// show the opening scene
function openingScene() {
  navbar.removeClass('hide');
  body = $('iframe#game').contents().find('body');
  // if we came from the opening screen
  if(body.hasClass('opening')) {
    $('iframe#game').contents().find('section#oauth').addClass('disappear');
    $('iframe#game').contents().find('h1.title').addClass('disappear');
    body.addClass('from-intro');
  } else {
    // we are logged in but haven't chosen a persona yet
    body.addClass('opening');
    body.removeClass('fadebg');
  }
  setTimeout(function() {
    if(persona == "") {
      navbar = $('iframe#game').contents().find('section#navbar');

      navbar.addClass('slidedown');
      profiles = $('iframe#game').contents().find('div#profiles');
      profiles.insertAfter($('iframe#game').contents().find('div#content'));
      $('iframe#game').contents().find('div#profiles').removeClass('slideup');
      setTimeout(function() {
        $('iframe#game').contents().find('div#profiles').addClass('slideup');
      }, 500);
    } else {
      level = 1;
      loadLevel(1);
    }
  }, 1000);
}

// replaces the persona name in any source code
function replaceName() {
  if(persona == 'dee') {
    $('iframe#game').contents().find("div#editor span:contains('Jason Marshall')").each(function(){
      $this = $(this);
      content = $this.text();
      $this.text(content.replace('Jason Marshall', 'Dee Fercloze'));
    });
  }
}

function pollForOutput() {
  // Listen for console output
  output = $('iframe#game').contents().find('span.system').text();
  if (output != "") {
    // check answer
    validateLevel();
  } else {
    setTimeout(function() {
      pollForOutput();
    }, 200);
  }
}

function validateLevel() {
  stdout = $('iframe#game').contents().find('span.stdout');
  solution = stdout.text().replace(/(\r\n|\n|\r)/gm,"");
  encrypted_solution = CryptoJS.SHA3(solution);
  if(answer[level+"-"+persona] == encrypted_solution) {
    // right solution
    nextLevel(level);
  } else {
    // wrong solution - post a sorry message
    fail = getFailMessage();
    stdout.html(stdout.html() + "<span class='fail'>" + fail + "</span>");
  }
}

function getFailMessage() {
  you = "ma'am";
  other_persona = "Jason";
  if(persona == "jason") {
    you = "mate";
    other_persona = "Dee";
  }

  choice = Math.floor(Math.random() * 25)

  message = new Array();
  message[0] = "Sorry " + you + ", but you'll be back at basic with solutions like these.";
  message[1] = capitalize(persona) + "! Get it together.";
  message[2] = "I have all day. Do you?";
  message[3] = "Work like that will get you killed on a mission like this.";
  message[4] = "I knew we should have sent " + other_persona + " on this mission.";
  message[5] = "Nope. Try harder.";
  message[6] = "You'll have to do better than this to defeat Epoch.";
  message[7] = "Apparently monkeys have overtaken your keyboard.";
  message[8] = "Epoch is only getting stronger.";
  message[9] = "It's better to be right than dead.";
  message[10] = "That's not quite right.";
  message[11] = "That doesn't pass the smell test.";
  message[12] = "Good try, but no.";
  message[13] = "Need I remind you, your life is on the line here.";
  message[14] = "Nope.";
  message[15] = "Sorry, that's not right.";
  message[16] = "Please try again.";
  message[17] = "OK, try it again, but think this time.";
  message[18] = "Maybe in some other language, but not in Go.";
  message[19] = "I'd say take a breather, but Epoch never rests.";
  message[20] = "Ooh, I bet you'd be great at JavaScript!";
  message[21] = "I could debug that with my eye's closed.";
  message[22] = "OK, now try writing some good code.";
  message[23] = "Yep, I mean nope. Sorry.";
  message[24] = "This is an in-and-out mission, please keep that in mind.";

  return message[choice];
}

function capitalize(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function restartGame() {
  // Reset the user's cookie
  document.cookie="user=" + alias + "|" + avatar + "|" + email;
  // Clear the global variables
  level = 0;
  persona = "";

  // Fade out the current scene
  $('iframe#game').contents().find("body").addClass("fadebg");
  // Wait for BG fade to complete
  setTimeout(function() {
    // Switch the scene
    $('iframe#game').attr("src", "/opening.article");
  }, 500);
}
