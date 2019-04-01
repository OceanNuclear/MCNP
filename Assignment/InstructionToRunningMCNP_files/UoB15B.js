// ====================================================================================================
//
// Generic top-level script for University of Birmingham's Canvas implementation. This script is
// combined with the corresponding CSS file, jQuery and jQuery.UI will carry out a number of tasks.
//
//		Hides forgot-password link on login page
// 		Add FindIt@Bham link to Help Corner
//		Add footer with link to Gallery and Panopto warning when not using canvas.bham.ac.uk
//		Change prompts for "email address" to "username"
// 		Enables UoB Components: tables, boxes, layouts, widgets and commands.
//		Adds option for teachers to download course analytics
//		Adds Google viewer previews to compatible file links
//		Adds Google Analytics with custom dimensions for course, sub-account, term and (role) type ID
//		Adds custom menu items to the global navigation
//
// Filename: UoB15.js
// Version: 015
// Date: 12/12/2018
// Amended by: Steve Watts/Nathan Johnson/Fred O’Loughlin
//
// Amendments: Fixed contrast issue in Calendar/Scheduler
//
// ====================================================================================================



$(function() {
	// ================================================================================
	// Declare veriables that are used for multiple tasks.
	// --------------------------------------------------------------------------------
	var i;
	var iUoBSetNum = 0;


	var aTableStyles = [
		{group: "Table",	label: "Normal",		class: "borderless", 	category: 0},
		{group: "Table",	label: "Thin borders",	class: "thinborder", 	category: 0},
		{group: "Table",	label: "Striped",		class: "striped", 		category: 1},
		{group: "Table",	label: "Sortable",		class: "sortable", 		category: 1},

		{group: "Box",		label: "Plain", 		class: "box",			category: 1},
		{group: "Box",		label: "Info",			class: "info",			category: 1},
		{group: "Box",		label: "Tip",			class: "tip",			category: 1},
		{group: "Box",		label: "Warning",		class: "warning",		category: 1},
		{group: "Box",		label: "Question",		class: "question",		category: 1},
		{group: "Box",		label: "Quote",			class: "quote",			category: 1},
		{group: "Box",		label: "Quote 6699*",	class: "quote6699",		category: 2},
		{group: "Box",		label: "Header",		class: "header",		category: 1},

		{group: "Layout",	label: "Accordion",		class: "accordion",		category: 1},
		{group: "Layout",	label: "Accordion EA",	class: "accordion-ea",	category: 1},
		{group: "Layout",	label: "Tabs",			class: "tabs",			category: 1},
		{group: "Layout",	label: "Parallax*",		class: "parallax",		category: 2},
		{group: "Layout",	label: "Columns*",		class: "columns",		category: 2},

		{group: "Widget",	label: "Reveal",		class: "reveal",		category: 1},
		{group: "Widget",	label: "RegExp",		class: "regexp",		category: 1},
		{group: "Widget",	label: "MCQ",			class: "mcq",			category: 1},
		{group: "Widget",	label: "Button*",		class: "button",		category: 2},
		{group: "Widget",	label: "QR Code*",		class: "qrcode",		category: 2},
		{group: "Widget",	label: "Rating*",		class: "rating",		category: 2},

		{group: "Command",	label: "Style Header*",		class: "stylehead",			category: 2},
		{group: "Command",	label: "Hide Header*",		class: "hidehead",			category: 2},
		{group: "Command",	label: "Hide Left Side*",	class: "hideleftside",		category: 2},
		{group: "Command",	label: "Hide Right Side*",	class: "hiderightside",		category: 2}
	];

	var aTableStylesOld = ["accordion", "tabs", "reveal", "regexp", "tip", "info", "warning", "header", "question", "quote", "box"];


	// ================================================================================
	// Amend document's CSS to hide all tables with uob- styles.
	// --------------------------------------------------------------------------------
	$(function() {
		var aTableSelectors = [];
		$.each(aTableStyles, function(index, value) { if (index > 0 && value.group != "Table") aTableSelectors.push("table.uob-" + value.class); });
		var strTableSelectors = aTableSelectors.join(", ");
		aTableSelectors = undefined;
		uobSetDocumentStyle(document, strTableSelectors, "display: none;");
	});


	// ================================================================================
	// Add UoB footer container with space for UoB marque and message.
	// --------------------------------------------------------------------------------

	// If no footer exists, add footer to end of wrapper.
	if ($("#footer").length == 0) $("#wrapper").append("<footer role='contentinfo' id='footer' class='ic-app-footer'></footer>");

	// Add UoB footer container to the footer.
	$("#footer").html( "<div id='uob_footer_container'><div id='uob_footer_marque' /><div id='uob_footer_unit_container'><div id='uob_footer_unit'></div></div><div id='uob_footer_message'></div></div>" );

	// Add padding where div height of left side is greater than that of the main.
	var uobPositionFooter = function() {
		var iHeightLeftSide = $("#left-side").outerHeight();
		var iHeightMain = $("#main").outerHeight();

		if (iHeightMain && iHeightLeftSide > iHeightMain)
			$("#footer").animate({marginTop: "" + (iHeightLeftSide - iHeightMain) + "px"});
		else
			$("#footer").animate({marginTop: "0px"});
	}

	onElementRendered("#left-side", function($node) {
		onElementRendered("#main", function($node) {
			uobPositionFooter();
			setInterval(uobPositionFooter, 700);
		});
	});


	// ================================================================================
	// If the current user is an administrator then add the uob-admin class to the body
	// of the document so that the CSS will display the option to show the "Report a
	// Problem" Zendesk option in the Help menu.
	// --------------------------------------------------------------------------------

	hasAnyRole("admin", function(bAdmin) {
		if (bAdmin)
			$("body").addClass("uob-admin");
	});


	// ================================================================================
	// Restore undisplayed admin options.
	// --------------------------------------------------------------------------------
	hasAnyRole("root_admin", function(bRootAdmin) {
		if (bRootAdmin) {
			$("#right-side #start_new_course, #right-side a.add_new_course").css("display", "block");
			$("#right-side a.add_course_link, #right-side a.add_user_link, #right-side a.delete_course_link, #right-side a.copy_course_link, #right-side a.reset_course_content_button").css("display", "block");
			$("a.Button:contains('Delete this Course')").css("background-color", "#ffbb00");
			$("._3K-H7mx.d4oNRdy button._3_WF-Hw._3CSmEMx._3OWFqcy._1o_L_Fo").css("display", "block");
			$("._1OfGji1._2fqbcnO button._3H7s5be._1uixGS7.exkEYEQ._2FgdBgl").css("display", "block");
			$("._3c8qmvC._2b4NfpY button._16dxlnN._2A82x0p._1EYI5q2._1-Y3qxx").css("display", "block");
			$(".GridCol__lnAKmn-root.GridCol__lnAKmn-startAtMedium button.Button__dUxGkD-width--auto.Button__dUxGkD-medium").css("display", "block");
			$("._3K-H7mx.d4oNRdy button._3_WF-Hw._3CSmEMx._3OWFqcy._1o_L_Fo").css("background-color", "#ffbb00");
			$("._1OfGji1._2fqbcnO button._3H7s5be._1uixGS7.exkEYEQ._2FgdBgl").css("background-color", "#ffbb00");
			$("._3c8qmvC._2b4NfpY button._16dxlnN._2A82x0p._1EYI5q2._1-Y3qxx").css("background-color", "#ffbb00");
			$(".GridCol__lnAKmn-root.GridCol__lnAKmn-startAtMedium button.Button__dUxGkD-width--auto.Button__dUxGkD-medium").css("background-color", "#ffbb00");
		} else {
			$("a.Button:contains('Delete this Course')").css("display", "none");
		}
	});


	// ================================================================================
	// Change prompts for "email address" to "username" in People and self-enrol page.
	// --------------------------------------------------------------------------------

	// Change prompts in People.
	onPage(/\/courses\/\d+\/users/, function() {
		onElementRendered("a#addUsers", function($addUsers) {
			$addUsers.on("click", function() {
				$("#create-users-step-1 > p:first").text("Type or paste a list of usernames below:");
				$("#create-users-step-1 #user_list_textarea").attr("placeholder","For example bloggsj, abc123, pqr456, xyz789");
			});
		});
	});

	// Change prompts on self-enrolment page.
	onPage(/\/enroll\/[A-Z0-9]+$/, function() {
		onElementRendered("#modal-box", function($modalBox) {
			$("#modal-box p:contains('enter your email')").text("Please enter your University of Birmingham username and password:");
			$("#modal-box label[for=student_email]").text("Username");
		});
	});


	// ================================================================================
	// Enable MathJax.
	// --------------------------------------------------------------------------------

	//uobEmbedJavaScript("https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
	uobEmbedJavaScript("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML");


	// ================================================================================
	// Hide Mute/Unmute assignment button in the SpeedGrader.
	// --------------------------------------------------------------------------------

	onPage(/^\/(courses)\/\d+\/gradebook\/speed_grader$/, function() {
		$("#mute_link").hide();
	});


	// ================================================================================
	// Apply styling for UoB components.
	// --------------------------------------------------------------------------------

	onPage(/^\/(courses|groups)\/\d+/, function() {

		// Determine page type
		var strPageType = "";
		if ($("body.pages").length == 1) { strPageType = "PAGES"; }
		if ($("body.syllabus").length == 1) { strPageType = "SYLLABUS"; }
		onPage(/^\/courses\/\d+\/pages\/[a-zA-Z0-9-]+\/revisions$/, function() { strPageType = "REVISIONS"; });
		onPage(/^\/courses\/\d+\/quizzes\/\d+\/edit$/, function() { strPageType = "QUIZZES-EDIT"; });
		onPage(/^\/(courses|groups)\/.*\/discussion_topics\/\d+$/, function() { strPageType = "DISCUSSION-TOPICS"; });

		// Add components for standard user content
		onElementRendered("div.user_content.enhanced, div.show-content.enhanced", function($content){
			uobAddComponents("div.user_content.enhanced, div.show-content.enhanced");
		});

		// Add components for special cases
		switch (strPageType) {

			case "REVISIONS":			// Apply styling for page revision history
				onElementRendered("article.show-content.user_content.enhanced header + *", function($content){
					uobAddComponents("article.show-content.user_content.enhanced");
				});

				$("#content").on("click", "button.revision-details", function() {
					setTimeout(function() {
						onElementRendered("article.show-content.user_content.enhanced", function($content){
							uobAddComponents("article.show-content.user_content.enhanced");
						});
					}, 2500);
				});

				break;

			case "SYLLABUS":			// Apply styling when syllabus is updated
				$("#content").on("click", "button.btn-primary", function() {
					setTimeout(function() {
						onElementRendered("#course_syllabus.user_content.enhanced", function($content){
							uobAddComponents("#course_syllabus.user_content.enhanced");
						});
					}, 2500);
				});

				break;

			case "QUIZZES-EDIT":		// Apply styling when "Questions" tab is selected in quiz editor
				$("#quiz_tabs").on("tabsactivate", function(event, ui) {
					if (ui.newTab.parent().parent().hasClass("uob-tabs")) { return(true); }

					onElementRendered("div.question_text.user_content.enhanced", function(){
						uobAddComponents("div.question_text.user_content.enhanced");
					});

					return(true);
				});

				break;

			case "PAGES":				// Apply styling when pages are published and unpublished
				$("#content").on("mouseup", ".publish-button", function(){
					$("div.user_content.enhanced, div.show-content.enhanced").removeClass("enhanced");

					onElementRendered("div.user_content.enhanced, div.show-content.enhanced", function($content){
						uobAddComponents("div.user_content.enhanced, div.show-content.enhanced")
					});
				});

				break;

			case "DISCUSSION-TOPICS":	// Apply styling when searching in discussion topics
				var MutationObserver = MutationObserver || window.MutationObserver || window.WebKitMutationObserver;

				if (MutationObserver) {
					var observer = new MutationObserver(function(mutations, observer) {
						observer.takeRecords();
						uobAddComponents("#filterResults");
						observer.takeRecords();
					});

					observer.observe(document.getElementById("filterResults"), {
						childList: true,
						subtree: true
					});
				}

				$("#content").on("mouseup", ".ui-menu-item", function(){
					if ($(this).find("a[data-event='edit']").length == 1) {
						var $node = $(this).parent().closest("li").find("div.message.user_content.enhanced");
						$node.removeClass("uob-components-loaded");
					}

					return true;
				});

				break;

		}

		// Apply styling when CEPLER data page is loaded
		onPage(/^\/courses\/.*\/pages\/uob-cepler/, function() {
			onElementRendered("#content p", function(){
				$("#content p").hide();
			});
		});

	});


	// ================================================================================
	// Enable UoB component functions when tinyMCE editor is available.
	// --------------------------------------------------------------------------------

	onTinyMCE(function() {

		// Initialise global flags.
		var bClickEventsInitialised = false;

		// Prepare list of UoB component's table selectors.
		var aTableSelectors = [];
		$.each(aTableStyles, function(index, value) { if (index > 0) aTableSelectors.push(".mce-item-table.uob-" + value.class); });
		var strTableSelectors = aTableSelectors.join(", ");
		aTableSelectors = undefined;


		// Function to initialise new editors.
		function initNewEditors() {
			if(!bClickEventsInitialised) {
				// Trap clicks on table menu button
				$(top.document.body).on("click", "div[aria-label='Table']", function(e) {
					// Initialise editor menu
					initEditorMenu();

					// Identify current editor and ensure that it has the focus
					var uobTinyMCE = getTinyMCE();
					var ed = uobTinyMCE.activeEditor;
					var edID = uobTinyMCE.activeEditor.id;
					var currentTable = uobTinyMCE.activeEditor.dom.getParent(ed.selection.getNode(), "table");

					// Set visibility of UoB components' menu option
					var iMenuID = $(this).attr("uobMenuID");

					if (currentTable == null) {
						//$("#uobMenu" + iMenuID).addClass("mce-disabled").attr("aria-disabled", "true");
						$("#uobMenu").addClass("mce-disabled").attr("aria-disabled", "true");
					} else {
						//$("#uobMenu" + iMenuID).removeClass("mce-disabled").attr("aria-disabled", "false");
						$("#uobMenu").removeClass("mce-disabled").attr("aria-disabled", "false");
					}
				});

				// Trap clicks on UoB component menu item
				$(top.document.body).on("click", "div.uob-menu-class[uob-menu-id]", function(e) {
					displayTableDialog();
					return true;
				});

				bClickEventsInitialised = true;
			}

			var iNumInitialised = 0;

			setTimeout(function() {
				var uobTinyMCE = getTinyMCE();

				if (uobTinyMCE) {
					$.each(uobTinyMCE.editors, function(index, ed) {
						if (ed.dom.doc.body.uobInitialised != true) {
							// Set styles for UoB Component tables
							uobSetDocumentStyle(ed.dom.doc, strTableSelectors, "border: 1px solid #ad393a;");

							// Set initialised flag
							ed.dom.doc.body.uobInitialised = true;
							iNumInitialised++;
						}
					});
				}
			}, 500);

			return(iNumInitialised);
		}


		// Initialise UoB Component menu option (single menu is shared between editors)
		function initEditorMenu() {
			var $menu = $("span.mce-text:contains('Delete table')").parent().parent().filter(function(index) {
				return $(this).has("div[uob-menu-id]").length === 0;
			});

			$menu.find(".mce-text:contains('Delete table')").parent()
			.after('<div id="uobMenu" uob-menu-id="true" class="uob-menu-class mce-menu-item mce-menu-item-normal mce-stack-layout-item" tabindex="-1" role="menuitem" aria-disabled="false"><i class="mce-ico mce-i-none"></i>&nbsp;<span class="mce-text">UoB Component</span></div>')
			.after('<div class="mce-menu-item mce-menu-item-sep mce-menu-item-normal mce-stack-layout-item"></div>');

			return(true);
		}


		// Initialise editor for pages.
		onPage(/\/courses\/\d+\/pages\/[a-zA-Z0-9-]+\/edit$/, function() {
			onTinyMCEEditor(function() {
				initNewEditors();
			});
		});

		// Initialise editor for new pages.
		onPage(/\/courses\/\d+\/pages$/, function() {
			onElementRendered(".new_page", function() {
				$(top.document.body).on("click", ".new_page", function(e) {
					initNewEditors();
				});
			});
		});

		// Initialise editor for syllabus.
		onPage(/\/courses\/\d+/, function() {
			$(".edit_syllabus_link").on("click", function(e) {
				initNewEditors();
			});
		});

		// Initialise editor for quiz edit.
		onPage(/\/courses\/\d+\/quizzes\/\d+\/edit$/, function() {
			onTinyMCEEditor(function() {
				initNewEditors();
			});

			$(".edit_question_link").on("click", function(e) {
				initNewEditors();
			});
		});


		// Initialise editor for assignments.
		onPage(/\/courses\/\d+\/assignments\/new$/, function() {
			onTinyMCEEditor(function() {
				initNewEditors();
			});
		});

		onPage(/\/courses\/\d+\/assignments\/\d+\/edit/, function() {
			onTinyMCEEditor(function() {
				initNewEditors();
			});
		});


		// Re-render UoB components for discussions/announcements and course syllabus.
		tinyMCE.on("RemoveEditor", function(e) {

			onPage(/^\/(courses|groups)\/.*discussion_topics/, function() {
				setTimeout(function() {
					onElementRendered("div.message.user_content.enhanced:not(.uob-components-loaded)", function() {
						uobAddComponents("div.message.user_content.enhanced:not(.uob-components-loaded)");
					});
				}, 2500);
			});

			onPage(/^\/courses\/.*\/assignments\/syllabus$/, function() {
				$("#course_syllabus").removeClass("enhanced");

				onElementRemoved("#uob-components-loaded", function() {
					onElementRendered("#course_syllabus.user_content.enhanced, #course_syllabus.show-content.enhanced", function() {
						uobAddComponents("#course_syllabus");
					});
				});
			});

		});

		// Re-render UoB components for quizzes.
		onPage(/^\/courses\/.*\/quizzes\/.*\/edit$/, function() {
			$("#questions").on("click", "button.submit_button.btn-primary", function() {
				setTimeout(uobAddComponents, 2500, "#questions .text");
			});
		});

	});


	// ================================================================================
	// Add option for Course Analytics download.
	// --------------------------------------------------------------------------------

	onPage(/^\/courses\/\d+\/analytics$/, function() {
		onElementRendered("#students", function($students) {

			var $nodeA = $(document.createElement("a"))
				.attr("href", "")
				.attr("id", "link")
				.attr("download", "analytics_download.csv")
				.text("");

			var $nodeB = $(document.createElement("button"))
				.attr("id", "download")
				.attr("onclick", "uobExportAnalytics()")
				.text("Download");

			$students.append($nodeA);
			$students.append($nodeB);
		});
	});


	// ================================================================================
	// Add option for the export of event attendance.
	// --------------------------------------------------------------------------------

	onPage(/^\/courses\/\d+\/quizzes\/\d+$/, function() {
		var strHref = window.location.pathname || "";
		var courseID = strHref.split('/')[2] || 0;
		var quizID = strHref.split('/')[4] || 0;

		var apiCommand = "/api/v1/courses/" + courseID + "/quizzes/" + quizID;

		onCanvasObject(apiCommand, function(oQuiz) {
			apiCommand = "/api/v1/courses/" + courseID + "/assignment_groups/" + oQuiz.assignment_group_id;

			onCanvasObject(apiCommand, function(oAssignmentGroup) {
				if (oAssignmentGroup.name == "Attendance") {
					onElementRendered("#sidebar_content ul:contains('SpeedGrader')", function($sidebar_list) {
						$sidebar_list.append('<li><a id="link"></a><span id="uobDownloadAttendance" onclick="uobExportAttendance()" onmouseover="$(this).css({\'color\': \'#008EE2\', \'text-decoration\': \'underline\'});" onmouseout="$(this).css({\'color\': \'#2D3B45\', \'text-decoration\': \'none\'});" ><i class="icon-export"><span class="screenreader-only">Export Attendance</span></i> Export Attendance </span></li>');
					});
				}
			});
		});
	});


	// ================================================================================
	// Google analytics
	// --------------------------------------------------------------------------------

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	// Get hostname and tracking code
	var strHostname = window.location.hostname.toLowerCase();
	var trackingCode = "";

	if ((strHostname == "canvas.bham.ac.uk") || (strHostname == "birmingham.instructure.com")) {
		trackingCode = "UA-45967031-1";		// Production environment
	} else if (strHostname == "birmingham.test.instructure.com") {
		trackingCode = 'UA-57581710-1';		// Test environment
	}

	// Create GA tracker.
	if (trackingCode)
		ga('create', trackingCode, 'auto');

	// Declare dererred variables
	var courseID = 0;
	var accountID = 0;
	var termID = 0;
	var typeID = 0;

	var def1 = new $.Deferred();
	var def2 = new $.Deferred();

	// Send GA pageview hit with dimensions for course, sub-account, term and (role) type.
	$.when(def1, def2).done(function () {
		uobSetPageFooter(accountID);
		uobLoadGallery(courseID);

		if (trackingCode) {
			if (courseID) ga('set', 'dimension2', courseID);
			if (accountID) ga('set', 'dimension1', accountID);
			if (termID) ga('set', 'dimension4', termID);
			if (typeID) ga('set', 'dimension5', typeID);
			ga('send', 'pageview');
		}
	});

	onPage(/\/courses\/\d+.*/, function() {
		var strHref = window.location.pathname || "";
		courseID = strHref.split('/')[2] || 0;
		var userID = ENV.current_user_id || 0;

		// Determine sub-account and term IDs for current course; then resolve def1 deferred object.
		if (courseID && ENV.current_user_id != null) {
			var strCommand = "/api/v1/courses/" + courseID + "?include[]=term";

			$.get(strCommand)
				.done( function(_d) {
					accountID = _d.account_id || 0;
					termID = _d.term.id || 0;
					def1.resolve();
				})
				.fail( function(_d) {
					def1.resolve();
				});
		} else {
			def1.resolve();
		}

		// Determine (role) type of current user in current course; then resolve def2 deferred object.
		if (courseID && userID && ENV.current_user_id != null) {
			var strCommand = "/api/v1/courses/" + courseID + "/enrollments?user_id=" + userID;

			$.get(strCommand)
				.done(function(_d) {
					if (_d.length) typeID = _d[0].type || 0;
					def2.resolve();
				})
				.fail( function(_d) {
					def2.resolve();
				});
		} else {
			def2.resolve();
		}
	}, function() {
		// Resolve def1 and def2 deferred objects if page is not part of a course.
		def1.resolve();
		def2.resolve();
	});


	// ================================================================================
	// --------------------------------------------------------------------------------








	// ================================================================================
	// UoB table editor dialog
	// ================================================================================

	function displayTableDialog() {

		// Set curent editor's focus and find selected table
		var uobTinyMCE = getTinyMCE();
		if (uobTinyMCE == null) { return(false) };
		var ed = uobTinyMCE.activeEditor;
		var edID = uobTinyMCE.activeEditor.id;
		var currentTable = ed.dom.getParent(ed.selection.getNode(), "table");
		uobTinyMCE.activeEditor.focus(false);

		// Exit function if no table is selected or no editor found.
		if (!currentTable || !ed) return;

		// Get UoB component class for selected table
		var possibleClasses = [];
		$.each(aTableStyles, function(index, value) { possibleClasses.push(value.class); });

		var currentClass = possibleClasses[0]; // "borderless"

		$.each(aTableStyles, function(index, value) {
			if ($(currentTable).hasClass("uob-" + value.class)) {
				currentClass = value.class;
				return false;
			}
		});

		// Build listbox options
		var bSU = (ENV.current_user_id.search(/^(991|548|1183|3236|6048|3963)$/) == 0);
		var bCal = location.pathname.match(/\/(courses|users)\/.*\/calendar_events/);
		var lbOptions = [];

		for (var i = 0; i < aTableStyles.length; i++) {
			if (aTableStyles[i].category == 0 || (!bCal && (aTableStyles[i].category == 1)) || bSU) {
				var rec = {};
				rec.text = aTableStyles[i].group + " - " + aTableStyles[i].label;
				rec.value = aTableStyles[i].class;
				lbOptions.push(rec);
			}
		}

		// Open dialog
		ed.windowManager.open({
			title: 'UoB Component',
			width: 380,
			height: 200,
			style: 'background-color: #fffff0;',
			body: [{
				type: 'label',
				name: 'uobComponentIntroduction',
				multiline: true,
				style: 'height: 110px;',
				close_previous: true,
				text: "",
				onPostRender : function() {
					this.getEl().innerHTML = "UoB components are page elements defined by<br/>" +
					"tables. For example, if you enter some text in a<br/>" +
					"1 x 1 table and apply the 'Box - Tip' component<br/>" +
					"type, the text will be displayed in a 'tip' box<br/>" +
					"when the page is saved. Please see the Canvas<br/>" +
					"Gallery for further information.";
				}
			},
			{
				type: 'listbox',
				name: 'uobComponentType',
				label: 'Component type:',
				values: lbOptions,
				value: currentClass
			}],
			onsubmit: function(v) {
				var newClass = v.data.uobComponentType;
				$(currentTable).removeClass("uob-" + possibleClasses.join(" uob-"));
				$(currentTable).addClass("uob-" + newClass);

				$(currentTable).attr("name", "UoB " + newClass + " table");
			}
		}, {
			uobClass: currentClass,
			currentTable: currentTable
		});

	}


	// ================================================================================
	// UoB Sortable table - based on script from http://www.webtoolkit.info/
	// ================================================================================

	function SortableTable(tableEl) {

		this.tbody = tableEl.getElementsByTagName('tbody');
		this.thead = tableEl.getElementsByTagName('thead');
		this.tfoot = tableEl.getElementsByTagName('tfoot');

		this.getInnerText = function (el) {
			if (typeof(el.textContent) != 'undefined') return el.textContent;
			if (typeof(el.innerText) != 'undefined') return el.innerText;
			if (typeof(el.innerHTML) == 'string') return el.innerHTML.replace(/<[^<>]+>/g,'');
		}

		this.getParent = function (el, pTagName) {
			if (el == null) return null;
			else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())
				return el;
			else
				return this.getParent(el.parentNode, pTagName);
		}

		this.sort = function (cell) {

		    var column = cell.cellIndex;
		    var itm = this.getInnerText(this.tbody[0].rows[0].cells[column]);
			var sortfn = this.sortCaseInsensitive;

			// By default, te format to be used for the sort is based on the content in the first row.
			if (itm.match(/\d\d\/\d\d\/\d\d\d\d/)) sortfn = this.sortDate; // date format dd/mm/yyyy
			if (itm.match(/\d\d\/\d\d\/\d\d\d\d.\d\d\:\d\d/)) sortfn = this.sortDateTime; // date-time format dd/mm/yyyy hh:mm
			if (itm.replace(/^\s+|\s+$/g,"").match(/^[\d\.]+$/)) sortfn = this.sortNumeric;

			// Use column header's class to determine the format to be used for the sort.
			var columnHeadClass = this.thead[0].rows[0].cells[column].className;
			if (columnHeadClass.match(/sortText/g)) sortfn = this.sortCaseInsensitive;	// Default is string format
			if (columnHeadClass.match(/sortNumber/g)) sortfn = this.sortNumeric;		// numeric format
			if (columnHeadClass.match(/sortDate/g)) sortfn = this.sortDate;				// date format dd/mm/yyyy
			if (columnHeadClass.match(/sortDateTime/g)) sortfn = this.sortDateTime;		// date-time format dd/mm/yyyy hh:mm
			if (columnHeadClass.match(/sortNone/g)) sortfn = this.sortNone;				// maintain existing order

		    // Create array of data to be sorted.
		    var newRows = new Array();

		    for (var j = 0; j < this.tbody[0].rows.length; j++) {
		    	var oRow = new Object();
		    	oRow.content = this.tbody[0].rows[j];
		    	oRow.index = j;
				newRows[j] = oRow;
			}

			// Sort the data in assending order unless the same column was used for the previous sort, in which case reverse the sort order.
			var lastSortColumnIndex = this.sortColumnIndex;
			this.sortColumnIndex = column;

		 	if (lastSortColumnIndex != this.sortColumnIndex)
				newRows.sort(sortfn);
			else
				newRows.reverse();

			// Overwright table body with the sorted data.
			for (var i = 0; i < newRows.length; i++) {
				this.tbody[0].appendChild(newRows[i].content);
			}
		}

		this.sortCaseInsensitive = function(a,b) {
			aa = thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]).toLowerCase();
			bb = thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]).toLowerCase();
			if (aa==bb) return a.index - b.index;
			if (aa<bb) return -1;
			return 1;
		}

		this.sortDate = function(a,b) {
			aa = thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]);
			bb = thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]);
			date1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
			date2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
			if (date1==date2) return a.index - b.index;
			if (date1<date2) return -1;
			return 1;
		}

		this.sortDateTime = function(a,b) {
			aa = thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]);
			bb = thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]);
			date1 = "x" + aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2)+aa.substr(11,2)+aa.substr(14,2);
			date2 = "x" + bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2)+bb.substr(11,2)+bb.substr(14,2);
			if (date1==date2) return a.index - b.index;
			if (date1<date2) return -1;
			return 1;
		}

		this.sortNumeric = function(a,b) {
			aa = parseFloat(thisObject.getInnerText(a.content.cells[thisObject.sortColumnIndex]));
			if (isNaN(aa)) aa = 0;
			bb = parseFloat(thisObject.getInnerText(b.content.cells[thisObject.sortColumnIndex]));
			if (isNaN(bb)) bb = 0;
			if (aa==bb) return a.index - b.index;
			return aa-bb;
		}

		this.sortNone = function(a,b) {
			return 0;
		}

		// define variables
		var thisObject = this;
		var sortSection = this.thead;

		// constructor actions
		if (!(this.tbody && this.tbody[0].rows && this.tbody[0].rows.length > 0)) return;

		if (sortSection && sortSection[0].rows && sortSection[0].rows.length > 0) {
			var sortRow = sortSection[0].rows[0];
		} else {
			return;
		}

		for (var i = 0; i < sortRow.cells.length; i++) {
			sortRow.cells[i].sTable = this;
			sortRow.cells[i].onclick = function () {
				this.sTable.sort(this);
				return false;
			}
		}

	}


	// ================================================================================
	// uobAddComponents
	//
	// This function will enable the following UoB components in the specified context:
	//		boxes (tip, info, warning, header, question, quote, quote6699, box)
	//		tables (borderless, thinborder, striped, sortable)
	//		widgets (accordion, tabs, reveal, regexp, mcq)
	//		misc (previews)
	// ================================================================================

	function uobAddComponents(strContent) {

		// ================================================================================
		// Initialise function
		// --------------------------------------------------------------------------------

		// Initialise $content
		var $content;

		if (strContent.length > 0) {
			$content = $(strContent);
		} else {
			$content = $("#content");
		}

		// Declare key variables
		var $table;


		// ================================================================================
		// Convert old-style UoB component tables to new.
		// --------------------------------------------------------------------------------

		for (var i = 0; i < aTableStylesOld.length; i++) {
			var strTag = aTableStylesOld[i];

			$content.find("table > tbody > tr > td:first-child:contains([uob-" + strTag + "])").each(function(index, tableTag){
				$(tableTag).parent().parent().parent().addClass("uob-" + strTag);
				$(tableTag).parent().remove();
			});
		}


		// ================================================================================
		// Accordian
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-accordion tables to required format.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-accordion table.
			$table = $content.find("table[class~='uob-accordion'],table[class~='uob-accordion-ea']").last();

			// Break loop if no more accordions are to be displayed.
			if ($table.length != 1) break;

			// Determine new ID for this accordion.
			var iSetNum = getSetNum();
			var strAnchor = "set" + iSetNum;

			// Add "Expand all" button
			if ($table.filter("table:first[class~=uob-accordion-ea]").length > 0) {
				$table.before("<p class=\"uob-accordion-button-container\"><a id=\"" + strAnchor + "button\" href=\"#" + strAnchor + "\" class=\"uob-accordion-button Button\">Expand all</a></p>");
			}

			// Convert table into HTML for an accordian.
			$table.before("<div id=\"" + strAnchor + "\" class='uob-accordion'></div>");

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				if ((_idx + 1) % 2) {
					// Add heading 4 for accordion bar.
					$table.prev().append("<h4></h4>");
					$table.prev().children().last().append($(_item).text().trim());
				} else {
					// Add div for accordion content.
					$table.prev().append("<div></div>");
					$table.prev().children().last().append($(_item).contents());
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}

		// Initialise accordions. Accordions will be contained within elements with a
		// uob-accordion class and headings will be restricted to h4 tags.
		var $accordion = $content.find(".uob-accordion");

		if ($accordion.length) {
			$accordion.accordion({
				icons: null,
				heightStyle: "content",
				header: "> h4",
				collapsible: true,
				active: false,
				beforeActivate: function( event, ui ) {
					ui.oldPanel.find(".hide_youtube_embed_link").click();
					var $button = $("#" + $(this).attr("id") + "button");
					var body = $button.attr("href");

					if ($button.prop("uobExpanded")) {
						$(body).accordion({active: false});
						$(body + ' > .ui-accordion-header').next().slideUp();
						$button.removeClass("Button--primary");
						$button.removeProp("uobExpanded");
					}
				}
			});
		}

		// Initialise accordion buttons.
		var $accordionButton = $content.find(".uob-accordion-button");

		if ($accordionButton.length) {
			$accordionButton.button()
				.click(function(event) {
					var $button = $(this);
					var body = $button.attr("href");
					var options;

					$(body).accordion({active: false});

					if ($button.prop("uobExpanded")) {
						$(body + ' > .ui-accordion-header').next().slideUp();
						$button.removeClass("Button--primary");
						$button.removeProp("uobExpanded");
					} else {
						$(body + ' > .ui-accordion-header').next().slideDown();
						$button.addClass("Button--primary");
						$button.prop("uobExpanded", "1");
					}

					return(false);
				});
		}


		// ================================================================================
		// Tabs
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-tabs tables to format required for tabs.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-tabs table.
			$table = $content.find("table[class~='uob-tabs']").last();

			// Break loop if no more tabs are to be displayed.
			if ($table.length != 1) break;

			// Convert table into a set of tabs.
			$table.before("<div class='uob-tabs'><ul></ul></div>");
			var iSetNum = getSetNum();

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				var strAnchor = "set" + iSetNum + "tab" + ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {
					// Add list item for the tab label.
					var strHTML = "<li><a href=\"#" + strAnchor + "\">" + $(_item).text().trim() + "</a></li>";
					$table.prev().find("ul").first().append(strHTML);
				}

				if (_idx % 2) {
					// Add div for the tab content.
					$table.prev().append("<div id=\"" + strAnchor + "\"></div>");
					$("#" + strAnchor).append($(_item).contents());
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}

		// Initialise tabs. Tabs will be contained within elements with a uob-tabs class.
		var $tabs = $content.find(".uob-tabs");

		if ($tabs.length > 0) {
			$tabs.tabs({
				active: 0,
				collapsible: false,
				heightStyle: "content",
				beforeActivate: function( event, ui ) {
					ui.oldPanel.find(".hide_youtube_embed_link").click();
				}
			});
		}


		// ================================================================================
		// Parallax
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-parallax tables to format required for parallax.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-parallax table.
			$table = $content.find("table[class~='uob-parallax']").last();

			// Break loop if no more parallax blocks are to be displayed.
			if ($table.length != 1) break;

			// Convert table into a set of parallax blocks.
			$table.before("<div class='uob-parallax'><ul></ul></div>");
			var strImageSrc = "";

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				if ((_idx + 1) % 2) {
					// Store source of image
					strImageSrc = $(_item).find("img[src]").first().attr("src");
				}

				if (_idx % 2) {
					// Add div for the parallax content (if an image source exists).
					if (strImageSrc.length > 0) {
						var iSetNum = getSetNum();
						var strAnchor = "parallax" + iSetNum.toString();
						var strHTML = "<div class=\"parallax-block bg00\" style=\"background-image: url('" + strImageSrc + "')\">";
						strHTML += "<div id=\"" + strAnchor + "\" class=\"parallax-foreground\"></div>";
						strHTML += "</div>";
						$table.prev().append(strHTML);
						$("#" + strAnchor).append($(_item).contents());
					}
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}


		// ================================================================================
		// Reveals
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-reveal tables to format required for reveals.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-reveal table
			var $table = $content.find("table[class~='uob-reveal']").last();

			// Break loop if no more reveal tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a reveal
			var iSetNum = getSetNum();

			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				var strAnchor = "set" + iSetNum + "reveal" + ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {
					// Add new reveal button immediately before table
					$table.before("<p><a href=\"#" + strAnchor + "\" class=\"uob-reveal-button\"></a></p>");
					$table.prev().children().append($(_item).text().trim());
				}

				if (_idx % 2) {
					// Add new reveal content immediately before table
					$table.before("<div id=\"" + strAnchor + "\" class=\"uob-reveal-content\"></div>");
					$table.prev().append($(_item).contents());
				}
			});

			// Remove original table
			$table.remove();
		}

		// Initialise reveal contents. The uob-reveal-button and uob-reveal-content classes are required for reveals.
		var $revealBody = $content.find(".uob-reveal");

		if ($revealBody.length) {
			for (var i = 0; i < $revealBody.length; i++) {
				var strSelector = $revealBody[i].href;
				var iHashPos = strSelector.lastIndexOf("#");

				if (iHashPos >= 0) {
					$(strSelector.slice(iHashPos + 1)).css("display", "none");
				}
			};
		}

		// Initialise reveal buttons.
		var $revealButton = $content.find(".uob-reveal-button");

		if ($revealButton.length) {
			$revealButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var body = $button.attr("href");
					var options;

					if ($(body).css("display") != "none") {
						$(body).slideUp(400);
						$(body).find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
					} else {
						$(body).slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
					}

					$button.button("option", options);
					return(false);
				});
		}


		// ================================================================================
		// RegExp
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-regexp tables to format required for regexps.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-regexp table
			var $table = $content.find("table[class~='uob-regexp']").last();

			// Break loop if no more regexp tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a regexps
			var iSetNum = getSetNum();

			// Generate HTML for input and button/anchor controls, and add to the DOM.
			var strAnchor = "RE" + iSetNum;

			var strHTML = "<p><input id=\"input" + strAnchor + "\" class=\"uob-regexp-input\" type=\"text\" size=\"40\" />&nbsp;<a href=\"#" + strAnchor + "\" id=\"button" + strAnchor + "\" class=\"uob-regexp-button\">Check Answer</a></p>";
			strHTML += "<div id='content" + strAnchor + "'></div>";
			$table.before(strHTML);

			// Store regular expressions in button and create DIVs to store the contents.
			$table.find("tbody:first > tr > td").each(function(_idx, _item) {
				var strValue = $(_item).html();
				var strIndex = ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {		// set RegExp
					strValue = $(_item).text().trim();
					$("#button" + strAnchor).attr("regexp" + strIndex, strValue);
				}

				if (_idx % 2) {			// set Content
					//$("#data" + strAnchor).attr("content" + strIndex, strValue);
					strHTML = "<div id=\"data" + strAnchor + "ID" + strIndex + "\" class=\"uob-regexp-content\"></div>";
					$("#content" + strAnchor).append(strHTML);
					$("#data" + strAnchor + "ID" + strIndex).append($(_item).contents());
				}
			});

			// Store IDs of input and button to button and input respectively.
			$("#button" + strAnchor).attr("regexpInput", "input" + strAnchor);
			$("#input" + strAnchor).attr("regexpButton", "button" + strAnchor);

			// Store default selection in button.
			$("#button" + strAnchor).attr("regexpData", "data" + strAnchor + "ID0");
			$("#button" + strAnchor).attr("regexpDataRoot", "data" + strAnchor + "ID");

			// Remove original table
			$table.remove();
		}

		// Initialise regexp inputs. The uob-regexp-input, uob-regexp-button and
		// uob-regexp-content classes are required for regexp.
		var $regexpInput = $content.find(".uob-regexp-input");

		if ($regexpInput.length) {
			$regexpInput.focus(function(event) {
				var $input = $(this);
				var $button = $("#" + $input.attr("regexpButton"));

				var strData = $button.attr("regexpData");
				var strDataRoot = $button.attr("regexpDataRoot");

				if (strData != "") {
					var $data = $("#" + strData);
					var options;

					// Hide current display if visible
					if ($data.css("display") != "none") {
						$data.slideUp(400);
						$data.find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
						$button.attr("regexpData", "");
					}
				}
			});
		}

		// Initialise regexp buttons.
		var $regexpButton = $content.find(".uob-regexp-button");

		if ($regexpButton.length) {
			$regexpButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var $input = $("#" + $button.attr("regexpInput"));

					var strData = $button.attr("regexpData");
					var strDataRoot = $button.attr("regexpDataRoot");
					if (strData == "") strData = strDataRoot + "0";
					var $data = $("#" + strData);
					var options;

					// Hide current display if visible
					if ($data.css("display") != "none") {
						$data.slideUp(400);
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
						$button.attr("regexpData", "");
					} else {
						// Locate content to be displayed
						var strInput = $input.val();

						// Loop through regexp looking for a match and identify content.
						for (var i = 0; i < 100; i++) {
							var strRegExp = $button.attr("regexp" + i);

							if (strRegExp == undefined || strRegExp.length == 0)
								break;

							var re = new RegExp("^" + strRegExp.trim() + "$");

							if (strRegExp == "default" || re.test(strInput)) {
								$button.attr("regexpData", "" + strDataRoot + i);
								$data = $("#" + strDataRoot + i);
								break;
							}
						}

						$data.slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
						$button.button("option", options);
						return(false);
					}
				});
		}


		// ================================================================================
		// MCQs
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-mcq tables to format required for MCQs.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-mcq table
			var $table = $content.find("table[class~='uob-mcq']").last();

			// Break loop if no more mcq tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a MCQs
			// Determine the name used to identify each MCQ. It will take the form MCQ# where # is a number.
			var iSetNum = getSetNum();
			var strName = "MCQ" + iSetNum;

			// Add skeleton HTML, including the main button, to the DOM (positioned just above the table).
			$table.before("<div> <div></div> <p><a href=\"#" + strName + "\" id=\"button" + strName + "\" mcqData=\"\" mcqName=\"" + strName + "\" class=\"uob-mcq-button\">Show feedback</a></p> <div></div> </div>");
			var $mcqOptions = $table.prev().children().filter(":first");
			var $mcqFeedback = $table.prev().children().filter(":last");

			// Compile HTML for options (strHTML1) and feedback (strHTML2).
			$table.find("tbody:first > tr").each(function(_idx, _item) {
				// Determine the value used to identify each option. It will take the form MCQ#OPT# where # is a number.
				var strValue = strName +  "OPT" + _idx;

				// Append the HTML for the option to the DOM.
				var $option = $(_item).find("td:first");
				$mcqOptions.append("<div><label class=\"uob-mcq-option\"><div class=\"uob-mcq-option1\"><input name=\"" + strName + "\" type=\"radio\" value=\"" + strValue + "\" /></div><div class=\"uob-mcq-option2\"></div></label></div>");
				$mcqOptions.children().last().children().children(".uob-mcq-option2").append($option.contents());

				// Append the HTML for the feedback to the DOM.
				var $feedback = $(_item).find("td:nth-of-type(2)");
				$mcqFeedback.append("<div id=\"" + strValue + "\" class=\"uob-mcq-feedback\"></div>");
				$mcqFeedback.children().last().append($feedback.contents());
			});

			// Remove original table from the DOM.
			$table.remove();
		}

		// Initialise mcq options. The uob-regexp-input, uob-regexp-button and
		// uob-regexp-content classes are required for MCQ.
		$("div.uob-mcq-option1 input").on("change", function(event){
			var $button = $("#button" + $(this).attr("name"));
			var strData = $button.attr("mcqData");
			var $data = $("#" + strData);

			if ($data.length > 0 && $data.css("display") != "none") {
				$data.slideUp(400);
				$data.find(".hide_youtube_embed_link").click();
				options = { icons: { secondary: "ui-icon-triangle-1-e" } };
				$button.button("option", options);
			}

			return(true);
		});

		// Initialise mcq button.
		var $mcqButton = $content.find(".uob-mcq-button");

		if ($mcqButton.length) {
			$mcqButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var strName = $button.attr("mcqName");
					var strData = $button.attr("mcqData");
					var $data = $("#" + strData);
					var options;

					// Hide current feedback display if visible
					if ($data.length > 0 && $data.css("display") != "none") {
						$data.slideUp(400);
						$data.find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
					} else {
						// Locate content to be displayed
						var strCorrect = $button.attr("mcqCorrect");
						var strSelected = $("input[name=" + strName + "]:checked").val();
						$button.attr("mcqData", strSelected);
						$data = $("#" + strSelected);

						// Show feedback display
						$data.slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
						$button.button("option", options);
					}

					return(false);
				});
		}


		// ================================================================================
		// Rating
		//
		// A rating will be constructed using radio buttons.
		// See http://www.fyneworks.com/jquery/star-rating/
		// --------------------------------------------------------------------------------

		// Convert uob-rating table to format required for ratings.
		var $ratingTable = $content.find("table[class~='uob-rating']");

		if ($ratingTable.length) {
			// Cut table from the DOM
			$ratingTable.remove();

			// Determine is user is more than a student.
			var isTeacher = false;

			hasAnyRole("teacher", "admin", function() {
				isTeacher = true;
			});

			// Add rating control to DOM
			var strParams = "?page_loc=" + encodeURIComponent(location.pathname);
			strParams += "&page_title=" + encodeURIComponent(document.title);
			strParams += "&user_id=" + ENV.current_user_id;
			strParams += "&user_name=" + encodeURIComponent(ENV.current_user.display_name);
			var strRating = "<iframe src=\"https://www.vampire.bham.ac.uk/canvas/rating.aspx" + strParams + "\" width=\"100%\" height=\"32\"></iframe>";
			strRating = "<div id='uob-rating-container-x'>" + strRating + "</div>";
			$content.append(strRating);
		}


		// ================================================================================
		// Boxes
		//
		// Create boxes from all tables with the codes: uob-tip, uob-info, uob-warning,
		// uob-header, uob-quote, uob-quote6699 and uob-question.
		// --------------------------------------------------------------------------------

		for (var i = 0; i < aTableStyles.length; i++) {
			if (aTableStyles[i].group == "Box") {
				var strTag = aTableStyles[i].class;
				var $boxTable = $content.find("table[class~='uob-" + strTag + "']");

				if ($boxTable.length) {
					$boxTable.each(function(_idx, _item) {
						// Add new container immediately before table
						$table = $(_item);

						if (strTag == "header")
							$table.before("<h2 class=\"uob-" + strTag + "\"></h2>");
						else
							$table.before("<div class=\"uob-" + strTag + "\"></div>");

						// Move content from table to container
						$table.prev().append($table.find("th,td").first().contents());

						// Remove original table
						$table.remove();
					});

					// Replace double quotes in uob-quot6699 text with corresponding SVG images
					replaceText("div.uob-quote6699", /(\u201C|\")([^\s\"]+)(\u201D|\")/g, "<span class=\"uob-nowrap\"><span class=\"uob-quote66\"></span>$2<span class=\"uob-quote99\"></span></span>");
					replaceText("div.uob-quote6699", /(\u201C|\")([^\s\"]+)/g, "<span class=\"uob-nowrap\"><span class=\"uob-quote66\"></span>$2</span>");
					replaceText("div.uob-quote6699", /([^\s\"]+)(\u201D|\")/g, "<span class=\"uob-nowrap\">$1<span class=\"uob-quote99\"></span></span>");
					replaceText("div.uob-quote6699", /(\u201C|\")(\u201D|\")/g, "<span class=\"uob-nowrap\"><span class=\"uob-quote66\"></span><span class=\"uob-quote99\"></span></span>");
					replaceText("div.uob-quote6699", /(\u201C)/g, "<span class=\"uob-quote66\"></span>");
					replaceText("div.uob-quote6699", /(\u201D|\")/g, "<span class=\"uob-quote99\"></span>");
				}
			}
		}


		// ================================================================================
		// Columns
		//
		// Create column layout from all tables with the code uob-columns.
		// --------------------------------------------------------------------------------

		// Convert all uob-columns tables to div with columns.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-columns table.
			$table = $content.find("table[class~='uob-columns']").last();

			// Break loop if no more columns are to be displayed.
			if ($table.length != 1) break;

			// Convert table into columns.
			$table.before("<div class='uob-columns'></div>");
			$table.prev().append($table.find("th,td").first().contents());

			// Remove original table from the DOM
			$table.remove();
		}


		// ================================================================================
		// Apply styling for striped and sortable tables
		// --------------------------------------------------------------------------------

		// Apply styling for striped tables
		$content.find("table.uob-striped > tbody > tr:odd, table.uob-striped > tr:odd").addClass("odd");

		// Apply styling for sortable tables
		$content.find("table.uob-sortable").each(function(index) {
			var t = new SortableTable(this);
		});


		// ================================================================================
		// QR codes
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-qrcode tables to format required for QR codes.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-qrcode table
			var $table = $content.find("table[class~='uob-qrcode']").last();

			// Break loop if no more QR code tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a QR code
			var iSetNum = getSetNum();
			var strString = $table.find("th,td").first().text().trim();
			if (strString.length == 0) strString = location.href;
			var strAnchor = "qrcode" + iSetNum;
			var strImage = "<img src=\"http://chart.apis.google.com/chart?cht=qr&chs=128x128&amp;chl=" + encodeURI(strString) + "&chld=H|0\" alt=\"QR Code\">"
			$table.before("<div id=\"" + strAnchor + "\" class=\"uob-qrcode\">" + strImage + "</div>");

			// Remove original table
			$table.remove();
		}


  		// ================================================================================
		// Buttons
		// --------------------------------------------------------------------------------

		// Convert up to 100 uob-button tables to buttons.
		for (var i = 0; i < 100; i++) {
			// Locate the next uob-button table
			var $table = $content.find("table[class~='uob-button']").last();

			// Break loop if no more button tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into buttons
			$table.find("tbody:first > tr").each(function(_idx, _item) {
				// Pull in row of data
				var $anchors = $(_item).find("td").eq(0);
				var $options = $(_item).find("td").eq(1);
				var strOptions = $options.text();

				// Set the button's style (based on width option)
				var strWidth = "";
				var reWidth = new RegExp("\\bwidth\\s*\\=\\s*(\\d+)(em\\b|px\\b|%)", "gi");
				var aWidth = reWidth.exec(strOptions);
				if (aWidth != null) strWidth = "" + aWidth[1] + aWidth[2];

				// Set the button's class (based on type option)
				var strType = "";
				var reColour = new RegExp("\\btype\\s*\\=\\s*(\\w+)\\b", "gi");
				var aColour = reColour.exec(strOptions);
				if (aColour != null) strColour = aColour[1]; else strColour = "";

				switch (strColour) {
					case "primary": case "secondary": case "success": case "warning": case "danger": case "link":
						strType = "Button Button--" + strColour;
						break;
					default:
						strType = "Button";
				}

				// Loop through anchors
				$anchors.find("a").each(function(_a_idx, _a_item) {
					// Amend style and class of the anchor, insert paragraph before table, and move anchor to the paragraph.
					if ($(_a_item).text().length) {
						$(_a_item).addClass(strType).css("width", strWidth);
						$table.before("<p></p>");
						$table.prev().append($(_a_item));
					}
				});

			});

			// Remove original table
			$table.remove();
		}


  		// ================================================================================
		// Commands
		// --------------------------------------------------------------------------------

		// Locate any uob-stylehead tables and if found, style the default h1 or h2 header.
		if ($content.find("table[class~='uob-stylehead']").remove().length) {
			$(".course-title,.page-title").addClass("uob-header");
		}

		// Locate any uob-hidehead tables and if found, hide the default h1 or h2 header.
		if ($content.find("table[class~='uob-hidehead']").remove().length) {
			$(".course-title,.page-title").hide();
		}

		// Locate any uob-hideleftside tables and if found, hide the left side.
		if ($content.find("table[class~='uob-hideleftside']").remove().length) {
			if ($(".course-menu-expanded").length) { $("#courseMenuToggle").click(); }
		}

		// Locate any uob-hiderightside tables and if found, hide the right side.
		if ($content.find("table[class~='uob-hiderightside']").remove().length) {
			$("#right-side-wrapper").hide();
		}


		// ================================================================================
		// Display CEPLER information
		// --------------------------------------------------------------------------------

		// Convert uob-rating table to format required for ratings.
		var $ceplerTable = $content.find("table[class~='uob-cepler']");

		if ($ceplerTable.length && ENV.current_user_id != null) {
			$(function() {
				// Prepare date and time string
				var d = new Date();
				var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				var strDay = d.getDate();
				if (d.getDate() < 10) strDay = "0" + strDay;
				var strDateTime = d.getHours() + ":" + d.getMinutes() + ", " + d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();

				// Get the course ID
				var strHref = window.location.pathname || "";
				var courseID = strHref.split('/')[2] || 0;

				// Get user ID
				var strID = parseInt(ENV.current_user_id).toString(16).toUpperCase() || "";

				if (strID.length) {
					// Read in body of Data page
					var strCommand2 = "/api/v1/courses/" + courseID + "/pages/uob-cepler";

					$.get(strCommand2).done( function(_d) {
						var strCEPLER = "";
						var strBody = _d.body || "";
						var strJSON = strBody.match(/\[.*\]/m)[0];
						var jsonData = $.parseJSON(strJSON);

						//strCEPLER = "<h2>CEPLER Professional Development Report for " + ENV.current_user.display_name + " at " + strDateTime + "</h2>\n";
						strCEPLER = "<h2>CEPLER Professional Development Report for " + ENV.current_user.display_name + "</h2>\n";
						strCEPLER += "<table>\n";
						var iGrandTotal = 0;

						for (var i = 0; i < jsonData.length; i++) {
							if (jsonData[i].s == strID) {
								var jsonStudent = jsonData[i];

								for (var j = 0; j < jsonStudent.c.length; j++) {
									var jsonCategory = jsonStudent.c[j];
									strCEPLER += "<tr><td><strong>" + jsonCategory.ct + "</strong></td><td>&nbsp;</td></tr>\n";
									var iTotal = 0;

									for (var k = 0; k < jsonCategory.a.length; k++) {
										var jsonActivity = jsonCategory.a[k];
										strCEPLER += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;" + jsonActivity.at + "&nbsp;&nbsp;</td><td style=\"text-align: right;\">" + jsonActivity.p + "</td></tr>\n";
										iTotal += jsonActivity.p;
									}

									iGrandTotal += iTotal;
									strCEPLER += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;TOTAL</td><td style=\"text-align: right; border-top: 1px solid #808080; border-bottom: 1px solid #808080;\">" + iTotal + "</td></tr>";
									strCEPLER += "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>";
								}

								break;
							}
						}

						// Replace table with CEPLER HTML
						strCEPLER += "<tr><td><strong>GRAND TOTAL</strong></td><td style=\"text-align: right; border-top: 1px solid #808080; border-bottom: 1px solid #808080;\">" + iGrandTotal + "</td></tr>";
						strCEPLER += "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>";
						strCEPLER += "</table>\n";
						$ceplerTable.replaceWith(strCEPLER);
					});
				}

			});
		}


		// ================================================================================
		// Previews
		//
		// This code will append preview buttons immediately after each file link in the
		// content of a page. File links are identified by the instructure_file_link class.
		// When clicked the first time, the preview button will call a function to complete
		// the DOM changes, which are not possible before the DOM manipulation carried out
		// within Canvas is complete. The new HTML for the preview button will be similar
		// to the following:
		//
		// <a href="javascript:uobShowPreviewDocument(0)" title="Preview example.pdf" id="uobPreview0">
		//     <img src="/images/preview.png" alt="Preview example.pdf">
		// </a>
		// --------------------------------------------------------------------------------

		$content.find(".instructure_file_link_holder.link_holder").has("a").each(function(_idx, _item) {
			// Initialise varibles
			var $item = $(_item);
			var $anchor = $(_item).find('a').filter(':first');
			var strHref = $anchor.attr('href') || "";	// if href is not found, set strHref to an empty string.
			var iScribd = $(_item).find('.instructure_scribd_file_holder').length || 0;

			if (iScribd > 0) {
				strHref = "";
			}

			if (strHref.length > 0) {
				// Obtain ID of the file (index is 4 or 6 respectivelly for non-draft and draft modes)
				var file_id = strHref.split('/')[strHref.indexOf("/courses") == 0 ? 4 : 6];

				// Use Canvas API to obtain information about the file being linked.
				$.get('/api/v1/files/' + file_id, function(_d) {

					// Check that the file type is compatible with the Google viewer.
					if ($.isPreviewable(_d['content-type'], 'google') === 1) {

						// Initialise variables
						var displayName = _d['display_name'];

						// Create anchor element for the link. Note, _idx is used to make each
						// link unique. The file_id cannot be used in case when the same file
						// link appears more than once on a page.
						var $a = $(document.createElement('a'))
							.attr('href', 'javascript:uobShowPreviewDocument(' + _idx + ')')
							.attr('title', 'Preview ' + displayName)
							.attr('id', 'uobPreview' + _idx)
							.attr('style', 'padding-left: 5px;')
							.data('href2', strHref);

						// Create preview icon for the link
						var $img = $(document.createElement('img'))
							.attr('src', 'https://s3.amazonaws.com/SSL_Assets/bham/images/preview.png')
							.attr('alt', 'Preview ' + displayName);

						// Combine the preview icon with the anchor and add them to the DOM.
						$a.append($img);
						$anchor.after($a);
						//$(_item).append($a);
					}
				});
			}
		});


		// ================================================================================
		// Create dummy divs and/or classes to register UoB components have been added.
		// --------------------------------------------------------------------------------

		// Body of all pages
		if ($("#uob-components-loaded").length == 0) {
			var $div = $(document.createElement('div')).attr('id', 'uob-components-loaded');
			$("body").append($div);
		}

		// Discssions
		onPage(/^\/(courses|groups)\/.*discussion_topics/, function() {
			$content.filter("div.message.user_content.enhanced").addClass("uob-components-loaded");
		});

		// Quizzes
		onPage(/^\/courses\/.*\/quizzes\/.*\/edit$/, function() {
			$content.filter("div.question_text.user_content.enhanced").addClass("uob-components-loaded");
		});


		// ================================================================================
		// --------------------------------------------------------------------------------

	}


	// ================================================================================
	// uobLoadGallery
	//
	// This function will load the JS/CSS required for the Canvas Gallery.
	// ================================================================================

	function uobLoadGallery(courseID) {
		if (courseID == 9105) {
			uobEmbedStyleSheet("https://tel.bham.ac.uk/bham/gallery/gallery.css");
			uobEmbedJavaScript("https://tel.bham.ac.uk/bham/gallery/gallery.js");
		}
		
		if (courseID == 10822) {
			uobEmbedStyleSheet("https://tel.bham.ac.uk/bham/gallery/gallery.css");
			uobEmbedJavaScript("https://tel.bham.ac.uk/bham/gallery/gallery_beta.js");
		}
		
	}


	// ================================================================================
	// uobSetPageFooter
	//
	// This function will amend the footer to include the School/Department heading
	// and/or links to the Canvas Gallery and introductory video.
	// ================================================================================

	function uobSetPageFooter(accountID) {
		var strUnit = "";
		var strMessage = "";

		//strUnit = "<div id='uob_footer_message'>For access to open and self-enrolment courses, visit the <a href='/courses/9105'>Canvas Gallery</a>.</div>";
		//strUnit = "<div id='uob_footer_message'>Complete the <strong><a href='/enroll/DJMF9W'>Canvas Student Survey</a></strong> for a chance to win one of two &pound;50 Amazon gift vouchers.<br/>For access to open and self-enrolment courses, visit the <a href='/courses/9105'>Canvas Gallery</a>.</div>";
		//strMessage = "To get started with the new Canvas interface, watch <br/>our two-minute <a href='https://youtu.be/HsPYoR6lK08' target='IntroductoryVideo'>introductory video</a>. For access to open<br/>and self-enrolment courses, visit the <a href='/courses/9105'>Canvas Gallery</a>.";
		//strMessage = "Get started with Canvas by watching this two-minute <a href='https://youtu.be/HsPYoR6lK08' target='IntroductoryVideo'>introductory video</a>.</br/>Access open and self-enrolment courses by visiting the <a href='/courses/9105'>Canvas Gallery</a>.";
		//strMessage = "Get started with Canvas by watching this <a href='https://youtu.be/HsPYoR6lK08' target='IntroductoryVideo'>introductory video</a>.</br/>See open and self-enrolment courses in the <a href='/courses/9105'>Canvas Gallery</a>.";
		//strMessage = "See open and self-enrolment</br/>courses in the <a href='/courses/9105'>Canvas Gallery</a>.";
		//strMessage = "See open and self-enrolment</br/>courses in the <a href='/courses/9105'>Canvas Gallery</a>.";

		strMessage = "For staff help, see the <a href='http://www.birmingham.ac.uk/university/professional-development-gateway/' target='ProfessionalDevelopmentGateway'>Professional Development Gateway</a>"
		strMessage += "</br/>For student help, see the new <a href='/courses/21228'>Introduction to Canvas for Students</a>."
		//strMessage += "</br/>A <a href='http://www.birmingham.ac.uk/university/professional-development-gateway/' target='ProfessionalDevelopmentGateway'>Professional Development Gateway</a> is also available for staff."

		switch (accountID) {
			// CAL
			case 3: case 37: case 38: case 39: case 41: case 233: case 234: case 235: case 202: case 203:
			case 204: case 205: case 206: case 207: case 208: case 216: case 217: case 218: case 219: case 220:
			case 221: case 225: case 226: case 227: case 228: case 236: case 244:
			strUnit = "ARTS AND LAW";
			break;

			// CoSS
			case 4: case 130: case 131: case 132: case 133: case 134: case 135: case 136: case 137: case 138:
			case 139: case 140: case 141: case 142: case 143: case 144: case 145: case 146: case 147: case 148:
			case 149: case 150: case 151: case 152: case 153: case 154: case 155: case 156: case 157: case 158:
			case 159: case 160: case 161: case 162: case 163: case 164: case 165: case 166: case 167: case 168:
			case 169: case 230: case 231: case 232: case 245:
			strUnit = "SOCIAL SCIENCES";
			break;

			// EPS
			case 5: case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56:
			case 57: case 58: case 59: case 60: case 61: case 62: case 63: case 64: case 65: case 66:
			case 67: case 68: case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76:
			case 77: case 78: case 79: case 80: case 81: case 82: case 83: case 84: case 85: case 86:
			case 87: case 88: case 89: case 90: case 91: case 92: case 93: case 94: case 327: case 95:
			case 96: case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105:
			case 106: case 107: case 108: case 109: case 110: case 112: case 113: case 114: case 115: case 116:
			case 117: case 118: case 119: case 120: case 121: case 122: case 123: case 124: case 125: case 126:
			case 127: case 128: case 129: case 209: case 210: case 211: case 212: case 213: case 214: case 215:
			case 249: case 337:
			case 390: case 391: case 395: case 396: case 397: case 392: case 402: case 403: case 404:
			case 393: case 408: case 409: case 410: case 414: case 415: case 416: case 417: case 418:
			case 443: case 444: case 444: case 466: case 467: case 468: case 469:
			strUnit = "ENGINEERING AND<br/>PHYSICAL SCIENCES";
			break;

			// LES
			case 6: case 36:
			case 248: case 343:
			strUnit = "LIFE AND ENVIRONMENTAL SCIENCES";
			break;

			// MDS
			case 7: case 170: case 171: case 172: case 173: case 174: case 224: case 176: case 177:
			case 178: case 179: case 180: case 181: case 182: case 183: case 184: case 229: case 185: case 186:
			case 187: case 188: case 189: case 190: case 191: case 192: case 193: case 194: case 195: case 196:
			case 197: case 198: case 199: case 200: case 201: case 222: case 223: case 247:
			strUnit = "MEDICAL AND DENTAL SCIENCES";
			break;

			// CS
			case 8: case 9: case 10: case 335: case 336: case 11: case 339: case 340: case 341:
			case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 342:
			case 22: case 23: case 24: case 25: case 26: case 237: case 238: case 239: case 242: case 243:
			case 324: case 325: case 326: case 328: case 329: case 338: case 344: case 246:
			case 277: case 287: case 445:
			strUnit = "PROFESSIONAL SERVICES";
			break;

			// CS - BIA
			case 12: strUnit = "BIRMINGHAM INTERNATIONAL ACADEMY"; break;

			// CS - Guild
			case 331:
			strUnit = "<img src='https://tel.bham.ac.uk/bham/images/guild_of_students.svg' alt='Guild of Students' />";
			break;

			// CS - Educational Enterprise
			case 332: strUnit = "EDUCATIONAL ENTERPRISE"; break;

			// Wiley
			case 333: case 334: case 345: case 346: case 347: case 348: case 349:
			strMessage = "For technical assistance, please contact your <a href='mailto:uob@personalsupportcenter.com'>Online Technical Support Desk</a><br/>+44 (0) 800 032 7101 (UK) or +01 844 238 9560 (US) extension 3"
			break;

			// CS - Exemplars
			case 323: strUnit = "EXEMPLAR COURSE"; break;

			// Liberal Arts and Sciences
			case 352: strUnit = "LIBERAL ARTS AND SCIENCES"; break;

			// Biosciences
			case 27: strUnit = "SCHOOL OF BIOSCIENCES"; break;

			// GEES
			case 28: strUnit = "GEES"; break;

			// Earth and Environmental Sciences
			case 29: strUnit = "EARTH AND<br/>ENVIRONMENTAL SCIENCES"; break;

			// Geography
			case 30: strUnit = "GEOGRAPHY"; break;

			// Psychology
			case 31: strUnit = "PSYCHOLOGY"; break;

			// PGA
			case 33:
			strUnit = "<img src='https://tel.bham.ac.uk/bham/images/pga.svg' alt=\"The Professional Golfers' Association\" />";

			break;

			// SportEx
			case 32: case 34: case 35: strUnit = "SCHOOL OF SPORT, EXERCISE<br/>& REHABILITATION SCIENCES"; break;

			// Dentistry
			case 175: strUnit = "SCHOOL OF DENTISTRY"; break;

			// Hospitality and Accommodation
			case 442: strUnit = "HOSPITALITY AND<br/>ACCOMMODATION SERVICES"; break;

			// Template
			case 999: strUnit = "Unit"; break;
		}

		if(strUnit.length)
			$("#uob_footer_unit").html(strUnit);
		else
			$("#uob_footer_unit_container").hide();

		if(strMessage.length)
			$("#uob_footer_message").html(strMessage);
		else
			$("#uob_footer_message").hide();

	}


	// ================================================================================
	// CSS/JS/style loader functions
	// ================================================================================

	function uobEmbedStyleSheet(urlCSS) {
		var oCSS = document.createElement("link");
		oCSS.rel = "stylesheet";
		oCSS.type = "text/css";
		oCSS.href = urlCSS;
		document.getElementsByTagName("head")[0].appendChild(oCSS);
	}


	function uobEmbedJavaScript(urlJS) {
		var oJS = document.createElement("script");
		oJS.type = "text/javascript";
		oJS.async = false;
		oJS.src = urlJS;
		document.getElementsByTagName("head")[0].appendChild(oJS);
	}


	function uobSetDocumentStyle(doc, selector, declarations) {

		var sheet = doc.createElement('style');
		sheet.innerHTML = selector + " {" + declarations + "}";
		doc.body.appendChild(sheet);
	}


	// ================================================================================
	// Instructure/rpflorence and other toolbox functions
	//
	// (see http://youtu.be/ag6mxnBMTnQ and https://gist.github.com/rpflorence/5817898)
	// Functions slightly amended and new functions added by TLB.
	// ================================================================================

	function onPage(regex, fnTrue, fnFalse) {
		if (location.pathname.match(regex))
			fnTrue();
		else if (arguments[2])
			fnFalse();
	}


	function hasAnyRole(/* role1, role2..., cb */) {
		var roles = [].slice.call(arguments, 0);
		var cb = roles.pop();

		if (typeof ENV != "object") return cb(false);
		if (typeof ENV.current_user_roles != "object") return cb(false);
		if (ENV.current_user_roles == null) return cb(false);

		for (var i = 0; i < roles.length; i++) {
			if (ENV.current_user_roles.indexOf(roles[i]) !== -1) return cb(true);
		}

		return cb(false);
	}


	function isUser(id, cb) {
		cb(ENV.current_user_id == id);
	}


	function onElementRendered(selector, cb, _attempts) {
		var el = $(selector);
		_attempts = ++_attempts || 1;
		if (el.length) return cb(el);
		if (_attempts > 55) return(false);

		setTimeout(function() {
			onElementRendered(selector, cb, _attempts);
		}, 367);
		return(false);
	}


	function onElementRemoved(selector, cb, _attempts) {
		var el = $(selector);
		_attempts = ++_attempts || 1;
		if (!el.length) return cb(el);
		if (_attempts > 55) return(false);

		setTimeout(function() {
			onElementRemoved(selector, cb, _attempts);
		}, 367);
		return(false);
	}


	function onCanvasObject(apiCall, cb) {
		$.get(apiCall).done(function(_d) {
			cb(_d);
		});
	}


	function onTinyMCE(cb, _attempts) {
		if (typeof tinyMCE == 'object' && typeof tinyMCE.editors == "object") {
			setTimeout(function() { cb(); }, 200);
			return(true);
		}

		if (typeof tinyRCE == 'object' && typeof tinyRCE.editors == "object") {
			setTimeout(function() { cb(); }, 200);
			return(true);
		}

		_attempts = ++_attempts || 1;
		if (_attempts >= 60) return(false);

		setTimeout(function() { onTinyMCE(cb, _attempts); }, 200);
		return(false);
	}


	function onTinyMCEEditor(cb, _attempts) {
		if (typeof tinyRCE == 'object' && typeof tinyRCE.editors == "object" && tinyRCE.editors.length) {
			setTimeout(function() { cb(); }, 200);
			return(true);
		}

		if (typeof tinyMCE == 'object' && typeof tinyMCE.editors == "object" && tinyMCE.editors.length) {
			setTimeout(function() { cb(); }, 200);
			return(true);
		}

		_attempts = ++_attempts || 1;
		if (_attempts >= 60) return(false);

		setTimeout(function() { onTinyMCEEditor(cb, _attempts); }, 200);
		return(false);
	}


	function getTinyMCE() {
		if (typeof tinyRCE == 'object' && typeof tinyRCE.editors == "object" && tinyRCE.editors.length)
			return(tinyRCE);

		if (typeof tinyMCE == 'object' && typeof tinyMCE.editors == "object" && tinyMCE.editors.length)
			return(tinyMCE);

		return(null);
	}


	function onActiveEditorTinyMCE(cb, _attempts) {
		if ((typeof tinyRCE) == "object" && tinyRCE.activeEditor && tinyRCE.activeEditor.dom && tinyRCE.activeEditor.dom.doc) {
			return cb(tinyRCE.activeEditor.dom.doc);
		}

		if ((typeof tinyMCE) == "object" && tinyMCE.activeEditor && tinyMCE.activeEditor.dom && tinyMCE.activeEditor.dom.doc) {
			return cb(tinyMCE.activeEditor.dom.doc);
		}

		_attempts = ++_attempts || 1;
		if (_attempts >= 60) return(false);

		setTimeout(function() { onActiveEditorTinyMCE(cb, _attempts); }, 200);
		return(false);
	}


	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}

		return(false);
	}


	function getSetNum() {
		return(++iUoBSetNum);
	}


	function replaceText(selector, search, replace) {
		var iCounter = iCounter || 0;

		$(selector).each(function(){
			if(this.nodeType === 3) {
				var textOld = this.nodeValue;
				var textNew = textOld.replace(search, replace);

				if(textOld != textNew) {
					$(this).replaceWith(textNew);
					iCounter++;
				}
			} else {
				iCounter += replaceText($(this).contents(), search, replace);
			}
		});

		return(iCounter);
	}


})




// ================================================================================
// uobExportAnalytics
//
// This function, written by SJW, will allow teachers to download data displayed in
// Canvas course analytics.
// ================================================================================

function uobExportAnalytics() {
	var strHref = window.location.pathname || "";
	var courseID = strHref.split('/')[2] || 0;

	var studentData = new Object();
	var studentDetails = ["Username", "Score", "UniversityID"];
	var nextpos = 0;
	var csvContent = "data:text/csv;charset=utf-8,";

	for (var count = 0; count < ENV.ANALYTICS.course.students.length; count++) {
		studentDetails = [ENV.ANALYTICS.course.students[count].login_id, ENV.ANALYTICS.course.students[count].current_score, ENV.ANALYTICS.course.students[count].sis_user_id];
		studentData[ENV.ANALYTICS.course.students[count].id] = studentDetails;
	}

	var studentArray = ["CanvasID", "UniversityID", "Username", "Score", "Participations", "PageViews", "TardinessMissing", "TardinessLate", "TardinessOnTime", "TardinessFloating", "TardinessTotal"];
	var analyticsArray = [studentArray];
	var apiCommand = "/api/v1/courses/" + courseID + "/analytics/student_summaries?per_page=50";

	readCanvasStats(apiCommand);


	function  headerStrip(header){
		var commapos = header.indexOf(",");

		if (commapos > -1 ) {
			header = header.slice(commapos + 1);
			header = headerStrip(header);
		}

		return header;
	}


	function readCanvasStats(apiCall) {
		var x = $.get(apiCall)

		.done(function(_d) {
			var len = _d.length;
			nextpos = x.getResponseHeader('Link').indexOf(">; rel=\"next\"");

			for (var count = 0; count < len; count++) {
				studentArray = [_d[count].id, studentData[_d[count].id][2], studentData[_d[count].id][0], studentData[_d[count].id][1], _d[count].participations, _d[count].page_views, _d[count].tardiness_breakdown.missing, _d[count].tardiness_breakdown.late, _d[count].tardiness_breakdown.on_time, _d[count].tardiness_breakdown.floating, _d[count].tardiness_breakdown.total];
				analyticsArray[analyticsArray.length] = studentArray;
			}

			if (nextpos > -1) {
				var header = x.getResponseHeader('Link').slice(0, nextpos + 13);
				header = headerStrip(header);
				var	httpPos = header.indexOf("https://");
				var closingbracketPos = header.indexOf(">");
				var newapiCall = header.slice(httpPos, closingbracketPos);
				readCanvasStats(newapiCall);
			}
			else {
				analyticsArray.forEach(function(dataArray, index){
				dataString = dataArray.join(",");
				csvContent += dataString + "\n";
			});

				var encodedUri = encodeURI(csvContent);
				document.getElementById('link').href = encodedUri;
				document.getElementById('link').click();
			}
		})

		.fail( function(_d) {
			console.log("JSON data failed");
		});
	}
}


// ================================================================================
// uobExportAttendance
//
// This function, written by TLB, will allow teachers to download data for
// attendance quizzes. Code first written 25/10/2016 and introduced in version 8.
// ================================================================================

function uobExportAttendance() {
	var strHref = window.location.pathname || "";
	var courseID = strHref.split('/')[2] || 0;
	var quizID = strHref.split('/')[4] || 0;

	var studentData = new Object();
	var nextpos = 0;
	var csvContent = "data:text/csv;charset=utf-8,";
	var strFilename = "data.csv"

	var attendanceArray = [];

	// Get quiz details.
	var apiCommand = "/api/v1/courses/" + courseID + "/quizzes/" + quizID;

	getCanvasObject(apiCommand, function(oQuiz) {
		// Determine date and time.
		var d = new Date(oQuiz.unlock_at);

		var strDate = (100 + d.getDate()).toString().substring(1, 3);
		strDate += "/" + (101 + d.getMonth()).toString().substring(1, 3);
		strDate += "/" + d.getFullYear().toString();

		var strTime = (100 + d.getHours()).toString().substring(1, 3);
		strTime += ":" + (100 + d.getMinutes()).toString().substring(1, 3);

		// Set header rows...
		csvContent += "002016,\n";
		csvContent += "Event Base Type,Event ID,Event Type,Programme Year,Student Level,Event Group ID,Date,Time\n";
		csvContent += "<edit>,<edit>,<edit>,<edit>,<edit>,<edit>," + strDate + "," + strTime + "\n";
		csvContent += "Student ID,Student Name,Attendance Status,Absence Type,Notes\n";

		apiCommand = "/api/v1/courses/" + courseID + "/quizzes/" + quizID + "/submissions?per_page=50&include[]=user";
		strFilename = oQuiz.title.replace(/[-^&'@{}[\],$=!#().%+~ ]+/g, "_") + ".csv";
		readAttendance(apiCommand, strFilename);
	});


	function getCanvasObject(apiCall, cb) {
		$.get(apiCall).done(function(_d) {
			cb(_d);
		});
	}


	// Function to get HTTP header.
	function  headerStrip(header){
		var commapos = header.indexOf(",");

		if (commapos > -1 ) {
			header = header.slice(commapos + 1);
			header = headerStrip(header);
		}

		return header;
	}


	function readAttendance(apiCall, strFilename) {
		var x = $.get(apiCall)

		.done(function(_d) {
			var len = _d.users.length;
			nextpos = x.getResponseHeader('Link').indexOf(">; rel=\"next\"");

			for (var count = 0; count < len; count++) {
				if (/^[0-9]+$/.test(_d.users[count].sis_user_id)) {
					var studentArray = [_d.users[count].sis_user_id, _d.users[count].sortable_name.replace(",", ""), "P"];
					attendanceArray[attendanceArray.length] = studentArray;
				}
			}

			if (nextpos > -1) {
				var header = x.getResponseHeader('Link').slice(0, nextpos + 13);
				header = headerStrip(header);
				var	httpPos = header.indexOf("https://");
				var closingbracketPos = header.indexOf(">");
				var newapiCall = header.slice(httpPos, closingbracketPos);
				readAttendance(newapiCall, strFilename);
			}
			else {
				attendanceArray.forEach(function(dataArray, index){
					dataString = dataArray.join(",");
					csvContent += dataString + "\n";
				});

				var encodedUri = encodeURI(csvContent);
				document.getElementById('link').href = encodedUri;
				document.getElementById('link').download = strFilename;
				document.getElementById('link').click();
			}
		})

		.fail( function(_d) {
			console.log("JSON data failed");
		});
	}
}


// ================================================================================
// uobShowPreviewDocument
//
// This function will amend a preview link so that when it is clicked, it will
// display documents using the Google viewer. This function will only be called
// once for each preview link, the first time it is clicked. When amended, the link
// is moved into the SPAN element with a "link_holder" class which should
// immediately precede the link. The preview link is given a new href attribute,
// the "scribd_file_preview_link" class and the click event will be triggered.
// ================================================================================

function uobShowPreviewDocument(iFileID) {
	// Initialise object variables to simplify the code. $target is the preview link
	// and $holder is the preceding or parent SPAN element (if it exists).
	var $target = $('#uobPreview' + iFileID);
	var $holder = $target.prev('span.link_holder');

	if ($holder.length == 0) {
		$holder = $target.parent('span.link_holder');
	}

	// Check that preceding element is a SPAN with the "link_holder" class.
	if ($holder.length) {

		// Move the anchor element into the preceeding span element
		$holder.append($target);

		// Replace href value, add the "scribd_file_preview_link" class and click.
		$target
			.attr('href', $target.data('href2'))
			.addClass('scribd_file_preview_link')
			.click();
	}
}

// ================================================================================
// addMenuItem
//
// This function will add a new menu item to the global navigation. It will add the 
// item above the last icon (Currently the "Help" icon). To change this (and add it to the bottom) simply remove line
// begining "$('#menu..." and replace with this "$('#menu').append(itemHtml);". Items are added from "addMenuItem"
// Which should contain 'Menu item title', 'URL', 'Name of the icon' (This can be a pre set
// icon or an svg).
// ================================================================================

    var styleAdded = false;  
    function addMenuItem(linkText, linkhref, icon, target) {  
        var iconHtml = '',  
            itemHtml,  
            linkId = linkText.split(' ').join('_'),  
            iconCSS = '<style type="text/css">' +  
                '   i.custom_menu_list_icon:before {' +  
                '       font-size: 27px;' +  
                '       width: 27px;' +  
                '       line-height: 27px;' +  
                '   }' +  
                '   i.custom_menu_list_icon {' +  
                '       width: 27px;' +  
                '       height: 27px;' +  
                '   }' +  
                '   body.primary-nav-expanded .menu-item__text.custom-menu-item__text {' +  
                '       white-space: normal;' +  
                '       padding: 0 2px;' +  
                '   }' +  
                '</style>';  
        if (icon !== '') {  
            // If it is a Canvas icon  
            if (icon.indexOf('icon') === 0) {  
                iconHtml = '<div class="menu-item-icon-container" role="presentation"><i class="' + icon + ' custom_menu_list_icon"></i></div>';  
            // for an svg or other image  
            } else if (icon !== '') {  
                iconHtml = '<div class="menu-item-icon-container" role="presentation">' + icon + '</div>';  
            }  
        }  
        // Build item html  
        itemHtml = '<li class="ic-app-header__menu-list-item ">' +  
                '   <a target="_blank" id="global_nav_' + linkId + '" href="' + linkhref + '" class="ic-app-header__menu-list-link">' + iconHtml +  
                '       <div class="menu-item__text custom-menu-item__text">' + linkText + '</div>' +  
                '   </a>' +  
                '</li>';  
        $('#menu .ic-app-header__menu-list-item').last().before(itemHtml);
        // Add some custom css to the head the first time  
        if (!styleAdded) {  
            $('head').append(iconCSS);  
            styleAdded = true;  
        }         
    } 
$(document).ready(function() {  
addMenuItem('PebblePad', 'https://v3.pebblepad.co.uk/login/bham', '<svg xmlns="http://www.w3.org/2000/svg" class="ic-icon-svg ic-icon svg-icon--portfolio" version="1.1" x="0" y="0" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve"><path d="M49.5,4.8c-25.4,0-46,20.6-46,46c0,25.4,20.6,45.9,46,45.9c12,0,45.9,0,45.9,0s0-32.5,0-45.9C95.3,25.4,74.8,4.8,49.5,4.8z M84.7,85.9c0,0-26,0-35.2,0c-19.4,0-35.2-15.8-35.2-35.2S30,15.5,49.5,15.5s35.2,15.8,35.2,35.2C84.7,61,84.7,85.9,84.7,85.9z M150.5,106c-12,0-45.9,0-45.9,0s0,32.5,0,45.9c0,25.4,20.5,46,45.9,46s46-20.6,46-46C196.6,126.5,175.9,106,150.5,106z M150.5,187.2c-19.4,0-35.2-15.8-35.2-35.2c0-10.4,0-35.2,0-35.2s26,0,35.2,0c19.4,0,35.2,15.8,35.2,35.2S170,187.2,150.5,187.2z M196.6,50.8c0-25.4-20.6-46-46-46s-45.9,20.6-45.9,46c0,12,0,45.9,0,45.9s32.5,0,45.9,0C175.9,96.7,196.6,76.2,196.6,50.8z M115.4,50.8c0-19.4,15.8-35.2,35.2-35.2c19.4,0,35.2,15.8,35.2,35.2S170.1,86,150.7,86c-10.4,0-35.2,0-35.2,0S115.4,60,115.4,50.8z M3.4,151.9c0,25.4,20.6,46,46,46c25.4,0,45.9-20.6,45.9-46c0-12,0-45.9,0-45.9s-32.5,0-45.9,0C24.1,106,3.4,126.5,3.4,151.9z M84.6,151.9c0,19.4-15.8,35.2-35.2,35.2c-19.4,0-35.2-15.8-35.2-35.2s15.8-35.2,35.2-35.2c10.4,0,35.2,0,35.2,0S84.6,142.7,84.6,151.9z"/></svg>', '_blank');  
}); 

// ================================================================================