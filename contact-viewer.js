
var _apiKey = 'tunnelsnakes';
var _contacts = {};
var _contact = {};

$(document).on('pagebeforeshow', '#home-page', function () {

    $.get('http://contacts.tinyapollo.com/contacts?key=' + _apiKey,
        function (data) {
            _contacts = data.contacts;
            var contactList = $('#contact-list').html('');
            for(var i = 0; i < data.contacts.length; i++) {
                var c = data.contacts[i];
                _contacts[c._id] = c;
                $('<li>').append(
                    $('<a>')
                        .prop('href', '#details-page')
                        .data('contact-id', c._id)
                        .append($('<h3>').html(c.name + ', ' + c.title))
                        //.append($('<p>').html(c.email))
                ).appendTo(contactList);
            }
            contactList.listview('refresh');
        }
    );

});

$(document).on('click', '#contact-list a', function() {
    _contact = _contacts[$(this).data('contact-id')];
    return true;
});

$(document).on('pagebeforeshow', '#details-page', function() {
    $('#contact-details').html(_contact.name);
});
