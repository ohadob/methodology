$(document).ready(function () {
	$("select:has(option[value=]:first-child)").on('change', function () {
		$(this).toggleClass("empty", $.inArray($(this).val(), ['', null]) >= 0);
	}).trigger('change');

	$.fn.serializeObject = function () {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function () {
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
		$.post("/save", data, function (result) {
			alert(result ? "Thank you!" : "An error occured :( ");
		});
	}

	$("div#form1").append(			// Creating Form div and adding <h2> and <p> paragraph tag in it.
		$("<h3/>").text("Thesis: System for Choosing a Methodology for a Software Project"),
		$("<p/>").text("By filling this form, you will contribute to a database of real software projects, as they were described by a member of the project's team." +
			" The database will be used in order to provide recommandations for the best methodology to use in future projects, based on Machine Learning algorithems. "),
		$("<p/>").text("Please describe a software project you were involved in (14 questions):"),
		$("<br/>"),
		$("<form/>", { action: '#', method: '#', style: "width: 400px" }).append(   // Create <form> tag and appending in html div form1.
			$("<fieldset/>").append(
				$("<legend/>", { text: "Personal Info" }),
				$("<label/>", { text: 'Name' }),
				$("<input/>", { type: 'text', name: 'name', placeholder: 'Your Name' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Email' }),
				$("<input/>", { type: 'text', name: 'email', placeholder: 'Your Email' })),
			$("<br/>"),

			$("<fieldset/>").append(
				$("<legend/>", { text: "Organization" }),
				$("<label/>", { text: 'Organization Size' }),
				$("<select>", { name: 'Organization Size' }).append(
					$("<option/>").val('').text('Please select'),
					$("<option/>").val('<50').text('< 50 members'),
					$("<option/>").val('<100').text('< 100 members'),
					$("<option/>").val('<1000').text('< 1000 members'),
					$("<option/>").val('1000+').text('1000+ members')),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Organization Flexibility' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'orgFlexibility', placeholder: 'The ability of adapting to changes (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Organization Resources' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'orgResources', placeholder: 'Amount of technical resources (1 - 5)' })),
			$("<br/>"),

			$("<fieldset/>").append(
				$("<legend/>", { text: "Project" }),
				$("<label/>", { text: 'Project Duration' }),
				$("<input/>", { type: 'number', name: 'projDuration', placeholder: 'Number of months' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Project Effort' }),
				$("<input/>", { type: 'number', name: 'projEffort', placeholder: 'Number of developers' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Project Risk' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'projRisk', placeholder: 'Level of risk/uncertainty (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Project Quality' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'projQuality', placeholder: 'Time invested per task (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Project Reliability/Criticality' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'projReliability', placeholder: 'Level of tolerance for bugs (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Project Experience' }),
				$("<input/>", { type: 'number', name: 'projExperience', placeholder: 'Total team experience (years)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Project Lifespan' }),
				$("<input/>", { type: 'number', name: 'projLife', placeholder: 'Software life expectancy (years)' })),
			$("<br/>"),
			$("<fieldset/>").append(
				$("<legend/>", { text: "Project Methodology" }),
				$("<select>", { name: 'projMethod' }).append(
					$("<option/>").val('').text('Please select'),
					$("<option/>").val('Waterfall').text('Waterfall'),
					$("<option/>").val('Prototype').text('Prototype'),
					$("<option/>").val('Agile').text('Agile'),
					$("<option/>").val('Scrum').text('Scrum'),
					$("<option/>").val('Hybrid').text('Hybrid'),
					$("<option/>").val('Rapid').text('Rapid'),
					$("<option/>").val('Spiral').text('Spiral'),
					$("<option/>").val('Extreme Programming').text('Extreme Programming'),
					$("<option/>").val('Feature Driven').text('Feature Driven'),
					$("<option/>").val('Lean').text('Lean'),
					$("<option/>").val('Other').text('Other')),
				$("<br/>"), $("<br/>"),
				$("<input/>", { type: 'text', name: 'projMethodOther', placeholder: 'Other:' })),
			$("<br/>"),
			$("<fieldset/>").append(
				$("<legend/>", { text: "Measurement of project success" }),
				$("<label/>", { text: 'Schedule' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'mesSchedule ', placeholder: 'How was the deadline meet (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Budget' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'mesBudget', placeholder: 'Plan vs Bill (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Conteמt' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'mesConteמt', placeholder: 'Commitments vs delivery (1 - 5)' }),
				$("<br/>"), $("<br/>"),
				$("<label/>", { text: 'Customer Satisfaction' }),
				$("<input/>", { type: 'number', min: "1", max: "5", name: 'mesCustomer', placeholder: 'Based on positive/negative feedback (1 - 5)' })),
			$("<br/>"),
			$("<input/>", { type: 'submit', id: 'submit', value: 'Submit' })
		).submit(saveData));
});