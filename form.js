$(document).ready(function(){
	function saveData(a, b) {

		alert(JSON.stringify($('form').serializeArray()));
    var data = { name: $("#vname").val() };
    alert(JSON.stringify(data));
    $.post("http://localhost:8181/save", data, function(result) {
      alert(result ? "Thank you!" : "An error occured :( ");
    });
	}

	$("div#form1").append(			// Creating Form div and adding <h2> and <p> paragraph tag in it.
		$("<h3/>").text("Project Form"),
		$("<p/>").text("Please fill it in the name of science!"),
 
        $("<form/>",{action:'#', method:'#'}).append(   // Create <form> tag and appending in html div form1.
		$("<input/>", {type:'text', id:'vname', name:'name', placeholder:'Your Name'}),  // Creating input element with attribute
		$("<input/>", {type:'text', id:'vemail', name:'email', placeholder:'Your Email'}),
		$("<textarea/>", {rows:'5px', cols:'27px', type:'text', id:'vmsg', name:'msg', placeholder:'Message'}),
		$("<br/>"),
		$("<input/>", {type:'submit', id:'submit', value:'Submit'})
		).submit(saveData)
	  )

});















