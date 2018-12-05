<?php

namespace ReactiveWoo;


class CustomApi extends Api {
	public function __construct() {
		parent::__construct();

		add_action('rest_api_init', function () {
			register_rest_route( 'reactive-woo/v1', '/settings', array(
				'methods' => 'GET',
				'callback' => [$this, 'get_settings'],
			));
		});

		add_action('rest_api_init', function () {
			register_rest_route( 'reactive-woo/v1', '/menu-items', array(
				'methods' => 'GET',
				'callback' => [$this, 'get_menu_items'],
			));
		});
	}

	public function get_settings() {
		$custom_logo_id = get_theme_mod( 'custom_logo' );
		$image = wp_get_attachment_image_src( $custom_logo_id , 'full' );

		$results = array(
			'logo_url' => $image[0]
		);

		$this->send_json_response($results);
		die;
	}

	public function get_menu_items() {
		$menu_name = $_GET['menu_name'];
		$menu = wp_get_nav_menu_items($menu_name);

		$this->send_json_response($menu);
		die;
	}
}
