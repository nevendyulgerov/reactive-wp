<?php

namespace ReactiveWoo;


class Api {
	protected $request_action = '';
	public function __construct() {}
	
	protected function send_json_response($json, $code = 200) {
		header('Content-Type: application/json');
		header('Cache-Control: no-cache');
		header('Access-Control-Allow-Origin: *');
		http_response_code($code);
		echo json_encode($json) . "\n";
		exit;
	}
	
	protected function authorize_request($error_message = 'Invalid request') {
		$is_authorized = wp_verify_nonce($_POST['token'], $this->request_action);
		
		if (!$is_authorized) {
			$this->send_json_response($this->create_error_response($error_message));
			die;
		}
	}
	
	protected function create_error_response($message = 'Invalid request') {
		return array(
			'status' => 'error',
			'message' => $message
		);
	}
	
	protected function create_success_response($data) {
		return array(
			'status' => 'success',
			'data' => $data
		);
	}
	
	public function api_endpoints() {
		return null;
	}
}
