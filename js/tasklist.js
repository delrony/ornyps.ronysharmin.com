window.onload = init;

function init() {
	var button = document.getElementById("addButton");
	button.onclick = handleButtonClick;
	var text = document.getElementById("taskTextInput");
	text.onkeydown = function(event) {
		if (event.keyCode == 13) {
			handleButtonClick();
		}
	}
	
	if (Modernizr.localstorage) {
		loadTasklist("tasklist");
	} else {
		alert("Localstorage is not supported in your browser. All of your added tasks will be available only in this browser session");
	}
}

/**
 * Display the task in the list and store the task in localstorage
 */
function handleButtonClick() {
	var textInput = document.getElementById("taskTextInput");
	var task = textInput.value;
	if (task == "") {
		alert("Please enter a task");
	} else {
		var li = document.createElement("li");
		li.innerHTML = task;

		// Adding delete button
        li.appendChild(getDelImage());
        li.appendChild(getEditImage());

		var ul = document.getElementById("tasklist");
		ul.appendChild(li);
		document.getElementById("taskTextInput").value = "";
		
		if (Modernizr.localstorage) {
			save(task, "todo");
		}
	}
}

/**
 * Get task list from localstorage and load it in the page as list element
 * @param id: id of the ul element
 * 
 * @returns nothing
 */
function loadTasklist(id) {
    var listArray = getSavedList("todo");
    var ul = document.getElementById(id);
    if (listArray != null) {
        for (var i = 0; i < listArray.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = listArray[i];

            // Adding delete button
            li.appendChild(getDelImage());
            li.appendChild(getEditImage());
            ul.appendChild(li);
        }
    }
}

/**
 * Create Delete image node and float it to the right
 * 
 * @returns image node
 */
function getDelImage() {
	var delImg = document.createElement("img");
    delImg.src = '../images/deleteo.png';
    delImg.setAttribute("style", 'float:right;cursor:pointer');
    delImg.title = "Delete";
    delImg.onclick = deleteTask;

    return delImg;
}

/**
 * Delete task from the list and localstorage
 */
function deleteTask(event) {
	var ruSure = confirm("Are you sure to delete the item?");
	if(ruSure) {
		// first we delete the task from view
		var ul = document.getElementById("tasklist");
		// the source of this event is img. so 'this' indicates to img.
		// and its parent is li, which we want to remove.
		// first get the index of li. We will use this index later to delete the task from localstorage.
		var index = Array.prototype.indexOf.call(ul.childNodes, this.parentNode) - 1;
		ul.removeChild(this.parentNode);

		if (Modernizr.localstorage) {
			// removing from localstorage
			var listArray = getSavedList("todo");
			listArray.splice(index, 1);
			saveList("todo", listArray);
		}
	}
}

/**
 * Create Edit image node and float it to the right
 * 
 * @returns image node
 */
function getEditImage() {
	var editImg = document.createElement("img");
    editImg.src = '../images/edito.png';
    editImg.setAttribute("style", 'float:right;cursor:pointer;margin-left:5px;margin-right:5px');
    editImg.title = "Edit";
    editImg.onclick = editTask;

    return editImg;
}

/**
 * Edit task in the list and localstorage
 */
function editTask(event) {
	// get the task and it's index in ul
	var task = this.parentNode.childNodes[0].nodeValue;
	var ul = document.getElementById("tasklist");
	var index = Array.prototype.indexOf.call(ul.childNodes, this.parentNode) - 1;

	// create new li element
	var li = document.createElement("li");

	// create a textfield
	var txtField = document.createElement("input");
	txtField.type = "text";
	txtField.setAttribute("maxlength", "50");
	txtField.value = task;

	li.appendChild(txtField);

	// create a button
	var btn = document.createElement("input");
	btn.type = "button";
	btn.value = "Save";
	btn.onclick = function() {
		// get the task from input text
		var txtNode = this.previousElementSibling;
		var task = txtNode.value;
		// create a new li with input text and button
		var li = document.createElement("li");
		li.innerHTML = task;
		li.appendChild(getDelImage());
		li.appendChild(getEditImage());
		// replace the li with existing li
		ul.replaceChild(li, this.parentNode);
		
		if (Modernizr.localstorage) {
			// update the local storage by using index
			var listArray = getSavedList("todo");
			listArray.splice(index, 1, task);
			saveList("todo", listArray);
		}

	}

	li.appendChild(btn);

	// replace the current li
	ul.replaceChild(li, this.parentNode);
}