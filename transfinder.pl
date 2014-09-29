#!/usr/bin/env perl
use Mojolicious::Lite;

use Data::Dumper;
use LWP::UserAgent;
use JSON;

get '/' => sub {
    my $c = shift;
    $c->render( 'schools', msg => 'Schools' );
};

get '/schools' => sub {
    my $c = shift;
    $c->render( 'schools', msg => 'Schools' );
};

get '/schools/:id' => sub {
    my $c = shift;
    $c->render( 'school', msg => 'School', id => $c->stash('id') );
};

get '/schools/:id/students' => sub {
    my $c = shift;
    $c->render( 'students', msg => 'Students', id => $c->stash('id') );
};

get '/students/:id' => sub {
    my $c = shift;
    $c->render( 'student', msg => 'Student', id => $c->stash('id') );
};

get '/api/:object' => sub {
    my $c = shift;

    my $url = $c->stash('object');
    $url .= makeParams($c);

    $c->render( text => apiProxy($url) );   

};

get '/api/:object/:id' => sub {
    my $c = shift;

    my $url = $c->stash('object') . "/" . $c->stash('id');
    $url .= makeParams($c);

    $c->render( text => apiProxy($url) );
};

get '/api/:object/:id/:subobject' => sub {
    my $c = shift;

    my $url = $c->stash('object') . "/" . $c->stash('id') . "/" . $c->stash('subobject');
    $url .= makeParams($c);

    $c->render( text => apiProxy($url) );
};

sub apiProxy {
    my $url = shift;

    my $ua = LWP::UserAgent->new;
    $ua->timeout(10);
    $ua->env_proxy;
    $ua->default_header(
        'Authorization' => "Basic emxlaWdodG9uOnpsZWlnaHRvbjEyMw==" );

   my $response = $ua->get(
        'http://50.19.85.246/devsample/apiv1.svc/databases/1/' . $url );

   if ( $response->is_success ) {
        return $response->decoded_content;
    }
    else {
        die $response->status_line;
    }
}

sub makeParams {
    my $c      = shift;
    my $params = '?';
    foreach my $param ( $c->param() ) {
        $params .= "$param=" . $c->param("$param") . "&";
    }
    $params =~ s/\&$//s;

    return $params;
}

app->start;
