const Promise = require('bluebird');

const htmlElms = ['span', 'div', 'input', 'li'];
const selectors = (text) => [
  `#${text}`,
  `*[value="${text}"]`,
  `*[name="${text}"]`,
  `*[placeholder*="${text}"]`,
  ... htmlElms.map(elm => `${elm}=${text}`),
];


export default function(browser){
 return function async (params, value) {
  return Promise.any(
    selectors(params)
      .map(selector => browser
        .waitForExist(selector,10000)
        .then(() => selector)
      ));
  }
};
