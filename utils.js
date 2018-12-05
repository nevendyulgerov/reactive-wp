const fs = require('fs');

/**
 * @description Titlize
 * @param text
 * @param format
 */
const titlize = (text, format) => {
  const textWords = text.split('-');
  if (format === 'camel') {
    return textWords.map((word, index) => (index > 0
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word.charAt(0).toLowerCase() + word.slice(1).toUpperCase()).join(''));
  } else if (format === 'pascal') {
    return textWords.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
  } else if (format === 'dashed') {
    return textWords.map(word => word.toLowerCase()).join('-');
  }
};

/**
 * @description Create file
 * @param componentName
 * @param path
 * @param fileExtension
 * @param content
 * @param fileName
 * @param baseDir
 */
const createFile = (componentName, path, fileExtension, content, fileName = 'index', baseDir = '') => {
  if (baseDir !== '' && !fs.existsSync(path)) {
    fs.mkdirSync(baseDir);
  }

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  fs.writeFile(`${path}/${fileName}.${fileExtension}`, content, (err) => {
    if (err) {
      return console.log(err);
    }
  });
};

/**
 * @description Create component
 * @param componentName
 * @param componentType
 * @param isComponent
 */
const createReactComponent = (componentName, componentType, isComponent = true) => {
  const componentPascalName = titlize(componentName, 'pascal');
  const baseDir = `./src/${isComponent ? 'components' : 'views'}/${componentPascalName}`;
  const componentPath = `./src/${isComponent ? 'components' : 'views'}/${componentPascalName}/script`;
  let content = '';

  if (componentType === 'class') {
    content = `
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ${componentPascalName} extends Component {
    render() {
        return (
            <div data-component="${componentName}">
                {/* TODO: Implement component */}
            </div>
        );
    }
}

${componentPascalName}.propTypes = {
    // TODO: Implement prop types
};

export default ${componentPascalName};
`.trim();
  } else if (componentType === 'func') {
    content = `
import React from 'react';
import PropTypes from 'prop-types';

const ${componentPascalName} = ({ /* TODO: Add props */ }) => (
  <div data-component="${componentName}">
    {/* TODO: Implement component */}
  </div>
);

${componentPascalName}.propTypes = {
    // TODO: Implement prop types
};

export default ${componentPascalName};
`.trim();
  }

  createFile(componentName, componentPath, 'js', content, titlize(componentName, 'pascal'), baseDir);
};

/**
 * @description Create component index file
 * @param componentName
 * @param isComponent
 */
const createReactComponentIndexFile = (componentName, isComponent = true) => {
  const componentPascalName = titlize(componentName, 'pascal');
  const componentPath = `./src/${isComponent ? 'components' : 'views'}/${componentPascalName}/`;
  const content = `
import ${componentPascalName} from './script/${componentPascalName}';

export default ${componentPascalName};

`.trim();

  createFile('index', componentPath, 'js', content);
};

/**
 * @description Create style file
 * @param componentName
 * @param isComponent
 */
const createStyleFile = (componentName, isComponent = true) => {
  const componentPascalName = titlize(componentName, 'pascal');
  const componentDashedName = titlize(componentName, 'dashed');
  const componentPath = `./src/${isComponent ? 'components' : 'views'}/${componentPascalName}/style`;
  const content = `
/**
 *Component: ${componentPascalName}
 */

[data-${isComponent ? 'component' : 'view'}="${componentDashedName}"] {
  
}
`.trim();

  createFile(componentName, componentPath, 'scss', content, componentPascalName);
};

exports.createReactComponent = (componentName, componentType) => {
  createReactComponent(componentName, componentType);
  createReactComponentIndexFile(componentName);
  createStyleFile(componentName);
};

exports.createReactView = (componentName, componentType) => {
  createReactComponent(componentName, componentType, false);
  createReactComponentIndexFile(componentName, false);
  createStyleFile(componentName, false);
};
