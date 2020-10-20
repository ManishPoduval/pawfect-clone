document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  // get reference to calendar element (id="calendar")
  var calendarEl = document.getElementById('calendar');

  // initialize calendar library
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
  });

  // register our function to be called when the library needs data
  calendar.addEventSource(async function(a, cb){
    let startDate = a.startStr.substring(0, 10);
    let endDate = a.endStr.substring(0, 10);

    // fetch requests the data from api
    // this is the same as visiting it in the browser, but then we get it back
    // as a variable (response)
    // example: http://localhost:3000/api/events/2020-10-01/2020-11-08
    let response = await fetch('/api/events/' + startDate + '/' + endDate);

    // the response is json so we need to read it
    let data = await response.json();

    // returns the received data from our API to the calendar library
    return data;
    
  });
  calendar.render();


}, false);


