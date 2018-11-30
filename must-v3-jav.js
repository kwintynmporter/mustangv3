
var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;
var currentContactIndex = 0; 
var consoleForm = []; 

// Functions
function initApplication(){ 
    console.log("Mustang v3 Starting");
    document.getElementById("nameID").value = "";   
    document.getElementById("emailID").value = "";   
    document.getElementById("cityID").value = "";   
    document.getElementById("stateID").value = "";
    document.getElementById("zipID").value = ""; 

}

function viewCurrentContact() {
    currentContact = contactArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("nameID").value = currentContact.preferredName;   
    document.getElementById("emailID").value = currentContact.email;   
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;


    // Todo: Add additional fields.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + (contactArray.length);
    document.getElementById("indexID").innerHTML;  
}

function importContacts() {
    console.log("importContacts");
    loadIndexandContacts(); 
}

function logContacts() {
    console.log("contactArray: "); 
    console.log("contactArray"); 
}
// Hiding the  "Previous" button when the currentContactIndex = 0. 
function previous() {
    if (currentContactIndex > 0) {
       currentContactIndex--;
    }
    $(document).ready(function () {
        var count = 0;
        $("#prevID").click(function () {
            if (count == currentContactIndex+1 && currentContactIndex == 0) {
                $("#prevID").hide();
            } else count++
        });
    
    });
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();

    // Todo: Save changed items to contacts array and resort array.
}

// Hiding the "Next" button when the number of clicks = the number of contacts in the array.   
function next() {
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
$(document).ready(function () {
    var count = 0; 
    $("#nextID").click(function () {
        if (count >= contactArray.length-3) {
            $("#nextID").hide();
        } else count++ 
    });

});
// This is where the editions of the array are locally saved. 
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
}
// Adding element to array. -v 
function add() {
    console.log('add()');
    xmlhttp = new XMLHttpRequest(); 
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('Response: ' + this.responseText); 
            setStatus(this.responseText)
        }
    }; 
    xmlhttp.open("POST", "save-contacts.php", true); 
    xmlhttp.serRequestHeader("Content-type", "application/x-www-form-utlencoded"); 
    xmlhttp.send("contacts=" + JSON.stringify(contactArray)); 

// Clears the currentContactIndex so you can write new in formation in the fields.   
    var consoleForm = []; 
    document.getElementById('nameID').value=" "; 
    document.getElementById('emailID').value=" "; 
    document.getElementById('cityID').value=" "; 
    document.getElementById('stateID').value=" "; 
    document.getElementById('zipID').value=" "; 
    
    
    console.log(); 
// Todo: Implement add functionality by inserting new element into array.
}

function loadContactsFromServer() { 
    console.log("loadContactsfromServer()");
    contactArray.length = 0; 
    
    xmlhttp = new XMLHttpRequest(); 
    xmlhttp.onreadystatechange = function() { 
        if(this.readyState == 4 && this.status == 200) { 
            contactArray = JSON.parse(this.responseText); 
            setStatus("Loaded contacts (" + contactArray.length + ")"); 

            currentContactIndex = 0; 
            viewCurrentContact() 
        }
    }

    xmlhttp.open("GET", "load-contacts.php", true); 
    xmlhttp.send(); 
}

// Clears the contact so that you can no longer visibly see it. 
function remove() {
    console.log('remove()');
    document.getElementById('nameID').value=" "; 
    document.getElementById('emailID').value=" "; 
    document.getElementById('cityID').value=" "; 
    document.getElementById('stateID').value=" "; 
    document.getElementById('zipID').value=" ";  


}

// I'm not sure what we're supposed to do with this. 
function zipBlurFunction() {
    getPlace();
    var input = document.getElementById("zipID");
    var awesomplete = new Awesomplete(input, {
      minChars: 1,
      autoFirst: true
    });
    
    $("input").on("keyup", function(){
      $.ajax({
        url: 'https://mustang-index.azurewebsites.net/index.json' + this.value,
        type: 'GET',
        dataType: 'json'
      })
      .success(function(data) {
        var list = [];
        $.each(data, function(key, value) {
          list.push(value.name);
        });
        awesomplete.list = list;
      });
    });
}

function keyPressed() {
    console.log('keyPressed()');

    // This type of function should be useful in search as it implements keyPressed.
}

function getPlace() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    // Register the embedded handler function
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if (document.getElementById("cityID").value == "")
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

function initApplication() {
    console.log('Mustang v2 Lite - Starting!'); 
    loadIndex();
}

function loadIndex() {
    // Load the Mustang index file.
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        console.log("Index JSON:" + indexRequest.responseText);
        document.getElementById("indexID").innerHTML = indexRequest.responseText;
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i=0; i<contactIndex.length; i++) {
            contactURLArray.push(contactIndex[i].ContactURL);
        }
        console.log("ContactURLArray: " + JSON.stringify(contactURLArray));
        loadContacts();
        document.getElementById("contactsID").innerHTML+ "Here are the contacts" + (contactArray); 
    }
    indexRequest.send();
}
 
function loadContacts() {
    // Clear the current contactArray.
    contactArray.length = 0;
    loadingContact = 0;

    // Note that W3C documentation and my experimentation indicate that each XMLHttpRequest callback function must be a 
    // unique instance of a function. A better implmentation would have had an array of callback functions instead of a 
    // recursive call to load
    if (contactURLArray.length > loadingContact) {
        loadNextContact(contactURLArray[loadingContact]);
    }
}

function loadNextContact(URL) {
    console.log("URL: " + URL);
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', URL);
    contactRequest.onload = function() {
        console.log(contactRequest.responseText);
        var contact;
        contact = JSON.parse(contactRequest.responseText);
        console.log("Contact: " + contact.firstName);
        contactArray.push(contact);

        document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray);

        document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;

        loadingContact++;
        if (contactURLArray.length > loadingContact) {
            loadNextContact(contactURLArray[loadingContact]);
        }
        else {
            document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
            viewCurrentContact()
            console.log(contactArray);

            

            //Todo: Sort contacts array.
        }
    }
    
    contactRequest.send();
}


