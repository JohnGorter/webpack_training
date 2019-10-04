# Tapable

---
### Tapable

Tapable is 
- Core of Webpack
- Open Source JavaScript Module
- Collection of Hook classes, which can be used to create hooks for plugins


https://github.com/webpack/tapable

---
### Tapable

The tapable package expose many Hook classes, which can be used to create hooks for plugins.
```
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```

 ---
 ### Installation

To install use
```
npm install --save tapable
```

---
### Usage
All Hook constructors take one optional argument, which is a list of argument names as strings.
```
const hook = new SyncHook(["arg1", "arg2", "arg3"]);
```

The best practice is to expose all hooks of a class in a hooks property:
```
class Car {
	constructor() {
		this.hooks = {
			accelerate: new SyncHook(["newSpeed"]),
			brake: new SyncHook(),
			calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
		};
	}

	/* ... */
}
```

---
### Usage (2)

Other people can now use these hooks:
```
const myCar = new Car();

// Use the tap method to add a consument
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
It's required to pass a name to identify the plugin/reason.
```

You may receive arguments:
```
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
```

---
### Hooks
Sync hooks
- tap is the only valid method to add a plugin

Async Hooks
 - support async plugins
```
myCar.hooks.calculateRoutes.tapPromise("GoogleMapsPlugin", (source, target, routesList) => {
	// return a promise
	return google.maps.findRoute(source, target).then(route => {
		routesList.add(route);
	});
});
```
```
myCar.hooks.calculateRoutes.tapAsync("BingMapsPlugin", (source, target, routesList, callback) => {
	bing.findRoute(source, target, (err, route) => {
		if(err) return callback(err);
		routesList.add(route);
		// call the callback
		callback();
	});
});
```

---
### Hooks (2)

You can use sync plugins in async hooks
```
// You can still use sync plugins
myCar.hooks.calculateRoutes.tap("CachedRoutesPlugin", (source, target, routesList) => {
	const cachedRoute = cache.get(source, target);
	if(cachedRoute)
		routesList.add(cachedRoute);
})
```


---
### Hooks (3)

The class declaring these hooks need to call them:
```
class Car {
	/**
	  * You won't get returned value from SyncHook or AsyncParallelHook,
	  * to do that, use SyncWaterfallHook and AsyncSeriesWaterfallHook respectively
	 **/

	setSpeed(newSpeed) {
		// following call returns undefined even when you returned values
		this.hooks.accelerate.call(newSpeed);
	}

	useNavigationSystemPromise(source, target) {
		const routesList = new List();
		return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
			// res is undefined for AsyncParallelHook
			return routesList.getRoutes();
		});
	}

	useNavigationSystemAsync(source, target, callback) {
		const routesList = new List();
		this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
			if(err) return callback(err);
			callback(null, routesList.getRoutes());
		});
	}
}
```

---
### Hooks (3)

The Hook will compile a method with the most efficient way of running your plugins. It generates code depending on:
- the number of registered plugins (none, one, many)
- the kind of registered plugins (sync, async, promise)
- the used call method (sync, async, promise)
- the number of arguments
- whether interception is used

This ensures fastest possible execution

---
### Hook types
Each hook can be tapped with one or several functions. How they are executed depends on the hook type:

- Basic hook: This hook simply calls every function it tapped in a row.
- Waterfall: A waterfall hook also calls each tapped function in a row
 - Unlike the basic hook, it passes a return value from each function to the next function
- Bail: A bail hook allows exiting early. When any of the tapped function returns anything, the bail hook will stop executing the remaining ones

Loop. TODO

---
### Hook types (2)
Additionally, hooks can be 
- synchronous
- asynchronous
 
 To reflect this, there’re “Sync”, “AsyncSeries”, and “AsyncParallel” hook classes
- Sync. A sync hook can only be tapped with synchronous functions (using myHook.tap()).
- AsyncSeries. An async-series hook can be tapped with synchronous, callback-based and promise-based functions using
  - myHook.tap(), 
  - myHook.tapAsync() 
  - myHook.tapPromise()) 

They call each async method in a row.
- AsyncParallel: as Async but they run each async method in parallel.

The hook type is reflected in its class name
- AsyncSeriesWaterfallHook allows asynchronous functions and runs them in series

---
### Interception
All Hooks offer an additional interception API:
```
myCar.hooks.calculateRoutes.intercept({
	call: (source, target, routesList) => {
		console.log("Starting to calculate routes");
	},
	register: (tapInfo) => {
		// tapInfo = { type: "promise", name: "GoogleMapsPlugin", fn: ... }
		console.log(`${tapInfo.name} is doing its job`);
		return tapInfo; // may return a new tapInfo object
	}
})
```

---
### Interception (2)

call: (...args) => void 
Adding call to your interceptor will trigger when hooks are triggered. You have access to the hooks arguments.

tap: (tap: Tap) => void 
Adding tap to your interceptor will trigger when a plugin taps into a hook. Provided is the Tap object. Tap object can't be changed.

loop: (...args) => void 
Adding loop to your interceptor will trigger for each loop of a looping hook.

register: (tap: Tap) => Tap | undefined 
Adding register to your interceptor will trigger for each added Tap and allows to modify it.

---
### Context
Plugins and interceptors can opt-in to access an optional context object, which can be used to pass arbitrary values to subsequent plugins and interceptors.
```
myCar.hooks.accelerate.intercept({
	context: true,
	tap: (context, tapInfo) => {
		// tapInfo = { type: "sync", name: "NoisePlugin", fn: ... }
		console.log(`${tapInfo.name} is doing it's job`);

		// `context` starts as an empty object if at least one plugin uses `context: true`.
		// If no plugins use `context: true`, then `context` is undefined.
		if (context) {
			// Arbitrary properties can be added to `context`, which plugins can then access.
			context.hasMuffler = true;
		}
	}
});

myCar.hooks.accelerate.tap({
	name: "NoisePlugin",
	context: true
}, (context, newSpeed) => {
	if (context && context.hasMuffler) {
		console.log("Silence...");
	} else {
		console.log("Vroom!");
	}
});
```

---
### HookMap
A HookMap is a helper class for a Map with Hooks
```
const keyedHook = new HookMap(key => new SyncHook(["arg"]))
keyedHook.for("some-key").tap("MyPlugin", (arg) => { /* ... */ });
keyedHook.for("some-key").tapAsync("MyPlugin", (arg, callback) => { /* ... */ });
keyedHook.for("some-key").tapPromise("MyPlugin", (arg) => { /* ... */ });
const hook = keyedHook.get("some-key");
if(hook !== undefined) {
	hook.callAsync("arg", err => { /* ... */ });
}
```

---
### MultiHook
A helper Hook-like class to redirect taps to multiple other hooks:
```
const { MultiHook } = require("tapable");

this.hooks.allHooks = new MultiHook([this.hooks.hookA, this.hooks.hookB]);
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Using tapable


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Writing a plugin for tapable