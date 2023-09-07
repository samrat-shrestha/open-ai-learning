// JavaScript code to handle adding and removing ingredients

$(document).ready(function () {
  // Function to display or hide the empty message
  function showEmptyMessage() {
    const isEmpty = $("#ingredientList li").length === 0;
    const emptyMessage = $("#ingredientList .empty-message");

    if (isEmpty) {
      if (!emptyMessage.length) {
        $("#ingredientList").append(
          '<li class="list-group-item empty-message">No ingredients found! Please go ahead and add them.</li>'
        );
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
      const existingIngredients = $("#ingredientList li")
        .map(function () {
          return $(this).text().trim().split("Remove")[0]; // Extract the first part (ingredient name)
        })
        .get();

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
    apiKey = $("#apiKey").val().trim(); // Capture and store the API Key
    console.log(apiKey); // Log the API Key value to the console
    if (!apiKey) {
      alert("Please enter an API Key.");
      return;
    }

    const ingredients = $("#ingredientList li")
      .map(function () {
        const text = $(this).text().trim().split(" ")[0];
        if (text) {
          return text.replace(/remove/gi, ""); // Case-insensitive replacement
        }
        return ""; // Handle empty or unexpected format
      })
      .get();

    console.log(ingredients);
    if (ingredients.length === 0) {
      alert("Please add ingredients before generating menus.");
    } else {
      // Prepare the request data in JSON format
      // Show the loading indicator and backdrop
      $("#loadingIndicator").show();
      $("#ingredientContent").hide();

      const requestData = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert chef who is very creative and resourceful. I will provide you with comma-separated lists of ingredients that I currently have and you will use your culinary experience to suggest dishes that I can make with the ingredients. Please provide your suggestions as a bulleted list. For each dish, please include the entire list of ingredients and some cooking instructions. Format your output as an HTML UL with subitems for each dish's title, ingredients, and instructions. Make sure the HTML is valid as I plan to use it directly within a webpage.",
          },
          {
            role: "user",
            content: ingredients.join(", "), // Comma-separated list of ingredients
          },
        ],
        temperature: 1,
        max_tokens: 2777,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      };

      // Send the POST request to the OpenAI API
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Process the response here
          $("#loadingIndicator").hide();
          $("#ingredientContent").show();
          console.log(data); // You can log the response to the console
          // Display the response in a modal dialog or handle it as needed
          // Example: Display the response in the ingredientModal
          $("#ingredientModal .modal-body").html(
            data.choices[0].message.content
          );
          $("#ingredientModal").modal("show");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "An error occurred while making the request. Please try again later."
          );
        });
      // Filter out "Remove" and create a comma-separated list of ingredients
      const ingredientList = ingredients
        .filter((item) => item !== "Remove")
        .join(", ");

      // Display the ingredient list in a modal dialog
      $("#ingredientModal .modal-body").text("Please Wait For Your Menu....");
      $("#ingredientModal").modal("show");
    }
  });

  // Initialize by showing an empty message if needed
  showEmptyMessage();
});
