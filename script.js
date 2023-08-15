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
*/

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
