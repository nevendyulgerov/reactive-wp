# Reactive WP

Headless WordPress theme, with decoupled React-driven front-end

## Requirements
* WordPress
* npm
* composer

## How to Run:

1. Spin up a local WordPress instance for development
2. Create an empty WordPress theme under that WordPress instance
3. [Download](https://github.com/nevendyulgerov/reactive-wp/archive/master.zip) or [Clone](https://github.com/nevendyulgerov/reactive-wp.git) this repository in the empty WordPress theme.
4. Run `npm install` to install the front-end dependencies.
5. Run `composer install` to install the back-end dependencies
6. Run the front-end bundle watchers using `npm start`.
8. App becomes available at the domain you are using for the local WordPress instance, **after you activate the theme 'Reactive WP' from the WP admin**.

### Notes

* The front-end bundle watchers are using webpack
* Live-reload is enabled for webpack, you can take advantage of it by installing the [live-reload plugin for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
