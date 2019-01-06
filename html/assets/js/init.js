$(document).ready(function() {
  var page = 'menu';
  var subPage = null;
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();

  // LUA event listener
  window.addEventListener('message', function( event ) {
    if ( event.data.action == 'open' ) {
      var data = event.data.array;
      Object.keys( data ).forEach(function(key) {
        if (data[key].classified == 1) {
          $('#welcome tbody').append('<tr title="classified" class="markup" offense="'+data[key].offense+'">'+
            '<td>classified</td>'+
            '<td>classified</td>'+
            '<td>classified</td>'+
            '<td>classified</td>'+
            '<td>classified</td>'+
          '</tr>');
        } else {
          $('#welcome tbody').append('<tr offense="'+data[key].offense+'">'+
            '<td>'+data[key].date+'</td>'+
            '<td>'+data[key].offense+'</td>'+
            '<td>'+data[key].institution+'</td>'+
            '<td>'+data[key].charge+'</td>'+
            '<td>'+data[key].term+'</td>'+
          '</tr>');
        }
      });

      $('#criminal-record-wrapper').show();
    }
  });

  $('#date').text(d.getFullYear() + '-' +((''+month).length<2 ? '0' : '') + month + '-' +((''+day).length<2 ? '0' : '') + day);

  // Menu - add
  $('#menu-add').click(function() {
    page = 'add';
    subPage = null;
    $('#welcome').hide();
    $('#add').show();
  });

  // Menu - search
  $('#menu-search').click(function() {
    page = 'search';
    $('#welcome').hide();
    $('#search').show();
  });

  // Back to home page
  $('.back, .logo').click(function() {
    $('#search').hide();
    if ( subPage == null ) {
      $('#welcome tbody').html('');

      $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
        type: 'start'
      }), function( cb ) {
        Object.keys( cb ).forEach(function(key) {
          if (cb[key].classified == 1) {
            $('#welcome tbody').append('<tr title="classified" class="markup" offense="'+cb[key].offense+'">'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
            '</tr>');
          } else {
            $('#welcome tbody').append('<tr offense="'+cb[key].offense+'">'+
              '<td>'+cb[key].date+'</td>'+
              '<td>'+cb[key].offense+'</td>'+
              '<td>'+cb[key].institution+'</td>'+
              '<td>'+cb[key].charge+'</td>'+
              '<td>'+cb[key].term+'</td>'+
            '</tr>');
          }
        });
      });

      $('#'+page).hide();
      page = 'menu';
      $('#menu').show();
      $('#welcome').show();
      $('#search-result tbody').html('');
    } else {
      $('#'+subPage).hide();
      subPage = null;
      $('#search').show();
      $('#search-result tbody').html('');
    }
  });

  function getUser(dob) {
    $('#records tbody').html('');

    $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
      type: 'user',
      dob: dob,
    }), function( cb ) {
      if ( cb != 'error') {
        var recordid = cb['userinfo'][0].recordid;
        var dob = cb['userinfo'][0].dob;
        var sex = cb['userinfo'][0].sex;

        $('.r-recordid').text(recordid);
        $('.r-name').text(cb['userinfo'][0].lastname +', '+ cb['userinfo'][0].firstname);
        $('.r-dob').text(dob);
        $('.r-aliases').text(cb['userinfo'][0].aliases);
        $('.r-sex').text(sex);
        $('.r-height').text(cb['userinfo'][0].height);
        $('.r-weight').text(cb['userinfo'][0].weight);
        $('.r-eyecolor').text(cb['userinfo'][0].eyecolor);
        $('.r-haircolor').text(cb['userinfo'][0].haircolor);

        $('.r-dob-year').html('<i>Y</i>' + dob.substr(2,2));
        $('.r-dob-month').html('<i>M</i>' + dob.substr(5,2));
        $('.r-dob-day').html('<i>D</i>' + dob.substr(8,2));
        $('.r-dob-lastdigits').html('<i>X</i>' + dob.substr(11,4));

        for (var i = 0; i < recordid.length; i++) {
          $('#r-recordid .square:eq('+i+')').text(recordid.charAt(i));
        }

        if ( sex == 'M' ) {
          $('.avatar').attr('src', 'assets/images/male.png');
        } else {
          $('.avatar').attr('src', 'assets/images/female.png');
        }

        Object.keys( cb['records'] ).forEach(function(key) {
          if (cb['records'][key].classified == 1) {
            $('#records tbody').append('<tr title="classified" class="markup" offense="'+cb['records'][key].offense+'">'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
            '</tr>');
          } else {
            $('#records tbody').append('<tr offense="'+cb['records'][key].offense+'">'+
              '<td>'+cb['records'][key].date+'</td>'+
              '<td>'+cb['records'][key].offense+'</td>'+
              '<td>'+cb['records'][key].institution+'</td>'+
              '<td>'+cb['records'][key].charge+'</td>'+
              '<td>'+cb['records'][key].term+'</td>'+
            '</tr>');
          }
        });

        $('#menu').hide();
        $('#'+page).hide();
        page = 'criminal-record';
        $('#criminal-record').show();
      } else {
        console.log('error');
      }
    });
  }

  // Records table click
  $("body").on("click", "tbody tr", function() {
    if( !$(this).hasClass('markup') ) {
      if( !$(this).hasClass('user-search') ) {
        $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
          type: 'record',
          offense: $(this).attr('offense'),
        }), function( cb ) {
          if ( cb != 'error' ) {
            var offense = cb['records'][0].offense;
            var term = cb['records'][0].term.split(" ");

            $('.r-date').text(cb['records'][0].date);
            $('.r-charge').text(cb['records'][0].charge);
            $('.r-name').text(cb['userinfo'][0].lastname +', '+ cb['userinfo'][0].firstname);
            $('.r-dob').text(cb['records'][0].dob);
            $('.r-description').text(cb['records'][0].description);
            $('.r-offense').text(offense)
            $('#the-signature').text(cb['records'][0].warden);
            $('.r-year').html('<i>Y</i>' + parseInt(term[0]));
            $('.r-month').html('<i>M</i>' + parseInt(term[1]));
            $('.r-day').html('<i>D</i>' + parseInt(term[2]));

            for (var i = 0; i < offense.length; i++) {
              $('#r-offense .square:eq('+i+')').text(offense.charAt(i));
            }

            if ( cb['userinfo'][0].sex == 'M' ) {
              $('.avatar').attr('src', 'assets/images/male.png');
            } else {
              $('.avatar').attr('src', 'assets/images/female.png');
            }

            $('#menu').hide();
            $('#'+page).hide();
            page = 'record-info';
            $('#record-info').show();
          } else {
            console.log('error');
          }
        });
      } else {
        getUser($(this).attr('dob'));
      }
    }
  });

  // Dateofbirth click
  $('.dob').click(function() {
    getUser($(this).text());
  });

  // Submit search - Search the database
  $('#submit-search').click(function() {
    subPage = 'search-result';
    $('#search').hide();
    $('#search-result').show();
    $('#search-result p').text('Searching..');

    var offense = $('#offense-search').val();

    if ( offense.length > 0 ) {
      $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
        type: 'record',
        offense: offense,
      }), function( cb ) {
        if ( cb != 'error' ) {
          var offense = cb['records'][0].offense;
          var term = cb['records'][0].term.split(" ");

          $('.r-date').text(cb['records'][0].date);
          $('.r-charge').text(cb['records'][0].charge);
          $('.r-name').text(cb['userinfo'][0].lastname +', '+ cb['userinfo'][0].firstname);
          $('.r-dob').text(cb['records'][0].dob);
          $('.r-description').text(cb['records'][0].description);
          $('.r-offense').text(offense)
          $('#the-signature').text(cb['records'][0].warden);
          $('.r-year').html('<i>Y</i>' + parseInt(term[0]));
          $('.r-month').html('<i>M</i>' + parseInt(term[1]));
          $('.r-day').html('<i>D</i>' + parseInt(term[2]));

          for (var i = 0; i < offense.length; i++) {
            $('#r-offense .square:eq('+i+')').text(offense.charAt(i));
          }

          if ( cb['userinfo'][0].sex == 'M' ) {
            $('.avatar').attr('src', 'assets/images/male.png');
          } else {
            $('.avatar').attr('src', 'assets/images/female.png');
          }

          $('#menu').hide();
          $('#'+page).hide();
          page = 'record-info';
          $('#record-info').show();
        } else {
          $('#search-result p').text('No results found');
        }
      });
    } else {
      $.post('http://jsfour-criminalrecord/search', JSON.stringify( {
        firstname: $('#firstname-search').val().toUpperCase(),
        lastname: $('#lastname-search').val().toUpperCase(),
        dob: $('#dob-search').val(),
        offense: offense
      }), function( cb ) {
        if ( cb != 'error' ) {
          $('#search-result p').text('');
          Object.keys( cb ).forEach(function(key) {
            $('#search-result tbody').append('<tr class="user-search" dob="'+cb[key].dob+'">'+
              '<td>'+cb[key].firstname+'</td>'+
              '<td>'+cb[key].lastname+'</td>'+
              '<td>'+cb[key].dob+'</td>'+
            '</tr>');
          });
          $('#'+page).hide();
          $('#search-result').show();
        } else {
          $('#search-result p').text('No results found');
        }
      });
    }
  });

  // Submit add - Add to database
  $('#submit-add').click(function() {
    var firstname = $('#firstname-add').val();
    var lastname  = $('#lastname-add').val();
    var dob       = $('#dob-add').val();
    var charge    = $('#charge-add').val();
    var description = $('#description-add').val();
    var term = $('#term-add').val();
    var date = $('#date-add').val();

    if ( firstname.length > 0 && lastname.length > 0 && dob.length > 0 && charge.length > 0 && description.length > 0 && term.length > 0 && date.length > 0 ) {
      $.post('http://jsfour-criminalrecord/add', JSON.stringify({
        firstname: firstname.toUpperCase(),
        lastname: lastname.toUpperCase(),
        dob: dob,
        charge: charge,
        description: description,
        term: term,
        date: date
      }), function( cb ) {
        if ( cb != 'error' ) {
          var offense = cb['records'][0].offense;
          var term = cb['records'][0].term.split(" ");

          $('.r-date').text(cb['records'][0].date);
          $('.r-charge').text(cb['records'][0].charge);
          $('.r-name').text(cb['userinfo'][0].lastname +', '+ cb['userinfo'][0].firstname);
          $('.r-dob').text(cb['records'][0].dob);
          $('.r-description').text(cb['records'][0].description);
          $('.r-offense').text(offense)
          $('#the-signature').text(cb['records'][0].warden);
          $('.r-year').html('<i>Y</i>' + parseInt(term[0]));
          $('.r-month').html('<i>M</i>' + parseInt(term[1]));
          $('.r-day').html('<i>D</i>' + parseInt(term[2]));

          for (var i = 0; i < offense.length; i++) {
            $('#r-offense .square:eq('+i+')').text(offense.charAt(i));
          }

          if ( cb['userinfo'][0].sex == 'M' ) {
            $('.avatar').attr('src', 'assets/images/male.png');
          } else {
            $('.avatar').attr('src', 'assets/images/female.png');
          }

          $('#menu').hide();
          $('#'+page).hide();
          page = 'record-info';
          $('#record-info').show();
        } else {
          $('#add .error').slideDown( "slow", function() {
            setTimeout(function(){
              $('#add .error').slideUp('slow');
            }, 4000);
          });
        }
      });
    }
  });

  // Submit update - Updates the description of a record
  $('#submit-update').click(function() {
    $.post('http://jsfour-criminalrecord/update', JSON.stringify({
      offense: $('#signature .r-offense').text(),
      description: $('.r-description').val()
    }), function( cb ) {
      $('#welcome tbody').html('');

      $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
        type: 'start'
      }), function( cb ) {
        Object.keys( cb ).forEach(function(key) {
          if (cb[key].classified == 1) {
            $('#welcome tbody').append('<tr title="classified" class="markup" offense="'+cb[key].offense+'">'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
            '</tr>');
          } else {
            $('#welcome tbody').append('<tr offense="'+cb[key].offense+'">'+
              '<td>'+cb[key].date+'</td>'+
              '<td>'+cb[key].offense+'</td>'+
              '<td>'+cb[key].institution+'</td>'+
              '<td>'+cb[key].charge+'</td>'+
              '<td>'+cb[key].term+'</td>'+
            '</tr>');
          }
        });
      });

      $('#'+page).hide();
      page = 'menu';
      $('#menu').show();
      $('#welcome').show();
    });
  });

  // Submit classified - Makes a record classified
  $('#submit-classified').click(function() {
    $.post('http://jsfour-criminalrecord/update', JSON.stringify({
      offense: $('#signature .r-offense').text(),
      classified: 1
    }), function( cb ) {
      $('#welcome tbody').html('');

      $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
        type: 'start'
      }), function( cb ) {
        Object.keys( cb ).forEach(function(key) {
          if (cb[key].classified == 1) {
            $('#welcome tbody').append('<tr title="classified" class="markup" offense="'+cb[key].offense+'">'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
              '<td>classified</td>'+
            '</tr>');
          } else {
            $('#welcome tbody').append('<tr offense="'+cb[key].offense+'">'+
              '<td>'+cb[key].date+'</td>'+
              '<td>'+cb[key].offense+'</td>'+
              '<td>'+cb[key].institution+'</td>'+
              '<td>'+cb[key].charge+'</td>'+
              '<td>'+cb[key].term+'</td>'+
            '</tr>');
          }
        });
      });

      $('#'+page).hide();
      page = 'menu';
      $('#menu').show();
      $('#welcome').show();
    });
  });

  // Submit delete - Deletes a record, removes user as well if it's the only record
  $('#submit-delete').click(function() {
    $.post('http://jsfour-criminalrecord/remove', JSON.stringify({
      offense: $('#signature .r-offense').text()
    }), function( cb ) {
      $('#welcome tbody').html('');

      $.post('http://jsfour-criminalrecord/fetch', JSON.stringify({
        type: 'start'
      }), function( cb ) {
        Object.keys( cb ).forEach(function(key) {
          if (cb[key].classified = 1) {
            $('#welcome tbody').append('<tr title="classified" class="markup" offense="'+cb[key].offense+'">'+
              '<td>'+cb[key].date+'</td>'+
              '<td>'+cb[key].offense+'</td>'+
              '<td>'+cb[key].institution+'</td>'+
              '<td>'+cb[key].charge+'</td>'+
              '<td>'+cb[key].term+'</td>'+
            '</tr>');
          } else {
            $('#welcome tbody').append('<tr class="markup" offense="'+cb[key].offense+'">'+
              '<td>'+cb[key].date+'</td>'+
              '<td>'+cb[key].offense+'</td>'+
              '<td>'+cb[key].institution+'</td>'+
              '<td>'+cb[key].charge+'</td>'+
              '<td>'+cb[key].term+'</td>'+
            '</tr>');
          }
        });
      });

      $('#'+page).hide();
      page = 'menu';
      $('#menu').show();
      $('#welcome').show();
    });
  });

  // Reset webpage
  function reset() {
    $('#search-result tbody').html('');
    $('#welcome tbody').html('');
    $('#records tbody').html('');
    $('#'+page).hide();
    page = 'menu';
    $('#search').hide();
    $('#search-result').hide();
    $('#menu').show();
    $('#welcome').show();
    $('#criminal-record-wrapper').hide();
  }

  // Close NUI - Escape key event
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      reset();
      $.post('http://jsfour-criminalrecord/escape', JSON.stringify({}));
    }
  });

  // Disable form submit
  $("form").submit(function() {
		return false;
	});
});
