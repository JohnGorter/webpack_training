import _ from 'lodash';

  function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');
    element.innerHTML = _.join(['Hello', 'webpack 2'], ' ');

    return element;
  }

  document.body.appendChild(component());