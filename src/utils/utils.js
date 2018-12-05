const { reactiveWooApi } = window;
const { templateUrl } = reactiveWooApi;

/**
 * @description Get image
 * @param imageName
 * @param extension
 * @returns {string}
 */
export const getImage = (imageName, extension = 'png') => `${templateUrl}/img/${imageName}.${extension}`;
