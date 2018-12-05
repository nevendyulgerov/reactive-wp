import { isObj } from './utils/ammo';

const { navigator, reactiveWooApi } = window;
const { serviceWorker } = navigator;
const { templateUrl } = reactiveWooApi;

/**
 * @description Register service worker
 * @param isUpdated
 * @returns {boolean}
 */
export const registerServiceWorker = ({ isUpdated = false } = {}) => {
  if (!isObj(serviceWorker)) {
    return false;
  }

  serviceWorker
    .register('/serviceWorker.js', { scope: `${templateUrl}/src/` })
    .then(registration => {
      console.log('Service worker registered');

      if (isUpdated) {
        registration.update();
      }

      return registration;
    })
    .catch(err => {
      console.log('Service worker failed to register', err);
    });
};

/**
 * @description Unregister service worker
 * @returns {boolean}
 */
export const unregisterServiceWorker = () => {
  if (!isObj(serviceWorker)) {
    return false;
  }

  serviceWorker.getRegistrations()
    .then(registrations => registrations.forEach(registration => registration.unregister()))
    .catch(err => {
      console.log('Service worker failed to unregister', err);
    });
};
