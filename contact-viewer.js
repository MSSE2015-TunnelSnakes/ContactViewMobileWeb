
var _apiKey = '?key=tunnelsnakes';
var _urlBase = 'http://contacts.tinyapollo.com/contacts/'
var _contacts = {};
var _contactModel;

//on page load initial
$(function () {
    // initialize the knockout model
    _contactModel = new ContactModel();
    ko.applyBindings(_contactModel, document.getElementById('details-page'));
    $('#popup').popup();
});

$(document).on('pagebeforeshow', '#home-page', function () {

    var newLink = '<li><a class="new ui-icon-plus" href="#details-page"><h3> + Add New Contact</h3></a></li>';

    $.get(_urlBase + _apiKey,
        function (data) {
            _contacts = data.contacts;

            var contactList = $('#contact-list').html('');
            contactList.append(newLink);

            for(var i = 0; i < data.contacts.length; i++) {
                var c = data.contacts[i];
                _contacts[c._id] = c;

                $('<li>').append(
                    $('<a>')
                        .prop('href', '#details-page')
                        .data('contact-id', c._id)
                        .append($('<h3>').html(c.name + ', ' + c.title))
                        .append($('<span>').addClass('contact-item-info').html(c.phone).append($('<span>').html(c.email)))
                ).appendTo(contactList);
            }

            if(data.contacts.length > 0) {
                contactList.append(newLink);
            }

            contactList.listview('refresh');
        }
    );
});

$(document).on('click', '#save', function() {
    _contactModel.save();
});

$(document).on('click', '#delete', function() {
    _contactModel.delete();
});

$(document).on('click', '#contact-list a, a.new', function() {
    var self = $(this);
    if(self.hasClass('new')) {
        _contactModel.clear(); //clear the knockout model
    } else {
        _contactModel.load(_contacts[self.data('contact-id')]); //update the knockout model
    }
    return true;
});


// helper function for alerts
function popAlert(message, delayInMilliseconds) {
    var delay = delayInMilliseconds != undefined && delayInMilliseconds != null ? delayInMilliseconds : 300;
    setTimeout(function(){
        $('#popup-text').html(message);
        $("#popup").popup('open');

        //this closes the popup after a short time unless it is an instant alert (errors)
        if(delay > 0) {
            setTimeout(function () {
                $('#details-back').click();
            }, 600);
        }
    }, delay);
}

// knockout.js Model
function ContactModel() {
    var self = this;

    self.name       = ko.observable();
    self.title      = ko.observable();
    self.email      = ko.observable();
    self.phone      = ko.observable();
    self.twitterId  = ko.observable();
    self._id        = ko.observable();

    self.load = function(contact) {
        self.name(contact.name);
        self.title(contact.title);
        self.email(contact.email);
        self.phone(contact.phone);
        self.twitterId(contact.twitterId);
        self._id(contact._id);

        $('#new-or-edit').html('View/Edit');
        $('#delete').show();
    }

    self.save = function() {

        // use knockout to avoid doing manual deserialization
        var model = ko.toJSON(_contactModel);

        //get the proper verb and url for the ajax call
        var isNew = _contactModel._id().length < 1;
        var verb = isNew ? 'POST' : 'PUT';
        var url = _urlBase + (isNew ? '' : _contactModel._id()) + _apiKey;

        $.ajax({
            url: url,
            type: verb,
            data: JSON.parse(model),
            success: function (data) {
                if (data.status == 'error') {
                    popAlert('Error Saving Contact: ' + data.message, 0);
                } else {
                    $('#details-back').click();
                    popAlert('Contact Saved');
                }
            }
        });
    }

    self.delete = function() {
        $.ajax({
            url: _urlBase + _contactModel._id() + _apiKey,
            type: 'DELETE',
            success: function (data) {
                if (data.status == 'error') {
                    popAlert('Error Deleting Contact: ' + data.message, 0);
                } else {
                    self.clear();
                    $('#details-back').click();
                    popAlert('Contact Deleted');
                }
            }
        });
    }

    self.clear = function() {
        $('#new-or-edit').html('New');
        $('#delete').hide();
        self.name('');
        self.title('');
        self.email('');
        self.phone('');
        self.twitterId('');
        self._id('');
    }
}