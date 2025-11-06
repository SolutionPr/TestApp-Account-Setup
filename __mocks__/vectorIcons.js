// __mocks__/vectorIcons.js
import React from 'react';

const Icon = ({ name, size, color, style, ...props }) => {
  return React.createElement('Icon', {
    name,
    size,
    color,
    style,
    ...props,
  });
};

Icon.Button = Icon;
Icon.TabBarItem = Icon;
Icon.TabBarItemIOS = Icon;
Icon.ToolbarAndroid = Icon;
Icon.getImageSource = jest.fn(() => Promise.resolve(''));
Icon.loadFont = jest.fn(() => Promise.resolve());

export default Icon;