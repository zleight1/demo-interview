// jQuery.support.cors = true;
jQuery(document).ready(function($) {
    $(document).on('click', '.load-items', loadItems);
    $(document).on('click', '.show-info', showInformation);
});

function apiCall(request) {
    // Set Some Defaults - use a proxy
    var baseURL = 'http://127.0.0.1:3000/api/';
    // var baseURL = 'http://zleighton:zleighton123@50.19.85.246/devsample/apiv1.svc/';
    var type = request.type || 'GET';
    var url = baseURL + request.url;
    var data = request.data;
    var callback = request.callback;
    return jQuery.ajax({
        'url': url,
        'type': type,
        'data': data,
        'dataType': 'json',
        'cache': false,
        'success': function(result, status, xhr) {
            return handleCallback(callback, result)
        }
    });
}

function handleCallback(callback, data) {
    //we want to gracefully handle the function callback
    return callback(data);
}

function populateList(results) {
    if (!results) {
        alert('Empty Results!');
    }
    var list = '';
    for (var i = 0; i < results.Objects.length; i++) {
        list = list + templateResult(results.Objects[i]);
    };
    return $.parseHTML(list);
}

function templateResult(result) {
    var template = '<a href="#" class="show-info"';
    for (var key in result) {
        if (result.hasOwnProperty(key)) {
            template += ' data-' + key + '="' + result[key] + '"';
        }
    }
    template += '><h4>' + result.Name + '</h4></a><br />';
    return template;
}

function showInformation() {
    var template = '';
    var data = $(this).data();
    for (var key in data) {
            template += '<h4>' + key + ' : <small>' + data[key] + '</small></h4>';
    }
    return $('#info').empty().append(template);
}

function loadItems() {
    var items = $(this).data('items');
    var offset = $(this).data('offset');
    var limit = $(this).data('limit');
    var target = $(this).data('target');
    var newOffset = $(this).data('offset') + $(this).data('limit');
    $(this).data('offset', newOffset);
    return apiCall({
        'url': items,
        'data': {
            'offset': offset,
            'limit': limit
        },
        'callback': function(result) {
            return $(target).append(populateList(result));
        }
    });
}