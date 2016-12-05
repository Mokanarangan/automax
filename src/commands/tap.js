export default function(browser){
  return function async (text) {
    return browser
      .selector(text)
        .then(selector => browser.click(selector));
  };
};
