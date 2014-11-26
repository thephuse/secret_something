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
  self.members = ko.observableArray();
  self.description = ko.observable();

  self.eventTitle = ko.observable("");
  self.hostName = ko.observable("");
  self.hostEmail = ko.observable("");
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

  self.description = ko.observable("");

  // Operations
  self.addMember = function () {
    self.members.push(new Member($('#memberName').val(), $('#memberEmail').val()));
    $('#memberName').val('');
    $('#memberEmail').val('');
    resize();
  };
  self.removeMember = function (member) {
    //console.log("member: ", member);
    self.members.remove(member);
    resize();
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

  //form validation function
  function validate() {
    if ($('.required').val() !== '' ){
      $('.form .btn.next').removeClass('disabled');
    } else {
      if($('.form .btn.next:not(.disabled)')) {
        //otherwise set it as disabled
        $('.form .btn.next').addClass('disabled');
      }
    }
  }

  //datepicker stuff (separate IDs to make sure on calendar closes when the other is activated)
  $('#datepicker2 input').datepicker().on('changeDate', function (ev) {
      $('#date-daily2').change();
  });
  $('#date-daily2').on('change', function () {
      $('#date-daily2').val();
      //console.log($('#date-daily2').val());
      //run validation check here to fix issue with datepicker value not registering in check below
      // validate();
  });

  // if all fields are filled in, enable next button
  // $('form > *').on(("change", "keyup"), function(){
  //   validate();
  // });

  $('.add').click(function(){
      $(this).parents('section').find('.next').wrapInner('<span/>')
  });

  $('form > *').on(("change", "keyup"), function(){
    if($('.eventTitle').val() !== '' && $('.hostName').val() !== '' && $('.hostEmail').val() !== '' && $('#date-daily2').val() !== '' && $('.eventDescription').val() !== '') {
      $('.form .btn.next').removeClass('disabled');
    } else {
      if($('.form .btn.next:not(.disabled)')) {
        //otherwise set it as disabled
        $('.form .btn.next').addClass('disabled');
      }
    }
  });

});
