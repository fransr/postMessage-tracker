chrome.runtime.getBackgroundPage(function (page) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		selectedId = tabs[0].id;
		listListeners(page.tab_listeners[selectedId]);
	});
});

function listListeners(listeners) {
	var x = document.getElementById('x');
	x.parentElement.removeChild(x);
	x = document.createElement('ol');
	x.id = 'x';
	//console.log(listeners);
	document.getElementById('h').innerText = listeners.length ? listeners[0].parent_url : '';

	for(var i = 0; i < listeners.length; i++) {
		listener = listeners[i]
		el = document.createElement('li');

		bel = document.createElement('b');
		bel.innerText = listener.domain + ' ';
		win = document.createElement('code');
		win.innerText = ' ' + (listener.window ? listener.window + ' ' : '') + (listener.hops && listener.hops.length ? listener.hops : '');
		el.appendChild(bel);
		el.appendChild(win);

		sel = document.createElement('span');
		if(listener.fullstack) sel.setAttribute('title', listener.fullstack.join("\n\n"));
		seltxt = document.createTextNode(listener.stack);
		
		sel.appendChild(seltxt);
		el.appendChild(sel);

		pel = document.createElement('pre');
		pel.innerText = listener.listener;
		el.appendChild(pel);

		x.appendChild(el);
	}
	document.getElementById('content').appendChild(x);
	/*setTimeout(function() {
		document.body.style.display = 'block';
	}, 150);*/
}