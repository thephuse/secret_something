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
    self.members.push(new Member("", ""));
  };
  self.removeMember = function (member) {
    self.members.remove(member);
  };

};

ko.applyBindings(new ViewModel());


//
$(function () {

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