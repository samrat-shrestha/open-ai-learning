// JavaScript code to handle adding and removing ingredients

$(document).ready(function () {
    // Function to display or hide the empty message
    function showEmptyMessage() {
        const isEmpty = $("#ingredientList li").length === 0;
        const emptyMessage = $("#ingredientList .empty-message");
        
        if (isEmpty) {
            if (!emptyMessage.length) {
                $("#ingredientList").append('<li class="list-group-item empty-message">No ingredients found! Please go ahead and add them.</li>');
            }
        } else {
            emptyMessage.remove();
        }
    }

    // Add Ingredient
    $("#ingredient-form").submit(function (event) {
        event.preventDefault();
        const ingredientName = $("#ingredientName").val().trim();
        
        if (ingredientName !== "") {
            const existingIngredients = $("#ingredientList li").map(function () {
                return $(this).text().trim().split('Remove')[0]; // Extract the first part (ingredient name)
            }).get();
            
            if (!existingIngredients.includes(ingredientName)) {
                const listItem = `<li class="list-group-item">${ingredientName}<button class="btn btn-danger btn-sm float-right delete">Remove</button></li>`;
                $("#ingredientList").append(listItem);
                $("#ingredientName").val(""); // Clear the input field
                showEmptyMessage(); // Check if list is empty and hide/show message
            } else {
                alert("Ingredient already in the list!"); // Display an error message
                $("#ingredientName").val(""); // Clear the input field
            }
        }
    });

    // Remove Ingredient
    $("#ingredientList").on("click", ".delete", function () {
        $(this).closest("li").remove();
        showEmptyMessage(); // Check if list is empty and hide/show message
    });

    // Delete All Ingredients
    $("#deleteAll").click(function () {
        $("#ingredientList").empty();
        showEmptyMessage(); // Check if list is empty and hide/show message
    });

    // Generate Menus
    $("#generateMenus").click(function () {
        const ingredients = $("#ingredientList li").map(function () {
            const text = $(this).text().trim().split(' ')[0];
            if (text) {
                return text.replace(/remove/gi, ''); // Case-insensitive replacement
            }
            return ''; // Handle empty or unexpected format
        }).get();

        if (ingredients.length === 0) {
            alert("Please add ingredients before generating menus.");
        } else {
            // Filter out "Remove" and create a comma-separated list of ingredients
            const ingredientList = ingredients.filter(item => item !== "Remove").join(', ');

            // Display the ingredient list in a modal dialog
            $("#ingredientModal .modal-body").text(ingredientList);
            $("#ingredientModal").modal("show");
        }
    });

    // Initialize by showing an empty message if needed
    showEmptyMessage();
});
