OAuth.initialize('PJwJfQ241P-NtKscEwjbWP2QH-g');

var alias = "";
var avatar = "";
var email = "";
var character = "";
var level = "";

function findUser() {
  var user = document.cookie;
  if(user != "") {
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
    $('#game').contents().find('section#oauth').addClass('hide');
    if (level != "") {
      loadLevel(level);
    } else {
      setTimeout(function() {
        loggedin_animation();
      }, 1000);
    }
  } else {
    $( "#game" ).contents().find('body').removeClass('fadebg');
  }
}

$(document).ready(function() {
  $('#game').load(function(){
    if (level == "") {
      findUser();
      var iframe = $('#game').contents();
      if (alias=="") {
        //iframe.find("body").fadeTo("1000", 0);
      }
      iframe.find("#github").click(function(){
        githubLogin();
      });
      iframe.find("a.profile").click(function(){
        createCharacter();
      });
    }
  });
})

function githubLogin() {
  var provider = 'github';

  OAuth.popup(provider)
  .done(function(result) {
    result.me()
    .done(function (response) {
      alias = response.alias;
      avatar = response.avatar;
      email = response.email;
      document.cookie="user=" + alias + "|" + avatar + "|" + email;
      loggedin_animation();
    })
    .fail(function (err) {
      alert("Error logging in to GitHub: " + err)
    });
  })
  .fail(function (err) {
    alert("Error connecting to OAuth.io: " + err)
  });
}

function loadLevel(level_name) {
  setTimeout(function() {
    $('#game').contents().find("body").addClass("fadebg");
    $("#game").attr("src", "/levels/" + level_name + ".article");
    $("#game").load(function() {
      $( "#game" ).contents().find( 'body').removeClass('fadebg');
    });
  }, 500);
}

function nextLevel(step) {
  level = step + 1;
  cookie_data = document.cookie;
  document.cookie = cookie_data.slice(0,cookie_data.length - step.length) + level;
  loadLevel(level);
}

function createCharacter() {
  character = $(this).attr('id');
  document.cookie = document.cookie + "|" + character + "|1";
  $('#game').contents().find('#profiles').fadeOut(300, function() {
    loadLevel(1);
  })
}

function loggedin_animation() {
  $( "#game" ).contents().find('body').removeClass('fadebg');
  //$('section#oauth').addClass('hide');
  $('#game').contents().find('section#oauth').fadeOut( 1000, function() {
    //$(this).addClass('hide');
    $('#game').contents().find('h1.title').fadeOut( 1000, function() {
      //$(this).addClass('hide');
      $('#game').contents().find('#navbar').slideDown( 300, function() {
        //$(this).addClass('visible');
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
