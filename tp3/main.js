import { MyApp } from './MyApp.js';

// create the application object
let app = new MyApp()
// initializes the application
app.init()

// main animation loop - calls every 50-60 ms.
app.render()
