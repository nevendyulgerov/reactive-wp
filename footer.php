<div id="app"></div>
<script>
  window.reactiveWooApi = {
    siteUrl: '<?php echo get_site_url() ?>',
    templateUrl: '<?php echo get_stylesheet_directory_uri() ?>',
    ajaxUrl: '<?php echo admin_url("admin-ajax.php") ?>',
    restUrl: '<?php echo esc_url_raw(rest_url()) ?>',
    token: '<?php echo wp_create_nonce("wp_rest") ?>'
  };
</script>
<script src="<?php echo get_stylesheet_directory_uri().'/bundle/scripts-bundle.js' ?>"></script>
<?php wp_footer(); ?>
</body>
</html>
