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

function templateResults( template, results ) {
    if (!results) {
        return 'Empty Results!';
    }
    var list = '';
    for (var i = 0; i < results.Objects.length; i++) {
        list = list + template(results.Objects[i]);
    };
    return $.parseHTML(list);
}