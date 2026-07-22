// content.js
// Inject main.js into the page via a src tag to avoid Content Security Policy 
// errors on inline scripts.

const script = document.createElement('script');
script.src = chrome.runtime.getURL('main.js');
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();
