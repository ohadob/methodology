$(document).ready(function(){
  $.fn.serializeObject = function()
  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || null);
      } else {
        o[this.name] = this.value || null;
      }
    });
    return o;
  };

	function saveData(a, b) {
		var data = $('form').serializeObject();
    alert(JSON.stringify(data));
    $.post("/save", data, function(result) {
      alert(result ? "Thank you!" : "An error occured :( ");
    });
	}

	$("div#form1").append(			// Creating Form div and adding <h2> and <p> paragraph tag in it.
		$("<h3/>").text("Thank you for participating in my project!"),
		$("<p/>").text("Please describe a software project you were involved in:"),
    $("<br/>"),
    $("<form/>",{action:'#', method:'#', style: "width: 400px"}).append(   // Create <form> tag and appending in html div form1.
			$("<fieldset/>").append(
				$("<legend/>", {text: "Personal Info"}),
				$("<input/>", {type:'text', name:'name', placeholder:'Your Name'}), // Creating input element with attribute
				$("<br/>"), $("<br/>"),
				$("<input/>", {type:'text', name:'email', placeholder:'Your Email'})),
			$("<br/>"), $("<br/>"),

			$("<fieldset/>").append(
        $("<legend/>", {text: "Organization"}),
        $("<input/>", {type:'text', name:'orgSize', placeholder:'size (number of people)'}), // Creating input element with attribute
				$("<br/>"), $("<br/>")),
			$("<input/>", {type:'submit', id:'submit', value:'Submit'})
		).submit(saveData))

});















