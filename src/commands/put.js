export default function(browser){
 return function async (text, value) {
  return browser
    .selector(text)
    .then(selector => browser.setValue(selector, value));
 }
};
