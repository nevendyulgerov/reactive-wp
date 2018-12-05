<?php

namespace ReactiveWoo;
use Automattic\WooCommerce\Client;


class WooApi extends Api {
	private $woocommerce = null;
	
	public function __construct() {
		parent::__construct();
		
		$this->request_action = 'wp_rest';
		$this->woocommerce = new Client(get_site_url(),
			'ck_320539dd5fc010ae4660c4010cf22b7216cf4765',
			'cs_47588d37f3dba9faac585c31e4fb5b7b3e6804aa',
			array(
				'wp_api' => true,
				'version' => 'wc/v2',
			)
		);
		add_action('wp_ajax_api', [$this, 'ajax_request'], 0);
		add_action('wp_ajax_nopriv_api', [$this, 'ajax_request'], 0);
	}
	
	protected function get_api_results() {
		$request = $_POST['request'];
		$endpoint = $request['endpoint'];
		$data = is_array($request['data']) ? $request['data'] : array();
		$results = array();
		
		switch ($request['type']) {
			case 'GET':
				$results = $this->woocommerce->get($endpoint, $data);
				break;
			case 'POST':
				$results = $this->woocommerce->post($endpoint, $data);
				break;
			case 'PUT':
				$results = $this->woocommerce->put($endpoint, $data);
				break;
			case 'DELETE':
				$results = $this->woocommerce->delete($endpoint, $data);
				break;
			default:
				break;
		}
		
		return $results;
	}
	
	public function ajax_request() {
		$this->authorize_request();
		
		$results = $this->get_api_results();
		$this->send_json_response($results);
		die;
	}
}
