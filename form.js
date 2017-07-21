$(document).ready(function(){
  $("select:has(option[value=]:first-child)").on('change', function() {
    $(this).toggleClass("empty", $.inArray($(this).val(), ['', null]) >= 0);
  }).trigger('change');

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
    $.post("/save", data, function(result) {
      alert(result ? "Thank you!" : "An error occured :( ");
    });
	}

	$("div#form1").append(			// Creating Form div and adding <h2> and <p> paragraph tag in it.
		$("<h3/>").text("Thank you for participating in my study!"),
		$("<p/>").text("Please describe a software project you were involved in:"),
    $("<br/>"),
    $("<form/>",{action:'#', method:'#', style: "width: 400px"}).append(   // Create <form> tag and appending in html div form1.
			$("<fieldset/>").append(
				$("<legend/>", {text: "Personal Info"}),
				$("<input/>", {type:'text', name:'name', placeholder:'Your Name'}), 
				$("<br/>"), $("<br/>"),
				$("<input/>", {type:'text', name:'email', placeholder:'Your Email'})),
			$("<br/>"),

			$("<fieldset/>").append(
				$("<legend/>", {text: "Organization"}),
				$("<input/>", {type:'number', name:'orgSize', placeholder:'Size (number of people)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'orgFlexibility', placeholder:'Flexibility- adapting to changes (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'orgResources', placeholder:'Amount of technical resources (rate 1 - 10)'})),
			$("<br/>"),
			
			$("<fieldset/>").append(
				$("<legend/>", {text: "Project"}),
				$("<input/>", {type:'number', name:'projDuration', placeholder:'Duration (number of months)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projEffort', placeholder:'Effort (number of developers)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projScope', placeholder:'Scope (number of features developed)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projComplexity', placeholder:'Complexity (rate 1 - 10)'}),
				$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projRisk', placeholder:'Risk/uncertainty (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projQuality', placeholder:'Quality- time invested per task (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projReliability', placeholder:'Reliability/criticality (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projExperience', placeholder:'Total team experience (years)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'projLife', placeholder:'Software life expectancy (years)'})),
						$("<br/>"),
      $("<fieldset/>").append(
        $("<legend/>", {text: "Project Methodology"}),
				$("<select>", {name: 'projMethod'}).append(
          $("<option/>").val('').text('Please select'),
					$("<option/>").val('Waterfall').text('Waterfall'),
          $("<option/>").val('Prototype').text('Prototype'),
          $("<option/>").val('Agile').text('Agile'),
          $("<option/>").val('Scrum').text('Scrum'),
          $("<option/>").val('Rapid').text('Rapid'),
          $("<option/>").val('Spiral').text('Spiral'),
          $("<option/>").val('Extreme Programming').text('Extreme Programming'),
          $("<option/>").val('Feature Driven').text('Feature Driven'),
          $("<option/>").val('Lean').text('Lean'),
			    $("<option/>").val('Other').text('Other'))),
			$("<br/>"),
			$("<fieldset/>").append(
				$("<legend/>", {text: "Measurement of project success"}),
				$("<input/>", {type:'number', name:'mesSchedule ', placeholder:'Schedule/deadline (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'mesBudget', placeholder:'Budget (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'mesContnet', placeholder:'Content/capacity (rate 1 - 10)'}),
						$("<br/>"), $("<br/>"),
				$("<input/>", {type:'number', name:'mesCustomer', placeholder:'Customer satisfaction (rate 1 - 10)'})),
			$("<br/>"),
			$("<input/>", {type:'submit', id:'submit', value:'Submit'})
			).submit(saveData));
});















