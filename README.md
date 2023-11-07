# postMessage-tracker

Made by [Frans Rosén](https://twitter.com/fransrosen). Presented during the ["Attacking modern web technologies"-talk](https://www.youtube.com/watch?v=oJCCOnF25JU) ([Slides](https://speakerdeck.com/fransrosen/owasp-appseceu-2018-attacking-modern-web-technologies)) at OWASP AppSec Europe back in 2018, but finally released in May 2020.

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/listener-uber.png" width="500" />

This Chrome extension monitors postMessage-listeners by showing you an indicator about the amount of listeners in the current window.

It supports tracking listeners in all subframes of the window. It also keeps track of short-lived listeners and listeners enabled upon interactions. You can also log the listener functions and locations to look them through them at a later stage by using the Log URL-option in the extension. This enables you to find hidden listeners that are only enabled for a short time inside an iframe.

It also shows you the interaction between windows inside the console and will specify the windows using a path you can use yourself to replay the message:

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/console.png" width="350" />

It also supports tracking communication happening between different windows, using `diffwin` as sender or receiver in the console.

# Features

* Supports Raven, New Relic, Rollbar, Bugsnag and jQuery wrappers and "unpacks" them to show you the real listener.

* Tries to bypass and reroute wrappers so the Devtools console will show the proper listeners:

**Using New Relic:**

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/before.png" width="200" />

**After, with postMessage-tracker:**

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/after.png" width="200" />

**Using jQuery:**

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/before-jquery.png" width="200" />

**After, with postMessage-tracker:**

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/after-jquery.png" width="200" />

* Allows you to set a Log URL inside the extension options to allow you to log all information about each listener to an endpoint by submitting the listener and the function (to be able to look through all listeners later). You can find the options in the Extension Options when clicking the extension in `chrome://extensions`-page:

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/options.png" width="300" />

* Supports anonymous functions. Chrome does not support to stringify an anonymous function, in the cases of anonymous functions, you will see the `bound`-string as the listener:

<img src="https://github.com/fransr/postMessage-tracker/raw/docs-images/images/anonymous.png" width="300" />


# Known issues

~Since some websites could be served as XML with a XHTML-namespace, it will also attach itself to plain XML-files and will be rendered in the top of the XML. This might confuse you if you look at XML-files in the browser, as the complete injected script is in the DOM of the XML. I haven't found a way to hide it from real XML-files, but still support it for XHTML-namespaces.~ The content script is not added to the DOM if the `document.contentType` is `application/xml` which happens when Chrome renders XML-files.

