var resize = function() {
  var windowHeight = $(window).height();
  var headerHeight = $('header').height();
  var contentWrapperHeight = $('.content-wrapper').height();
  var contentHeight = $('.content').height();
  
  $('.content').css({
    'margin-top': ((contentWrapperHeight - contentHeight)/2)+'px',
    'margin-bottom': ((contentWrapperHeight - contentHeight)/2)+'px'
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
  self.members = ko.observableArray([
      new Member("", "")
    ]);
  self.description = ko.observable();

  self.eventTitle = ko.observable("");
  self.hostName = ko.observable("");
  self.hostEmail = ko.observable("");
  self.matchupDate = ko.observable("");
  self.eventDate = ko.observable("");
  self.description = ko.observable("");

  // Operations
  self.addMember = function () {
    resize();
    self.members.push(new Member("", ""));
  };
  self.removeMember = function (member) {
    resize();
    self.members.remove(member);
  };


};

ko.applyBindings(new ViewModel());


//
$(function () {
  var contentWrapperHeight = $('.content-wrapper').height();
  var contentHeight = $('.content').height();
  resize();
  $(window).resize(function () {
    resize();
  });

  $('.next').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled'))
    {
      $(this).parents('section').next().show();
      $(this).parents('section').hide();
      resize();
    }

    $('.content').css({
      'margin-top': ((contentWrapperHeight - contentHeight)/2)+'px',
      'margin-bottom': ((contentWrapperHeight - contentHeight)/2)+'px'
    });
  });

  //wrap next button link text in span. done via js to get around text generated by knockout
  $('a.btn.next').contents().wrap('<span/>');

  //form validation function
  function validate() {
    if ($('.eventTitle').val() !== '' && $('.hostName').val() !== '' && $('.hostEmail').val() !== '' && $('.matchupDate').val() !== '' && $('#date-daily2').val() !== '' && $('.eventDescription').val() !== '' ){
      $('.form .btn.next').removeClass('disabled');
    } else {
      if($('.form .btn.next:not(.disabled)')) {
        //otherwise set it as disabled
        $('.form .btn.next').addClass('disabled');
      }
    }
  }

  //datepicker stuff (separate IDs to make sure on calendar closes when the other is activated)
  $('#datepicker input').datepicker().on('changeDate', function (ev) {
      $('#date-daily').change();
  });
  $('#date-daily').val();
  $('#date-daily').on('change', function () {
      $('#date-daily').val();
      //console.log($('#date-daily').val());
      //run validation check here to fix issue with datepicker value not registering in check below
      validate();
  });

  $('#datepicker2 input').datepicker().on('changeDate', function (ev) {
      $('#date-daily2').change();
  });
  $('#date-daily2').val();
  $('#date-daily2').on('change', function () {
      $('#date-daily2').val();
      //console.log($('#date-daily2').val());
      //run validation check here to fix issue with datepicker value not registering in check below
      validate();
  });

  // if all fields are filled in, enable next button
  $('form > *').on(("change", "keyup"), function(){
    validate();
  });

  $('.add').click(function(){
      $(this).parents('section').find('.next').wrapInner('<span/>')
  });

});



var m_names = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December");

var d = new Date();
var curr_date = d.getDate();
var sup = "";
if (curr_date == 1 || curr_date == 21 || curr_date ==31)
   {
   sup = "st";
   }
else if (curr_date == 2 || curr_date == 22)
   {
   sup = "nd";
   }
else if (curr_date == 3 || curr_date == 23)
   {
   sup = "rd";
   }
else
   {
   sup = "th";
   }

var curr_month = d.getMonth();
var curr_year = d.getFullYear();

document.write(curr_date + "<SUP>" + sup + "</SUP> " 
+ m_names[curr_month] + " " + curr_year);
