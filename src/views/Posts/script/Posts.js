import React, { Component } from 'react';
import { getRichPosts } from '../../../api';

class PostsView extends Component {
  state = {
    posts: []
  };

  componentWillMount() {
    getRichPosts({
      callback: (err, posts) => {
        if (err) {
          return console.log(err);
        }
        this.setState({ posts });
      }
    });
  }

  render() {
    const { posts } = this.state;

    return (
      <div data-view="posts">
        <div className="view-wrapper">
          <h2>
            {'Posts'}
          </h2>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                {post.id}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default PostsView;
