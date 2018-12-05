import React, { Component } from 'react';
import { getPosts } from '../../../api';

class Index extends Component {
  state = {
    posts: []
  };

  componentWillMount() {
    getPosts({
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
      <div data-view="index">
        <div className="view-wrapper">
          <h2>
            {'Index'}
          </h2>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                {post.title.rendered}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Index;
