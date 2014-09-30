function apiCall(request) {
    // Set Some Defaults - use a proxy
    var root = location.protocol + '//' + location.host;
    var baseURL = root+'/api/';
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
    for (var i = 0; i < results.length; i++) {
        list = list + template(results[i]);
    };
    return $.parseHTML(list);
}

function templateKeys(result) {
    var template = '';
    for (var key in result) {
            template += '<h4>' + key + ' : <small>' + result[key] + '</small></h4>';
    }
    return template;
}

function loadTarget(url, target, templateFunction) {
    return apiCall({
        'url': url,
        'callback': function(result) {
            return $(target).append(templateResults(templateFunction, result.Objects));
        }
    });
}