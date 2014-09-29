#!/usr/bin/env perl
use Mojolicious::Lite;

use Data::Dumper;
use LWP::UserAgent;
use JSON;

get '/' => sub {
    my $c = shift;
    $c->render( 'index', msg => 'Load Some Students' );
};

get '/api/:object' => sub {
    my $c = shift;

    my $ua = LWP::UserAgent->new;
    $ua->timeout(10);
    $ua->env_proxy;
    $ua->default_header(
        'Authorization' => "Basic emxlaWdodG9uOnpsZWlnaHRvbjEyMw==" );

    my $url = $c->stash('object');
    $url .= makeParams($c);

    my $response = $ua->get(
        'http://50.19.85.246/devsample/apiv1.svc/databases/1/' . $url );

    if ( $response->is_success ) {
        $c->render( text => $response->decoded_content );    # or whatever
    }
    else {
        die $response->status_line;
    }

};

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
