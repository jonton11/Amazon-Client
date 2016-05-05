const BASE = "http://localhost:3000/";

$(document).ready(function() {
  // Display all items on index page
  $.ajax({
    method: "GET",
    url: BASE + "products.json",
    success: function(products) {
      // counter variable for decrementing while loop
      // products from products data passed through
      var counter = products.length;
      // html data from #product-summary
      var template = $('#product-summary').html();
      // parsed template w/ Mustache
      Mustache.parse(template);
      // Decrementing while loop
      while (counter--) {
        // Create render variable w/ Mustache method rendering the products
        var rendered = Mustache.render(template, products[counter]);
        // Pass each rendered product and append to #products
        $("#products").append(rendered);
      }
    },
    error: function() {
      alert("Problem loading products. Please retry");
    }
  });
  
  // Display an individual item when clicked
  $("#products").on("click", "h2 a", function() {
    $.ajax({
      method: "GET",
      url: BASE + "products/" + $(this).data("id") + ".json",
      success: function(product) {
        var template = $("#product-details").html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, product);
        $("#single-product").html(rendered);
        $("#products").fadeOut(500, function() {
          $("#single-product").fadeIn(500);
        });
      },
      error: function() {
        alert("Error loading product. Please try again");
      }
    });
  });

  $('#single-product').click("#back", function() {
    $('#single-product').fadeOut(500, function() {
      $('#products').fadeIn(500);
    });
  });

});
