<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/api/Api.php';
require __DIR__ . '/api/WooApi.php';
require __DIR__ . '/api/CustomApi.php';

use ReactiveWoo\WooApi;
use ReactiveWoo\CustomApi;

$woo_api = new WooApi();
$custom_woo_api = new CustomApi();

add_action('init', [$woo_api, 'api_endpoints'], 10);
add_action('init', [$custom_woo_api, 'api_endpoints'], 20);
add_action('init', 'reactive_woo_register_menus', 30);
add_action('after_setup_theme', 'reactive_woo_custom_logo_setup', 40);

add_theme_support( 'custom-logo' );
add_theme_support( 'post-thumbnails' );

function reactive_woo_custom_logo_setup() {
	$defaults = array(
		'height' => 100,
		'width' => 400,
		'flex-height' => true,
		'flex-width' => true,
		'header-text' => array('site-title', 'site-description'),
	);
	add_theme_support( 'custom-logo', $defaults );
}

function reactive_woo_register_menus() {
	register_nav_menus(array(
		'header-menu' => __('Header Menu'),
		'footer-menu' => __('Footer Menu')
	));
}
