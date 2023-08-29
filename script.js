'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// function for the error rendering
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg); // insert adjacent text can be used to insert an adjacent text (like without using html) and makes adjacent text
  countriesContainer.style.opacity = 1;
};

// render country function
const renderCountry = function (data, className = '') {
  // by default the className is set to an empty string so won't affect the class and stuff if nothing is there
  const html = `
    <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
              <h3 class="country__name">${data.name}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(
                +data.population / 1000000
              ).toFixed(1)}M people</p>
              <p class="country__row"><span>🗣️</span>${
                data.languages[0].name
              }</p>
              <p class="country__row"><span>💰</span>${
                data.currencies[0].name
              }</p>
            </div>
          </article>
          `;

  // insert html we dynamically made above
  countriesContainer.insertAdjacentHTML('beforeend', html);

  // set opacity to 1 which triggers an animation and shows this
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////
/*
// ASYNCHRONOUS JAVASCRIPT, AJAX, AND APIS
// synchronous code: code executed line by line in the defined order of execution (execution thread is a part of the execution context in the computer's cpu that executes this code). Can cause problems when one line of code takes a long time (like alert which blocks the code and only goes when we click ok).
// asynchronous: setTimeout is async since runs in the background and doesn't block the execution thread. Non-blocking code.
// Callbacks don't automatically make code async - some do and some don't. (like map doesn't, setTimeout does)
// setting the src attribute of an image is async since loading images takes time (there is a load event that is fired once its done loading) - the callback function runs once the load event is fired (defered an action into the future, making the code async and non-blocking).
// event listeners alone don't make code async like callbacks. Event listener listening for a click isn't doing anything in the background so not async. The load event waiting is async because the image is loading in the background then the callback function runs. Since things are happening in the background, this is async.
// AJAX - async JS and XML which allows us to communicate with remote web servers in a remote way - we can request data from web servers dynamically.
// if we want data from browser (client), we send http request to web server (different types - get request is a request to get data, post request is sending data to the server, etc). Then server sends a response with the data back. When asking for data, the server ussually has a web api (has the data we are asking for)
// API - Application Programming Interface. Software that can be used by another piece of software to allow applications to talk to each other and exchange information. True in all programming. Some examples are DOM api, geolocation api, etc. Other software (like our applications can interact with these self contained apis) - we can also make our own class api (and make some methods like our public interface - classes can fit this api description).
// "Online" API - application running on a server that recieves data requests and sends data back as a response. Also known as just API or web API, etc.
// we can build our own web APIs but we need back end development for that like with node.js or we can use 3rd part APIs
// data formats: XML (used to be widely used to transmit data on web but not many APIs use it anymore) - use term ajax since popular back in day, JSON data format (very popular - JS object but converted into a string)

// OUR FIRST AJAX CALL: XMLHttpRequest
// in JS there are multiple ways to do AJAX calls but we are going to do the most old school one
const getCountryData = function (country) {
  const request = new XMLHttpRequest(); // might need this in the future even though it is old
  request.open('GET', `https://restcountries.com/v2/name/${country}`); // args: request type (like get request is to get data), next one is the api endpoint or api link
  // CORS: cross origin resource sharing (need this to be unknown or yes so we can access it with our own code), auth means needs authentication (like api key), and some use https and others don't, etc.
  // api endpoints: name for the url of the api
  request.send(); // send the request and it fetches the data in the background and once we get it, the load event is fired. Can't store this in a variable since the data doesn't exist yet since its ASYNC so we need to wait for a result
  // console.log(request.responseText); // doesn't print anything since data doesn't exist yet

  // async since waiting for something to load (api call to come back)
  request.addEventListener('load', function () {
    //   console.log(this.responseText); // this refers to the request the event listener is on

    // we got JSON back so let's convert to a JS object
    const [data] = JSON.parse(this.responseText); // this is an object inside an array so we are just destructuring it (we could have also just added .data at the end of the parse but destructuring is cleaner)
    console.log(data);

    const html = `
  <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>
        `;

    // insert html we dynamically made above
    countriesContainer.insertAdjacentHTML('beforeend', html);

    // set opacity to 1 which triggers an animation and shows this
    countriesContainer.style.opacity = 1;
  });
};

// here we have 2 ajax calls happening at the same time - data appears at a slightly different time each time we load the page/request the data. The one arriving first fires the load event listener first
getCountryData('portugal');
getCountryData('usa');
getCountryData('germany');
// if we wanna make the requests in an order, we can chain the requests so one happens after the other, etc.

// HOW THE WEB WORKS: REQUESTS AND RESPONSES
// client sends req to web server and sends a response back to the client (called the Request-response model or the client-server architecture)
// web server: gets a protocol (http or https), then a domain name like restcountries.com and then the resource you are trying to access is the url. Need to convert doamin name to real server address since the domain name is not the actual one (its easy to know) so we have a server called DNS - domain name server that matches the url to the actual address (happens thru ur internet service provider) -> so first a DNS lookup happens and gets sent back to the client. Actual address has the protocol, IP address, then port number depending on the protocol. the resource is sent over in the http request
// STEP 1: DNS LOOKUP
// STEP 2: TCP/IP SOCKET CONNECTION between client and web server that is kept until all the files and stuff is transferred. Communication protocols (ip = internet protocol, tcp = transmission protocol which control how data is sent and communication and stuff)
// STEP 3: HTTP REQUEST - http = hypertext transfer protocol. Communication protocol which means a system of rules for 2 or more parties to communicate (like clients and servers - sending messages between them).
// start line: http method (like get, post (send), put, patch (put and patch are modify data)), request target (sending the resource we want to access, if it was a slash we would be accessing the website root), http version
// the next line is the http request header (many possibilities for stuff)
// next stuff is request body but ONLY when sending data to server like with post requests
// valuable to know what responses and http requests look like even tho we don't write it. https - is encrypted with TLS and SSL which is the difference between that and http but it basically works the same
// request is formed and sent to the web server (http request) which gets the data and sends it in a http response
// STEP 4: HTTP RESPONSE - start line: http version, status code (200=ok, 404=page not found, etc), status message based on status code, http response headers, reponse body (like could have JSON, etc)
// if accessing a webpage - we have many requests and responses since index.html is the first to be loaded and for every file there is a new request. This back and forth process is for every file (and there can be multiple requests at the same time). API is like one req/response
// tcp breaks requests down into packets and will reassemble the packets into data in the whole picture we want so the packets can take different internet routes to get to the client (so the data can be sent as fast as possible). IP ensures the data gets to where it needs to go by using IP addresses on each packet (routes the data)

*/
// WELCOME TO CALLBACK HELL
/*
const getCountryAndNeighbor = function (country) {
  // AJAX call for country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();

  // async since waiting for something to load (api call to come back)
  request.addEventListener('load', function () {
    // we got JSON back so let's convert to a JS object
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    // Render country 1
    renderCountry(data);

    // Get neighbor country
    const neighbor = data.borders?.[0]; // optional chaining to account for if the neighbor doesn't exist

    // guard clause if neighbor doesn't exist
    if (!neighbor) return;

    // AJAX call for country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbor}`); // we can search by country code like ESP by changing the resource to alpha instead of name
    request2.send();

    request2.addEventListener('load', function () {
      //   console.log(this.responseText); // this refers to reponse2 since event listener is on it
      // the ajax call for the neighbor will always be second because it is dependent on the first call already coming in (inside its event listener, need alpha code for the neighbor from it, etc).
      const data2 = JSON.parse(this.responseText); // response of the api is not an array anymore since we searched with a country code (unique so can always be one result instead of multiple which is why the name is with an array)
      console.log(data2);
      renderCountry(data2, 'neighbour');
    });
  });
};

// getCountryAndNeighbor('portugal');
getCountryAndNeighbor('usa');
// CALLBACK HELL: nested callbacks to execute async tasks in sequence (all async tasks, not just with ajax calls)
// callback hell example with set timeout - makes code hard to understand and maintain - code that is hard to understand code makes it bad code since harder to add more.
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 second passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
// we can escape callback hell by using promises (came with ES6)


// PROMISES AND THE FETCH API
// how we used to do it:
// const request2 = new XMLHttpRequest();
// request2.open('GET', `https://restcountries.com/v2/alpha/${neighbor}`); // we can search by country code like ESP by changing the resource to alpha instead of name
// request2.send();

// how we do it now
const request = fetch('https://restcountries.com/v2/name/portugal'); // more options that we can add to fetch like an options object, but we only really need the api url for now
console.log(request);

// Promise: An object that is used as a placeholder for the future result of an async operation. Or like a container for a future value (like a response from the AJAX call)
// Benefits: don't have to rely on events or callbacks passed into async functions (since sometimes they can be very unreliable), we can chain promises thus escaping callback hell
// Promise Lifecycle:
// pending: befoe the future value is available -> async task to get data and stuff -> async task finished then its called SETTLED
// settled has 2 states: fulfilled (data is now available) vs. rejected (error occurred) -> we can handle these states in our code.
// promises only settle ONCE. -> you can't change the state of the promise
// consume a promise: when you already have a promise (have to build the promise first - like the fetch api building the promise for us). Most of the time we are consuming promises (this means to use a promise to get a result)


// CONSUMING PROMISES
// const request = fetch('https://restcountries.com/v2/name/portugal');
// console.log(request);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function (response) {
//       console.log(response); // the then method gets the response (a reponse object that is a response from the promise)
//       // to read the reponse we need to call the JSON method on it to read the reponse (the response is a readable stream)
//       return response.json(); // this json method is also an async method so it will return a new promise. So we are returning this promise out of the function then using another then method to handle that new promise
//     })
//     .then(function (data) {
//       console.log(data); // this data, after calling the json method on the first promise, returns an array with an object inside with our data
//       renderCountry(data[0]);
//     });
//   // .then() is a method on a promise that says what to do once you get the fulfilled promise (fulfilled is either rejected or successful).
// };
// getCountryData('portugal');

// more simplified version without console logs and utilizing arrow functions and implicit returning stuff, etc. This is much cleaner than the older version.
// Promises still use callbacks (they don't get rid of callbacks but they get rid of callback hell)
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0]; // optional chaining to account for countries with no borders property
      if (!neighbour) return; // this doesn't work but we will talk about that later with error handlin

      // the then method always returns a promise in the sense that if we return a value, that will become the fulfillment value of the returned promise (returned from the then method) - technically it does though since if nothing is returned from a then method then a promise with undefined is returned.
      // Country 2 - once the original country is rendered, then get a neighbour country
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`); // the fulfilled value of this promise will be the parameter of the then method
      // putting another .then inside of here works BUT we get back into callback hell here since a then inside a then (so always return the promise) then chain .then outside of here
      // return 23;
    })
    // convert the promise's fulfilled value into json
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'));
  // .then(data => alert(data));
};

getCountryData('portugal'); // chaining promises with the then method - called a flat plane of promises: easy to understand and read


// HANDLING REJECTED PROMISES
// only way a fetch promise rejects is if a user loses their internet connection -> can't do offline since page won't load and this only fires when the user sends the request when offline (After the page has loaded). For the offline simulation to get the promise errors, we made the fetch once you click the where am i button, then you check disable cache and click offline in the network tab (After page has loaded)
*/
// refactor helper function to get the json from the fetch
const getJSON = function (url, errorMsg = 'Something went wrong') {
  // we need to return this fetch so this function can return a promise
  return fetch(url).then(response => {
    // console.log(response); // we can see that when we get data back the status is 200 and ok = true. Then if we don't get the data back (like it doesn't exist then ok = false and status is 404)

    // if the response isnt ok (which is a boolean) then we want to throw a new error that we made saying the country wasn't found using the status code in response.status
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`); // if this is true, then the promise returned by this then handler will automatically reject so then it will propagate down to the catch.
    // !!! -> The string that we pass into the constructor is the error's message!

    return response.json(); // convert response to json
  }); // for .then -> the first callback is when success and the second callback is for when the request is rejected - this is called catching the error so now we don't get the error for not catching the error
};
/*
// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(response => {
//       console.log(response); // we can see that when we get data back the status is 200 and ok = true. Then if we don't get the data back (like it doesn't exist then ok = false and status is 404)

//       // if the response isnt ok (which is a boolean) then we want to throw a new error that we made saying the country wasn't found using the status code in response.status
//       if (!response.ok) throw new Error(`Country not found ${response.status}`); // if this is true, then the promise returned by this then handler will automatically reject so then it will propagate down to the catch.
//       // !!! -> The string that we pass into the constructor is the error's message!

//       return response.json(); // convert response to json
//     }) // first callback is when success and the second callback is for when the request is rejected - this is called catching the error so now we don't get the error for not catching the error
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders?.[0];
//       if (!neighbour) return;

//       // Country 2 - once the original country is rendered, then get a neighbour country
//       return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
//     })
//     // convert the promise's fulfilled value into json
//     .then(response => response.json())
//     .then(data => renderCountry(data, 'neighbour'))
//     .catch(err => {
//       console.error(`${err} 💥💥💥`); // we can use .catch to catch any errors that occurred at any place in the .then chain. Errors basically go back down the entire chain to look for a catch and if not then it does an uncaught error (we didn't catch it)
//       // in real applications, we want to show an error message to the user so here it is
//       renderError(`Something went wrong 💥💥 ${err.message}`); // errors in JS are actually objects and we can make them with a constructor and stuff. So here we are getting the message property from the error(instead of the entire error, stack trace to see where the error is from, etc).
//     })
//     .finally(() => {
//       // THIS ONLY WORKS ON PROMISES -> IF CATCH (OR THE FUNCTION ABOVE THIS) RETURNS A PROMISE
//       // this callback function is always called after you get a result from the promise no matter if the promise is fulfilled or rejected. Used for things that always need to happen after a promise like hiding a loading spinner or something - doesn't matter if the operation was successful or rejected. Promise is resolved means its value is good -> either rejected or successful
//       countriesContainer.style.opacity = 1; // fade out the container when the promise is resolved
//     });
// };

// Refactored:
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      // if (!neighbour) return; // this doesn't really do anything since we want to throw a new error that will then be caught in our catch handler
      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2 - once the original country is rendered, then get a neighbour country
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`); // we can use .catch to catch any errors that occurred at any place in the .then chain. Errors basically go back down the entire chain to look for a catch and if not then it does an uncaught error (we didn't catch it)
      // in real applications, we want to show an error message to the user so here it is
      renderError(`Something went wrong 💥💥 ${err.message}`); // errors in JS are actually objects and we can make them with a constructor and stuff. So here we are getting the message property from the error(instead of the entire error, stack trace to see where the error is from, etc).
    })
    .finally(() => {
      // THIS ONLY WORKS ON PROMISES -> IF CATCH (OR THE FUNCTION ABOVE THIS) RETURNS A PROMISE
      // this callback function is always called after you get a result from the promise no matter if the promise is fulfilled or rejected. Used for things that always need to happen after a promise like hiding a loading spinner or something - doesn't matter if the operation was successful or rejected. Promise is resolved means its value is good -> either rejected or successful
      countriesContainer.style.opacity = 1; // fade out the container when the promise is resolved
    });
};

btn.addEventListener('click', function () {
  getCountryData('portugal');
});

getCountryData('adfkljasdf'); // catch cannot pick up on the 404 error so we will do this in the next video. this country doesn't exist but the error we are getting is flag is undefined but it doesn't exist which is reflected by the 404 error we got so we can throw errors manually to handle this error and not handle the flag error (which we don't want since that isnt the root error)
// remember that the only way a promise is rejected is if the user loses their internet connection when the request is being sent - otherwise itll be fulfilled (whether we get a value or not - like undefined if something doesn't exist)
// this catching and throwing error stuff is VERY important in the real world like for telling the user through the UI what's going on, etc.


// CODING CHALLENGE #1
const whereAmI = function (lat, lng) {
  // fetch to get the coordinates
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=393992887803963242397x69037`
  )
    .then(response => {
      console.log(response);
      // if we get a 403 error then there was a problem with the request so throw the error
      // response.status = 403; // remember you can't set the values of promises or you will get an error
      // if (response.status === 403)
      //   throw new Error('Error connecting to the API');
      // this is much better since its checking if any issue with the response (in that case ok would be false) instead of just checking one scenario which is the code is 403
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      // convert to json
      return response.json();
    })
    .then(data => {
      // amking the parameter called data now since this is the data from the json conversion not the fetch response anymore
      console.log(data);
      if (data?.error?.code === '006') throw new Error('Rate Limit Exceeded');
      // print the message
      console.log(`You are in ${data.city}, ${data.country}`);

      // get country data from countries api - return the fetch so we don't have callback hell (then inside of a then) and since the then takes the returned promise, if we return this then we are good (and fetch returns a promise)
      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then(response => {
      // if the response isn't ok then throw an error
      if (!response.ok) throw new Error(`Country not found ${response.status}`);

      // convert response to json
      return response.json();
    })
    .then(data => {
      // render the country
      renderCountry(data[0]);
    })
    .catch(error => {
      // console.log(error);
      // console.log(error.message);
      console.log(`💥${error.message}`);
    });
};

whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// errors are from 3 req/sec so could do a "sync wait method" by making a promise and waiting for it - using async stuff so less intensive on cpu as opposed to a while loop and getting the current timestamp and comparing from there like maybe something like this even though its from 2011: https://stackoverflow.com/questions/6921895/synchronous-delay-in-code-execution


// ASYNC: BEHIND THE SCENES: THE EVENT LOOP
// JS Runtime in the browser: container with everything to execute JS code
// engine: heart of runtime: has heap (where obj stored in memory) and call stack where code executed. Only one thread of execution (no multitasking)
// web apis: apis given to engine but not part of JS language itself - like fetch, dom, timers, etc.
// callback queue: holds the ready to be executed callback functions from events -> event loop puts these into call stack to run it - event loop lets async stuff work
// concurrency model: how JS handles multiple tasks happening at the same time (Event loop is how JS does this)
// question: how can async code be executed non blocking if only one thread?
// async tasks run in the web apis - since they have dom, timers, fetch, etc. If an img was loading sync then it would load in call stack and block everything
// callback on image goes into web apis since once image loads that is what happens.
// each line goes in call stack and when done its gone
// data fetch gets put into web apis environment. And .then goes inside there too once we get the promise
// once an event is fired, the callback is put in the callback queue (tasks the call stack will have to complete) - goes to the end of the queue -> if you had a timer and other callbacks inside the queue then the timer duration would be off. Callback queue also has DOM events (not async but still use this queue) -> so when an event is fired it will wait for its turn.
// event loop - if stack is empty, it takes the first callback from queue to be executed (event loop tick is what happens each time this movement happens) - orchestration of JS runtime.
// JS language has no sense of time since all the async stuff happens in runtime (not in engine) and the event loop moves stuff.
// promises work in a slightly different way -> callbacks of promises have their own queue called mictrotasks queue (has prioerity over callback queue -> similar to callback queue) -> event loop after every event loop tick (after moving the callback from queue to call stack) will run EVERY promise callback (also called MICROTASKS) in the microtasks queue before continuing callback queue execution
// if a microtask adds a new microtask, then that new microtask will be executed first - meaning microtasks can starve the callback queue (usually never a problem but that could happen)
// if you had a click event the callback would be in web api environment and then one fired, it would be moved to callback queue


// THE EVENT LOOP IN PRACTICE
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res)); // Promise.resolve allows us to create a promise that is immediately resolved with a success value that we pass in. We can handle this with a then method as well
Promise.resolve('Resolved promise 2').then(res => {
  // simulating a long time microtask (the promise is still resolved immediately) but the microtask might not. So this will show how the timer will be delayed.
  for (let i = 0; i < 100000000; i++) {}
  console.log(res);
});
console.log('Test end');
// any code that is synchornous (not in a callback), will execute first so the console logs will execute first. Promise and timer finish at the same time - since promise callbacks (microtasks) have priority (microtasks queue has priority) so the promise callback will run first instead of the timer.
// timer might run a little bit later depending on how long it takes for the promise to run - this means u can't do high precision things with javascrpt timers since these timers aren't really accurate hwne doing promises things.


// Building a Simple Promise
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    // made some async behavior with this timer
    // executor function auto executed as the promise constructor is made. Get 2 params: resolve and reject (these are functions)
    // this should produce a result since this handles the async stuff when we get the promise
    if (Math.random() >= 0.5) {
      resolve('You WIN 💰'); // in this ase we win the lottery so in order to set the promise as fulfilled/resolved, we use the resolved function.
      // pass the fulfilled value of the promise in here (available in the then method as the param) and then handle the promise with the then method.
    } else {
      // mark promise as rejected
      reject(new Error('You lost your money 💩')); // we can also make an erro be the rejected value of the promise
    }
  }, 2000);
}); // make a new promise with the promise constructor (they have constructors so they are just objects in JS). Param1: Takes an executor function.
// REMEMBER THE 2 states of promises: fulfilled or rejected!
lotteryPromise.then(res => console.log(res)).catch(err => console.log(err)); // doing then and catch on the promise (the lotteryPromise stuff in the function is the promise we are making like the promise we get back from fetching) and then we are handling the stuff here.

// Promisifying the set timeout function
const wait = function (seconds) {
  // fetch function returns a promise which is what we are doing here as well. We are promisifying the set timeout function.
  return new Promise(function (resolve) {
    // we don't need the reject function because it is impossible for the timer to fail. This function runs when the promise is resolved. Resolve is a function to set the resolved value.
    setTimeout(resolve, seconds * 1000); // just passing the resolve function in the set timeout function - we don't really need anything for the set timeout function so we are just passing the resolve function since the intent is just for it to wait.
  });
};

// consuming the promise
wait(2)
  .then(() => {
    console.log('I waited for 2 seconds.');
    return wait(1); // just if we want chaining and stuff
  })
  .then(() => {
    console.log('3 seconds passed.');
    return wait(1); // just if we want chaining and stuff
  })
  .then(() => {
    console.log('4 seconds passed.');
    return wait(1); // just if we want chaining and stuff
  })
  .then(() => console.log('I waited for 1 second.')); // another 1 second waiting.
// this is SO much better as opposed to the callback hell

// remember this way to immediately resolve (fulfill)/reject a promise
Promise.resolve('abc').then(x => console.log(x)); //
Promise.reject(new Error('Problem!')).catch(x => console.error(x)); // the value of the x will be the error named Promise. Catching the error that we did immediately.

// PROMISIFYING THE GEOLOCATION API
// navigator.geolocation.getCurrentPosition(
//   position => console.log(position),
//   err => console.error(err)
// ); // get current position, 2 callbacks: success, error. The first callback gets the position as an argument.  the second gets the error
// console.log('Getting position'); // logged first since the other function sent its stuff to the Web API environment in the browser

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position), // set the position as the fulfilled/resolved value of the promise
    //   err => reject(err)
    // ); // get current position, 2 callbacks: success, error. The first callback gets the position as an argument.  the second gets the error
    // ths stuff above happens automatically with this:
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
getPosition().then(pos => console.log(pos)); // when the promise was successful, the resolve function was auto called which returned the position value as the fulfilled value of the promise

const whereAmI = function () {
  // using the geolocation of our device to get the coords
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords; // setting the value of the properties into new variables

      // get the country stuff
      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=393992887803963242397x69037`
      );
    })
    .then(response => {
      console.log(response);
      // if we get a 403 error then there was a problem with the request so throw the error
      // response.status = 403; // remember you can't set the values of promises or you will get an error
      // if (response.status === 403)
      //   throw new Error('Error connecting to the API');
      // this is much better since its checking if any issue with the response (in that case ok would be false) instead of just checking one scenario which is the code is 403
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      // convert to json
      return response.json();
    })
    .then(data => {
      // amking the parameter called data now since this is the data from the json conversion not the fetch response anymore
      console.log(data);
      if (data?.error?.code === '006') throw new Error('Rate Limit Exceeded');
      // print the message
      console.log(`You are in ${data.city}, ${data.country}`);

      // get country data from countries api - return the fetch so we don't have callback hell (then inside of a then) and since the then takes the returned promise, if we return this then we are good (and fetch returns a promise)
      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then(response => {
      // if the response isn't ok then throw an error
      if (!response.ok) throw new Error(`Country not found ${response.status}`);

      // convert response to json
      return response.json();
    })
    .then(data => {
      // render the country
      renderCountry(data[0]);
    })
    .catch(error => {
      // console.log(error);
      // console.log(error.message);
      console.log(`💥${error.message}`);
    });
};

// setting it up with the event handler
btn.addEventListener('click', whereAmI);


// CODING CHALLENGE #2
let currentImage;
const imgContainer = document.querySelector('.images');

const createImage = imagePath => {
  // this creation of the promise is like fetch (getting the data from the api). then we consume the promise with then later
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imagePath;

    // wait for it to load
    img.addEventListener('load', function () {
      imgContainer.append(img); // adds the image to the image container
      resolve(img); // mark it as successful
    });

    // in the case of errors
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

// wait function
const wait = seconds => {
  return new Promise(function (resolve) {
    setTimeout(resolve, 1000 * seconds);
  });
};

createImage('img/img-1.jpg')
  .then(img => {
    // we get the img element as the resolved value of the promise
    console.log('Image 1 loaded');
    // store current image
    currentImage = img;
    // pause execution for 2 seconds - returns a promise so we are just using a then handler
    return wait(2);

    // hide current image - this should work even w/o a then
    // img.display = 'none';
  })
  .then(() => {
    // the wait function doesn't return any resolved value
    currentImage.style.display = 'none';
    return createImage('img/img-2.jpg')
      .then(img => {
        currentImage = img;
        console.log('Image 2 loaded');
        return wait(2);
      })
      .then(() => {
        currentImage.style.display = 'None';
      });
  })
  .catch(err => console.error(err.message));


// CONSUMING PROMISES WITH ASYNC/AWAIT
const x = 4;
let getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position), // set the position as the fulfilled/resolved value of the promise
    //   err => reject(err)
    // ); // get current position, 2 callbacks: success, error. The first callback gets the position as an argument.  the second gets the error
    // ths stuff above happens automatically with this:
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getPosition = 4; // this will throw an error since we can't change the value of a const
// theres a better way to consume promises and that is with async/await
const whereAmI = async function () {
  // this function is an async function meaning it will run in the background and it will return a promise automatically (more on this in the next video)
  try {
    // if error in here then handle it in catch
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords; // dont need to throw an error manually here because if the property doesn't exist here then it will throw an error automatically and go to the catch block

    // reverse geocoding
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=393992887803963242397x69037`
    );
    if (!resGeo.ok) throw new Error('Problem getting location'); // fetch only throws an error if user doesn't have network, so in the other cases (doesn't get data) then we need to throw an error manually and automatically jump to the catch block

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    // we can have 1 or more await statements in these async functions
    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`
    ); // stops code execution IN THE FUNCTION until the data has been fetched or the await thing is done. This doesn't stop execution because this is stopping execition in the async function which is running in the background - not in the main execution.
    console.log(res);
    // the async/await is simply syntatic sugar over the then handlers - its essentially the same as doing it the "old" way with returning promises and with then handlers.
    // the old way: fetch(`https://restcountries.com/v2/name/${country}`).then(res => console.log(res));
    if (!res.ok) throw new Error('Problem getting country'); // check if error in the response for the country (stored in the variable called res NOT resGeo since that's for the geocoding)

    const data = await res.json(); // converting it into json and storing it into a variable (previously we had to use a then handler)
    console.log(data);
    renderCountry(data[0]);

    // testing reutrn
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    // anytime an error is found in the try block, whether that is manually or automatically, then the catch block will run
    console.error(`${err}💥`);
    renderError(`Something went wrong 💥 ${err.message}`);
  }

  // Reject the promise returned from the async function (this will only run if there was an error since if it worked then the return statement would end the execution of the async function so we wouldn't be able to read here)
  throw err;
};
console.log('1: Will get location and country');
const city = whereAmI(); // this will print after the first console.log prints because this is async and runs in the background
console.log(city); // this will print a PENDING promise since this is proof an async function always returns a promise. Since the function is async, JS returns a pending promise since it doesn't know what the value will be yet.
console.log('2: Finished getting location'); // this will print after the first console.log prints because this is async and runs in the background so the above function won't print before this

whereAmI()
  .then(city => console.log(city))
  .catch(err => console.log(`2: ${err.message}💥`)) // this will only print only once the promise comes because we have a then handler. The catch handler will only run if the promise returned from the whereAmI is rejected (no network) or an error is thrown.
  .finally(() => console.log('3: Finished getting location')); // this will always run no matter if the promise is fulfilled or rejected (no matter if the promise is successful or not)
console.log('first'); // this will print first since its the first sync
// async and await is actually used with the then method a lot sometimes too. We need to have error handling here since the errors will basically break our code.

// await can ONLY be used in an async function for right now.
// we are mixing the async/await here with the then, catch, finally (mixing the old methods with the async/await keywords)
// but we don't want to make a new function here SO we can make an IIFE (immediately invoked function expression) to do this (anonymous function)
(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}💥`);
  }
  console.log(`3: Finished getting location`);
});

// Error Handling with Try Catch
// we can put all our code in a try except block to catch any errors that occur in the try block
// try {
//   let y = 1;
//   const x = 2;
//   x = 3; // this will throw an error since we can't change the value of a const
// } catch (err) {
//   // we get the error object as the param of the catch block. We catch the error and then we can handle it accordinglly
//   alert(err.message);
// }

// RETURNING VALUES FROM ASYNC FUNCTIONS
// mixed with the code from 2 lectures above


// RUNNING PROMISES IN PARALLEL
// example is where we want to get data for 3 countries if we don't need to do it in order.
// remember to have try catch for async functions
const get3Countries = async function (c1, c2, c3) {
  try {
    // basically now we are running the 3 promises one after another since the await will ginish the first fetch then it will do the other one then the last one - since await is blocking in async functions, then this isn't turly parallel because we are blocking.
    // This is how we would do it IF the order mattered. But if we did this in parallel, we would be able to save a lot of time.
    // const [data1] = await getJSON(`https://restcountries.com/v2/name/${c1}`); // result of this is an array with one object which is why we use destructuring.
    // const [data2] = await getJSON(`https://restcountries.com/v2/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v2/name/${c3}`);

    // Doing this truly in parallel -> doing this with the await keyword because otherwise the console.log printing data would automatically run and return a pending promise. The await keyword will wait until we get the data and then print the data to the console.
    const data = await Promise.all([
      await getJSON(`https://restcountries.com/v2/name/${c1}`), // result of this is an array with one object which is why we use destructuring.
      await getJSON(`https://restcountries.com/v2/name/${c2}`),
      await getJSON(`https://restcountries.com/v2/name/${c3}`),
    ]); // takes in an array of all the promises, then it returns a promise that runs these all at the same time. This is a static method on the promise constructor.
    // IMPORTANT: promise.all short circuits when even one of the promises rejects. So if one of the promises rejects, then the entire promise.all rejects. This is good since we don't want to show the user 2 countries and not the third one. We want to show all 3 or none of them.
    // This is called a combinator function because it combines multiple promises into one. There are more.
    // You could also handle these fetches with then handlers

    console.log(data); // we are putting this stuff in an array because we want all the capitals in an array

    // looping and returning an array with all the capital cities
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};
get3Countries('portugal', 'canada', 'tanzania');
// this is quite a common technique and helps with loading times.


// OTHER PROMISE COMBINATORS: RACE, ALLSETTLED, ANY
// of these combinator functions takes in an array of promises and then returns a promise depending on these
// Promise.race - promise settled as soon as one of the input promises settled (settled = value is available and doesn't mean if the promise is fulfilled or rejected)
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v2/name/italy`),
    getJSON(`https://restcountries.com/v2/name/egypt`),
    getJSON(`https://restcountries.com/v2/name/mexico`),
  ]);
  console.log(res[0]);
})(); // remember that the set of the parenthesis at the end here calls this expression function
// the fulfillment value of the promise is the one that was settled first (the one that wins first - returns the faster one)
// a rejected promise can also win the race since this short circuits once one of the promises settles.
// This is helpful because WE can make a timer tiemout function so we can use that with the other promises and if the promise loading takes a certain amount of time then that timer will reject so the user isn't stuck waiting for the promise to load forever (helps with NEVER ENDING promises or EXTREMELY SLOW promises)

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    // using the throwaway var convention since don't need resolve
    setTimeout(function () {
      // after the time has passed, reject the error using the reject method we get.
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v2/name/tanzania`),
  timeout(0.000000000001), // waiting a very small amount and this shows how if it takes too long then the promise will reject and say its taking too long just to show the example.
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));
// Promise.race and Promise.all are the 2 most important combinator functions

// Promise.allSettled - new (ES2020) - returns an array of all the settled promises (NEVER SHORT circuits - even if one of them rejects -> the Promise.all does short circuit if one of them rejects
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err)); // see that we get an array with all this even though one of the promises rejects

// Promise.any (new ES2021) - takes in an array of promises and returns the first fulfilled promise and ignores the rejected promises. Always returns a fulfilled promise (unless all of them reject)
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));
*/

// CODING CHALLENGE #3
let currentImage;
const imgContainer = document.querySelector('.images');

// this getting the image src is the same as coding challenge 2
const createImage = imagePath => {
  // this creation of the promise is like fetch (getting the data from the api). then we consume the promise with then later
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imagePath;

    // wait for it to load
    img.addEventListener('load', function () {
      imgContainer.append(img); // adds the image to the image container
      resolve(img); // mark it as successful
    });

    // in the case of errors
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

// wait function
const wait = seconds => {
  return new Promise(function (resolve) {
    setTimeout(resolve, 1000 * seconds);
  });
};

// the new coding challenge 3 stuff
// createImage('img/img-1.jpg')
//   .then(img => {
//     // we get the img element as the resolved value of the promise
//     console.log('Image 1 loaded');
//     // store current image
//     currentImage = img;
//     // pause execution for 2 seconds - returns a promise so we are just using a then handler
//     return wait(2);

//     // hide current image - this should work even w/o a then
//     // img.display = 'none';
//   })
//   .then(() => {
//     // the wait function doesn't return any resolved value
//     currentImage.style.display = 'none';
//     return createImage('img/img-2.jpg')
//       .then(img => {
//         currentImage = img;
//         console.log('Image 2 loaded');
//         return wait(2);
//       })
//       .then(() => {
//         currentImage.style.display = 'None';
//       });
//   })
//   .catch(err => console.error(err.message));

// const loadNPause = async function () {
//   try {
//     let img = await createImage('img/img-1.jpg'); // don't need current image anymore because we aren't doing this in different then handlers so we don't need a global variable for this since its all in one function.
//     console.log('Image 1 loaded!');
//     await wait(2);
//     img.style.display = 'none';
//     await createImage('img/img-2.jpg');
//     console.log('Image 2 loaded');
//     await wait(2);
//     img.style.display = 'none';
//   } catch (err) {
//     // we can actually use catch without using the error argument
//     console.error(err);
//   }
// };

// Part 2
// const loadAll = async function (imgArr) {
//   const imgs = imgArr.map(async val => {
//     await createImage(val);
//   });
//   console.log(imgs);
// }; // doesn't work - returns 3 undefined promises because the functions will return a promise and once its fulfilled. Remember the async function always returns a promise and not necessarily returning the fulfilled value that we want and we are doing this 3 times which is why we get 3 promises like that. So we need to use promise.all to get the actual fulfilled values of the promises (since want the loading of the images to be parallel in the background).
// [SEE THE SOLUTION BELOW FOR CLEAR INFO THIS IS KINDA RANDOM]

// loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);
// const loadAll = async function () {
//   await Promise.all([
//     createImage('img/img-1.jpg'),
//     createImage('img/img-2.jpg'),
//     createImage('img/img-3.jpg'),
//   ]);
//   imgs.map(img => {
//     img.classList.add('parallel');
//   });
// };

// what i kinda did
// const loadAll = async function (imgArr) {
//   try {
//     await Promise.all([
//       createImage('img/img-1.jpg'),
//       createImage('img/img-2.jpg'),
//       createImage('img/img-3.jpg'),
//     ]);
//     imgs.map(img => {
//       img.classList.add('parallel');
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };
// loadAll();

// what Jonas did
const loadAll = async function (imgArr) {
  try {
    // using a loop to create the image, we could have also called the create image function inside Promise.all like I did above but that doesn't keep the code dry.
    const imgs = imgArr.map(async img => await createImage(img));
    console.log(imgs); // here this will print an array of 3 PENDING promises so then we have to wait until we can get the actual values (resolved/rejected) with Promise.all
    const imgsEl = await Promise.all(imgs); // waiting for the promise to get a resolved value and once we get the values, we will continue with the execution of the code.
    console.log(imgsEl);
    imgsEl.map(img => {
      img.classList.add('parallel');
    });
  } catch (err) {
    console.error(err);
  }
};
loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);
