
var _apiKey = 'tunnelsnakes';
var _contacts = {};

$(document).on('pagebeforeshow', '#home-page', function () {

    $.get('http://contacts.tinyapollo.com/contacts?key=' + _apiKey,
        function (data) {
            _contacts = data.contacts;
            var contactList = $('#contact-list').html('');
            for(var i = 0; i < data.contacts.length; i++) {
                var c = data.contacts[i];
                _contacts[c._id] = contact
                $('<li>').append(
                    $('<a>')
                        .append($('<h3>').html(c.name))
                        .append($('<p>').html(c.email))
                ).appendTo(contactList);
            }
            contactList.listview('refresh');
        }
    );

});

