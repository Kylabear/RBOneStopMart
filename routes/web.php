<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

Route::get('/test-web', function () {
    return response()->json(['message' => 'Web route is working!']);
});

Route::get('/test-api-web', function () {
    return response()->json(['message' => 'API route via web is working!']);
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
