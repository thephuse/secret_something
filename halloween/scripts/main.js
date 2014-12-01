var resize = function() {
  var windowHeight = $(window).height();
  var headerHeight = $('header').height();
  $('section').each(function () {
    var contentHeight = $(this).find('.content').height();
    if ($(window).width() > 580) {
      if (contentHeight > windowHeight - headerHeight)
      {
        $(this).css('height', 'auto');
        $(this).find('.content').css('padding-top', '0px');
      }
      else
      {
        $(this).height(windowHeight - headerHeight);
        $(this).find('.content').css('padding-top', (Math.ceil((windowHeight - contentHeight) / 2) - headerHeight) + 'px');
      }
    }
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
  });

  $('.datepicker').datepicker();
});