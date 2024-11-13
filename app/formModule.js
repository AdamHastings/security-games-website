define(["text!formFields.json"], function (formFieldsData) {
    const formFields = JSON.parse(formFieldsData);

    // Define the fields needed for each distribution type
    const distributionFields = {
        fixed: ['val'],
        normal: ['mean', 'stddev'],
        lognormal: ['mean', 'stddev'],
        truncated_normal: ['mean', 'stddev', 'min', 'max'],
        uniform : ['min', 'max']

    };

    function createForm() {
        const form = document.getElementById("dataForm");
    
        Object.keys(formFields).forEach(fieldId => {
            const field = formFields[fieldId];
            
            // Create details element for collapsible functionality
            const details = document.createElement("details");
            details.className = "form-section";
            // Open by default if needed
            // details.open = true;
            
            // Create summary element (clickable header)
            const summary = document.createElement("summary");
            summary.className = "form-section-header";
            
            // Add heading inside summary
            const heading = document.createElement("h4");
            heading.textContent = formFields[fieldId]['common name'];
            heading.style.display = "inline"; // Keep heading inline with disclosure triangle
            summary.appendChild(heading);
            
            // Create container for the form fields
            const fieldWrapper = document.createElement("div");
            fieldWrapper.id = `wrapper-${fieldId}`;
            fieldWrapper.className = "form-section-content";

            const description = document.createElement("p");
            description.textContent = formFields[fieldId]['description'];
            fieldWrapper.appendChild(description);
            
            // Add the distribution dropdown section
            const label = document.createElement("label");
            label.for = `${fieldId}-distribution`;
            label.textContent = `Distribution: `;
            fieldWrapper.appendChild(label);

            const select = document.createElement("select");
            select.id = `${fieldId}-distribution`;
            select.name = `${fieldId}-distribution`;
    
            // Create options for the dropdown
            formFields[fieldId].constraints.allowed_dists.forEach(dist => {
                const option = document.createElement("option");
                option.value = dist;
                option.textContent = dist;
                option.selected = dist === field.default.distribution;
                select.appendChild(option);
            });
            fieldWrapper.appendChild(select);
    
            // Create container for dynamic fields
            const dynamicFieldsContainer = document.createElement("div");
            dynamicFieldsContainer.id = `dynamic-${fieldId}`;
            fieldWrapper.appendChild(dynamicFieldsContainer);
    
            // Assemble the collapsible section
            details.appendChild(summary);
            details.appendChild(fieldWrapper);
            form.appendChild(details);
    
            // Create initial fields based on default distribution
            createDistributionFields(fieldId, field.default.distribution, field.default, dynamicFieldsContainer);
    
            // Update fields when distribution changes
            select.addEventListener("change", function() {
                const selectedDist = select.value;
                createDistributionFields(fieldId, selectedDist, field.default, dynamicFieldsContainer);
            });
        });
    }

    // Modify the createDistributionFields function to accept dynamicFieldsContainer as a parameter
    function createDistributionFields(fieldId, distribution, defaults, dynamicFieldsContainer) {
        dynamicFieldsContainer.innerHTML = ""; // Clear previous inputs

        // Create input fields based on the selected distribution type
        const fieldsToCreate = distributionFields[distribution] || [];


        // TODO make lognormal defaults log of normal
        
        
        fieldsToCreate.forEach(param => {
            const input = document.createElement("input");
            input.type = "number";
            input.name = `${fieldId}-${param}`;
            input.id = `${fieldId}-${param}`;

            if (distribution == "lognormal") {
                input.value = Math.log(parseFloat(defaults[param])).toFixed(4);
            } else {
                input.value = defaults[param]; // Set default value or empty
            }



            // Create a tooltip element
            const tooltip = document.createElement("span");
            tooltip.className = "tooltip";
            tooltip.textContent = "";  // Text will be set if constraint is violated
            tooltip.style.visibility = "hidden";  // Hidden by default
            tooltip.style.color = "red";
            tooltip.style.fontSize = "12px";
            tooltip.style.marginLeft = "5px";

            // Append tooltip to the dynamic fields container
            dynamicFieldsContainer.appendChild(tooltip); // <-- Append the tooltip here

            const universalConstraints = formFields[fieldId].constraints;

            // Apply constraints if they exist
            if (universalConstraints) {
                const { min, max, step } = universalConstraints;
                if (min !== undefined) input.min = min;
                if (max !== undefined) input.max = max;
                if (step !== undefined) input.step = step; 
                
                if (param == "min") input.max = (parseFloat(max) - parseFloat(input.step)).toFixed(Math.max(1, input.step.toString().length - 2));
                if (param == "max") input.min = (parseFloat(min) + parseFloat(input.step)).toFixed(Math.max(1, input.step.toString().length - 2));
                if (param == "stddev") input.min = parseFloat(input.step);

                input.addEventListener("click", function () {
                    const minBox = document.getElementById(`${fieldId}-min`);
                    const maxBox = document.getElementById(`${fieldId}-max`);
                    const valMin = minBox ? parseFloat(minBox.value) : undefined;
                    const valMax = maxBox ? parseFloat(maxBox.value) : undefined;

                    if (param == "min") {
                        maxBox.min = (parseFloat(input.value) + parseFloat(input.step)).toFixed(Math.max(1, input.step.toString().length - 2));
                    } else if (param == "max") {
                        minBox.max = (parseFloat(input.value) - parseFloat(input.step)).toFixed(Math.max(1, input.step.toString().length - 2));
                    }

                });

                input.addEventListener("input", function () {
                    const minBox = document.getElementById(`${fieldId}-min`);
                    const maxBox = document.getElementById(`${fieldId}-max`);
                    const valMin = minBox ? parseFloat(minBox.value) : undefined;
                    const valMax = maxBox ? parseFloat(maxBox.value) : undefined;

                    if ( valMin != undefined && valMax != undefined  && valMin >= valMax ) {
                        tooltip.textContent = `max must be greater than min`;
                        tooltip.style.visibility = "visible"; // Show the tooltip
                    } else if (input.value < min || input.value > max) {
                        tooltip.textContent = `Value must be between ${min} and ${max}.`;
                        tooltip.style.visibility = "visible"; // Show the tooltip
                    }
                });
                
                input.addEventListener("blur", function () {
                    const value = parseFloat(input.value);

                    const dropdown = document.getElementById(`${fieldId}-distribution`);
                    const selectedValue = dropdown.options[dropdown.selectedIndex].value;

                    const minBox = document.getElementById(`${fieldId}-min`);
                    const maxBox = document.getElementById(`${fieldId}-max`);
                    const valMin = minBox ? parseFloat(minBox.value) : undefined;
                    const valMax = maxBox ? parseFloat(maxBox.value) : undefined;

                    if (isNaN(value)) {
                        input.value = defaults[param]; // Set default value or empty
                    }
                    if (value < input.min ) {
                        input.value = input.min;
                    }
                    if (value > input.max) {
                        input.value = input.max;
                    }
                    if (valMin >= valMax) {
                        if (param == "min") {
                            input.value = minBox.max;
                        }
                        if (param == "max") {
                            input.value = maxBox.min;
                        }
                    }

                    if (param == "min") {
                        maxBox.min = (parseFloat(input.value) + parseFloat(input.step)).toFixed(Math.max(1, input.step.toString().length - 2));
                    } else if (param == "max") {
                        minBox.max = (parseFloat(input.value) - parseFloat(input.step)).toFixed(Math.max(1, input.step.toString().length - 2));
                    }

                    tooltip.style.visibility = "hidden"; // Hide tooltip if corrected
                });

            }

            const paramLabel = document.createElement("label");
            paramLabel.htmlFor = input.name; // Using name instead of id
            paramLabel.textContent = ` ${param}: `;

            dynamicFieldsContainer.appendChild(paramLabel);
            dynamicFieldsContainer.appendChild(input);
            dynamicFieldsContainer.appendChild(tooltip); // Append tooltip after the input
            // dynamicFieldsContainer.appendChild(document.createElement("br"));
        });

    }

    function resetToDefaults() {
        Object.keys(formFields).forEach(fieldID => {
            const field = formFields[fieldID];
            const defaultdist = field.default.distribution;
            const dynamicFieldsContainer = document.getElementById(`dynamic-${fieldID}`);
            createDistributionFields(fieldID, field.default.distribution, field.default, dynamicFieldsContainer);         
        });
    }

    createForm();

    // Add reset functionality
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetToDefaults);




    // Collect form data and submit
    document.getElementById("submitBtn").addEventListener("click", function (e) {
        e.preventDefault();
        const formData = {};
        Object.keys(formFields).forEach(field => {
            const distribution = document.getElementById(`${field}-distribution`);
            const selected = distribution.value;
            
            formData[field] = { };
            formData[field]["distribution"] = selected;
            distributionFields[selected].forEach(param => {
                formData[field][param] = parseFloat(document.getElementById(`${field}-${param}`).value);
            });
        });
        formData['TARGET_SECURITY_SPENDING'] = {}
        formData['TARGET_SECURITY_SPENDING']["distribution"] = "fixed";
        formData['TARGET_SECURITY_SPENDING']["val"] = 0.01;

        formData['MAX_ITERATIONS'] = {}
        formData['MAX_ITERATIONS']["distribution"] = "fixed";
        formData['MAX_ITERATIONS']["val"] = 500;

        formData['NUM_GAMES'] = 1
        formData['verbose'] = true;

        console.log(formData);

        fetch('process_input.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            // Get the iframe element
            var iframe = document.getElementById('iframe-sankey');
            
            // Inject the HTML content into the iframe using srcdoc
            iframe.srcdoc = data.sankeyhtml;  
            console.log(data.logname);
            console.log(data.script_command);
            console.log(data.config_filename);
            console.log(data.sankey_filename);
            console.log(data.command);
            ////
            console.log(data.written_contents);

            var cumulative_iframe = document.getElementById('iframe-cumulative');

            // fixed quotation mark
            const htmlContent = `
            <html>
                <body style="margin:0; padding:0;">
                <img src=figs/apple.png style="width:100%; height:100%; object-fit:contain;">
                </body>
            </html>
            `;

            cumulative_iframe.srcdoc = htmlContent;
            // cumulative_iframe.srcdoc = data.htmlContent;

            console.log(htmlContent);


            // var choices_iframe = document.getElementById('iframe-choices');
            // var canaries_iframe = document.getElementById('iframe-canaries');

            

        })
        .catch(error => {
            console.error('Error:', error);  // Handle errors
        });
    });

});