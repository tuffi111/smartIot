<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>{{ env('APP_NAME') }}</title>

    <meta charset="utf-8">
    <meta name="description" content="{{ env('APP_DESC') }}">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, viewport-fit=cover">

    <link rel="icon" type="image/png" sizes="128x128" href="{{asset('assets/icons/favicon-128x128.png')}}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{asset('assets/icons/favicon-96x96.png')}}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{asset('assets/icons/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{asset('assets/icons/favicon-16x16.png')}}">
    <link rel="icon" type="image/ico" href="{{asset('assets/favicon.ico')}}'">
</head>
<body class="antialiased">
<div id="app"><!--
    while loadings js: display simple predicted html/css outline here (wie wird das in fe-sprech genannt?)
    will be overwritten by main.js/vue
--></div>
<script>
    let Auth = {!! json_encode($auth) !!};
</script>

{{ Vite::useBuildDirectory('.') }}

@vite('resources/js/app.js')
</body>
</html>
