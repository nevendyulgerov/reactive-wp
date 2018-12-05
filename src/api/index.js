import { callRestApi, restType, restEndpoint } from './core';
import { sequence, shape } from '../utils/ammo';

const { wp, woo, custom } = restType;
const { products, posts, pages, settings, menuItems } = restEndpoint;

/**
 * @description Get products
 * @param callback
 */
export const getProducts = ({ callback }) => {
  const options = {
    endpoint: products,
    callback
  };

  callRestApi(woo, options);
};

/**
 * @description Get posts
 * @param search
 * @param count
 * @param orderBy
 * @param order
 * @param perPage
 * @param callback
 */
export const getPosts = ({ search = '', orderBy = 'title', order = 'asc', perPage = 10, callback }) => {
  const options = {
    endpoint: `${posts}?search=${search}&orderby=${orderBy}&order=${order}&per_page=${perPage}`,
    callback
  };

  callRestApi(wp, options);
};

/**
 * @description Get rich posts
 * @param options
 * @returns {*|int|boolean}
 */
export const getRichPosts = options => sequence()
  .chain(seq => getPosts({
    ...options,
    callback: (err, posts) => {
      if (err) {
        return options.callback(err);
      }
      seq.resolve(posts);
    }
  }))
  .chain(seq => getTags({
    tags: shape(seq.response.value).reduceTo('tags').fetch(),
    callback: (err, tags) => {
      if (err) {
        return options.callback(err);
      }
      const postsWithTags = seq.response.value.map(post => ({
        ...post,
        tagItems: tags.filter(tag => post.tags.indexOf(tag.id) > -1)
      }));
      seq.resolve(postsWithTags);
    }
  }))
  .chain(seq => getUsers({
    users: shape(seq.response.value).reduceTo('author').fetch(),
    callback: (err, users) => {
      if (err) {
        return options.callback(err);
      }
      const postsWithAuthor = seq.response.value.map(post => ({
        ...post,
        authorDetails: users.filter(user => user.id === post.author)[0]
      }));

      options.callback(undefined, postsWithAuthor);
    }
  }))
  .execute();

/**
 * @description Get tags
 * @param tags
 * @param callback
 */
export const getTags = ({ tags, callback }) => {
  const options = {
    endpoint: `${restEndpoint.tags}?include=${tags.join(',')}`,
    callback
  };

  callRestApi(wp, options);
};

/**
 * @description Get users
 * @param authorId
 * @param callback
 */
export const getUsers = ({ users, callback }) => {
  const options = {
    endpoint: `${restEndpoint.users}?include=${users.join(',')}`,
    callback
  };

  callRestApi(wp, options);
};

/**
 * @description Get pages
 * @param search
 * @param orderBy
 * @param order
 * @param perPage
 * @param callback
 */
export const getPages = ({ search = '', orderBy = 'title', order = 'asc', perPage = 10, callback }) => {
  const options = {
    endpoint: `${pages}?search=${search}&orderby=${orderBy}&order=${order}&per_page=${perPage}`,
    callback
  };

  callRestApi(wp, options);
};

/**
 * @description Get settings
 * @param callback
 */
export const getSettings = ({ callback }) => {
  const options = {
    endpoint: settings,
    callback
  };

  callRestApi(custom, options);
};

/**
 * @description Get menu
 * @param menuName
 * @param callback
 */
export const getMenu = ({ menuName = '', callback }) => {
  const options = {
    endpoint: menuItems,
    data: { menu_name: menuName },
    callback
  };

  callRestApi(custom, options);
};
