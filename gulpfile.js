/**
 * Gulpfile
 * Contains build tasks
 */

const gulp = require('gulp');
const { createReactComponent, createReactView } = require('./utils');

// create module files
gulp.task('component', () => {
  const componentName = process.argv[4];
  const componentType = process.argv[6] || 'class';

  if (!componentName) {
    return console.error('Invalid arguments. Make sure to pass a component name.');
  }

  createReactComponent(componentName, componentType);
});

// create module files
gulp.task('view', () => {
  const componentName = process.argv[4];
  const componentType = process.argv[6] || 'class';

  if (!componentName) {
    return console.error('Invalid arguments. Make sure to pass a component name.');
  }

  createReactView(componentName, componentType);
});
