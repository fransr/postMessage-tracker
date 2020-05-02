var tab_listeners = {};
var tab_push = {}, tab_lasturl = {};
var selectedId = -1;

function refreshCount() {
	txt = tab_listeners[selectedId] ? tab_listeners[selectedId].length : 0;
	chrome.tabs.get(selectedId, function() {
		if (!chrome.runtime.lastError) {
			chrome.browserAction.setBadgeText({"text": ''+txt, tabId: selectedId});
			if(txt > 0) {
				chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255]});
			} else {
				chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 0] });
			}
		}
	});
}

function logListener(data) {
	chrome.storage.sync.get({
		log_url: ''
	}, function(items) {
		log_url = items.log_url;
		if(!log_url.length) return;
		data = JSON.stringify(data);
		try {
			fetch(log_url, {
				method: 'post',
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				},
				body: data
			});
		} catch(e) { }
	});
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.log('message from cs', msg);
	tabId = sender.tab.id;
	if(msg.listener) {
		if(msg.listener == 'function () { [native code] }') return;
		msg.parent_url = sender.tab.url;
		if(!tab_listeners[tabId]) tab_listeners[tabId] = [];
		tab_listeners[tabId][tab_listeners[tabId].length] = msg;
		logListener(msg);
	}
	if(msg.pushState) {
		tab_push[tabId] = true;
	}
	if(msg.changePage) {
		delete tab_lasturl[tabId];
	}
	if(msg.log) {
		console.log(msg.log);
	} else {
		refreshCount();
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, props) {
	console.log(props);
	if (props.status == "complete") {
		if(tabId == selectedId) refreshCount();
	} else if(props.status) {
		if(tab_push[tabId]) {
			//this was a pushState, ignore
			delete tab_push[tabId];
		} else {
			//if(props.url && tab_lasturl[tabId] && props.url.split('#')[0] == tab_lasturl[tabId]) {
				//same url as before, only a hash change, ignore
			//} else 
			if(!tab_lasturl[tabId]) {
				//wipe on other statuses, but only if lastpage is not set (aka, changePage did not run)
				tab_listeners[tabId] = [];
			}
		}
	}
	if(props.status == "loading")
		tab_lasturl[tabId] = true;
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	selectedId = activeInfo.tabId;
	refreshCount();
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	selectedId = tabs[0].id;
	refreshCount();
});