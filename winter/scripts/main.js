var resize = function() {
  var minMargin = 50;
  var $wrapper = $('.content-wrapper:visible');
  var $content = $wrapper.find('.content').css({
    'margin-top': 0,
    'margin-bottom': 0
  });
  var contentWrapperHeight = $wrapper.height();
  var contentHeight = $content.height();  
  var margin = (contentWrapperHeight - contentHeight)/2;
  margin = margin < minMargin ? minMargin : margin;
  $content.css({
    'margin-top': margin + 'px',
    'margin-bottom': margin + 'px'
  });
};


// Class to represent a member of the secret something
function Member(name, email) {
  var self = this;
  self.name = ko.observable(name);
  self.email = ko.observable(email);
};

// Main functions
function ViewModel() {
  var self = this;

  // Editable Data
  self.eventDate = ko.observable("");

  self.niceEventDate = ko.computed(function() {
    var datestring = self.eventDate();
    var d = new Date(datestring);
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var currDate = d.getDate();
    var sup = "";
    if (currDate == 1 || currDate == 21 || currDate ==31){
      sup = "st"; }
    else if (currDate == 2 || currDate == 22){
      sup = "nd"; }
    else if (currDate == 3 || currDate == 23){
      sup = "rd"; }
    else {
      sup = "th"; }
    
    var niceDate = monthNames[d.getMonth()] + " " + currDate + "<sup>" + sup + "</sup>, " + d.getFullYear();
      return niceDate;
    });

  self.eventTitle = ko.observable("");
  self.hostName = ko.observable("");
  self.hostEmail = ko.observable("");
  self.desc = ko.observable("");
  self.members = ko.observableArray();

  // add organizer to participants array once they've input their info
  if(self.hostName !== '' && self.hostEmail !== ''){
    self.members = ko.observableArray([
      { name: self.hostName, email: self.hostEmail }
    ]);
  }


  // Operations
  self.addMember = function () {
    self.members.push(new Member($('#memberName').val(), $('#memberEmail').val()));
    $('#memberName').val('');
    $('#memberEmail').val('');
    resize();
  };
  self.removeMember = function (member) {
    self.members.remove(member);
    resize();
  };

  self.sendAllInfoToServer = function (item, event) {
    // check that at least 3 members are added (including host)
    if(self.members().length < 3){
      return;
    }
    var data = {
      hostName: self.hostName(),
      hostEmail: self.hostEmail(),
      eventTitle: self.eventTitle(),
      eventDate: self.niceEventDate(),
      desc: self.desc(),
      members: []
    };
    var allMembers = self.members();

    // add members to data members array
    for (var i = 0; i < allMembers.length; i++) {
      data.members.push({ 
        name: allMembers[i].name(), 
        email: allMembers[i].email()
      });
    };

    //send data to PHP
    $.ajax({
      url: 'process.php',
      type: 'POST',
      dataType: 'text',
      data: { data: JSON.stringify(data) },
    })
    .done(function(data) {
      console.log("success");
      // ADD HERE: redirection to existing success page (disable current click direct there)
      console.log(data);
    })
    .fail(function(data) {
      console.log("error");
      // ADD HERE: redirection to error page (something went wrong, please start again)
      console.log(data);
    })
    .always(function(data) {
      console.log("complete");
    });
    
  };

};

ko.applyBindings(new ViewModel());

$(window).resize(function () {
  resize();
});

//
$(function () {
  resize();

  $('.next').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled'))
    {
      $(this).parents('section').hide().next().show();
      resize();
    }
  });

  //wrap next button link text in span. done via js to get around text generated by knockout
  $('a.btn.next').contents().wrap('<span/>');

  //datepicker
  $('#datepicker2 input').datepicker().on('changeDate', function (ev) {
    $('#date-daily2').change();
  });
  $('#date-daily2').on('change', function () {
    $('#date-daily2').val();
    $( "#date-daily2" ).datepicker("hide");
  });

  $('.add').click(function(){
      $(this).parents('section').find('.next').wrapInner('<span/>')
  });

  //EMAIL VALIDATION VARIABLE
  var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;

  //VALIDATION CHECKS
  $('#start-form > *').on(("change", "keyup"), function(){
    if($('.eventTitle').val() !== '' && $('.hostName').val() !== '' && $('#date-daily2').val() !== '' && $('.eventDescription').val() !== '' && testEmail.test($('.hostEmail').val())) {
      $('.form .btn.next').removeClass('disabled');
    } else {
      if($('.form .btn.next:not(.disabled)')) {
        //otherwise set it as disabled
        $('.form .btn.next').addClass('disabled');
      }
    }
  });


  $('#participants-form > *').on(("change", "keyup"), function(){
    if($('#memberName').val() !== '' && testEmail.test($('#memberEmail').val())) {
      $('#memberEmail').removeClass('disabled');
    } else {
      $('#memberEmail').addClass('disabled');
    }
  });
  $('#participants-form .btn.add').click(function(){
    $('#memberEmail').addClass('disabled');
  });

});

// add test data when testing form
function addTestData(extraEmails){
  $('.btn.next').click();
  $('input.eventTitle').val("Title").trigger('keyup').trigger('change');
  $('input.hostName').val("Host Name").trigger('keyup').trigger('change');
  $('input.hostEmail').val("host@dom.ext").trigger('keyup').trigger('change');
  $('input#date-daily2').val("11/27/2014").trigger('keyup').trigger('change');
  $('textarea.eventDescription').val("description").trigger('keyup').trigger('change');
  $('.btn.next').click();
  if(extraEmails !== undefined){
    for (var i = 0; i < extraEmails; i++) {
      var num = i + 1;
      $('#memberName').val('Member '+num).trigger('keyup').trigger('change');
      $('#memberEmail').val('Member.'+num+'@dom.ext').trigger('keyup').trigger('change');
      $('#participants-form .btn.add').click();
    };
  $('.btn.next').click();
  }

}