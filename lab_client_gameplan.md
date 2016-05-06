## JQuery Client Lab

Build a standalone jQuery client to your Amazon application. The client must consist of only HTML, CSS and Javascript files.

1. Build amazon_client directory with files: `index.html`, `jquery.js`, `main.js`, `mustache.min.js`, `style.css`
2. Link to the asset files in `index.html`

When you open the first page of your application, it must display a listing of all the products. Only display the title of the product as a link with `<hr>` underneath it.

Add respond_to method in `index` method in `products_controller.rb` with the necessary attributes selected from `@products`

```ruby
# index method in products_controller.rb in Rails project

respond_to do |format|
  format.html { render }
  # We need to pass the attributes necessary for @products or it will throw an error
  format.json { render json: @products.select(:id, :title, :sale_price) }
end
```

Add `gem 'rack-cors', require: 'rack/cors'` to `Gemfile` don't forget to `bundle`

```ruby
# Gemfile

gem 'rack-cors', require: 'rack/cors'
```

```bash
# Terminal

bundle
rails s
```
Add to `application.rb` inside the `Application` class

```ruby
# Application class in application.rb in Rails project

config.middleware.insert_before 0, 'Rack::Cors' do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :patch, :delete]
  end
end
```

In `index.html`

```html
<!-- index.html - note that this the completed code -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <!-- Require external assets -->
    <link rel="stylesheet" href="style.css" />
    <script src="jquery-2.2.3.min.js"></script>
    <!-- Always include jquery before your own code -->
    <script src="mustache.min.js"></script>
    <script src="main.js"></script>
  </head>
  <body>
    <!-- Give the script an id for simple access in our JavaScript file -->
    <!-- Using mustache.min.js as a template to access JS from our HTMl -->

    <!-- Product summary  -->
    <script id="product-summary" type="x-tmpl-mustache">
    <h2><a href="javascript:void(0);" data-id="{{id}}">{{title}}</a></h2>
    <hr />
    </script>

    <!-- Individual Product Show Page -->
    <div id="products"></div>
    <script id="product-details" type="x-tmpl-mustache">
    // Back button
    <a href="javascript:void(0);" id="back">&lt; Back </a>
    // Attributes of the product
    <h1> {{title}}             </h1>
    <p>  {{description}}       </p>
    <p>  Price: {{price}}      </p>
    <hr />
    </script>

    <!-- Div for all products (index) -->
    <div id="products"></div>
    <!-- Div for single product show -->
    <div id="single-product"></div>
  </body>
</html>

```

In `main.js` for the client, begin by defining a baseUrl and write code in `$(document).ready()`

```js
// main.js

var BASE = "http://localhost:3000/";

$(document).ready(function() {
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
        // Pass each rendered product and append to #products (div)
        $("#products").append(rendered);
      }
    },
    error: function() {
      alert("Problem loading products. Please retry");
    }
  });
});
```

Implement the ability to view the product details when clicking on a product title from the listings view. The details view must contain the product's description and price.

```ruby
# show method in products_controller.rb in Rails project folder

respond_to do |format|
  format.html { render } # render products/show.html.erb
  format.json { render json: @product.to_json }
  format.xml  { render xml: @product.to_xml }
end
```

```html
<!-- index.html -->

<div id="products"></div>
<script id="product-details" type="x-tmpl-mustache">
<a href="javascript:void(0);" id="back">&lt; Back </a>
<h1> {{title}}             </h1>
<p>  {{description}}       </p>
<p>  Price: {{price}}      </p>
<hr />
</script>

<div id="products"></div>
<div id="single-product"></div>
```

```js
// main.js - complete file with stretches already implemented

$("#products").on("click", "h2 a", function() {
  $.ajax({
    method: "GET",
    url: BASE + "products/" + $(this).data("id") + ".json",
    success: function(product) {
      // Grab html element of #product-details
      var template = $("#product-details").html();
      // Parse it w/ Mustache
      Mustache.parse(template);
      // Render and assign var
      var rendered = Mustache.render(template, product);
      $("#single-product").html(rendered);
      // Add to the div with the rendered properties of the html
      $("#products").fadeOut(500, function() {
        // Fade out all the products
        $("#single-product").fadeIn(500);
        // After fading out, fade in the single product
      });
    },
    error: function() {
      alert("Error loading product. Please try again");
    }
  });
});

// Back button
$('#single-product').click("#back", function() {
  // Fade out the single product
  $('#single-product').fadeOut(500, function() {
    // Fade in all the products again
    $('#products').fadeIn(500);
  });
});
```

[Stretch 1]: Make the listing fade out and then the details view fade in.
```js
$("#products").fadeOut(500, function() {
  $("#single-product").fadeIn(500);
});
```
[Stretch 2]: Implement a back button to go from the product details view to the product listings view
```js
$('#single-product').click("#back", function() {
  $('#single-product').fadeOut(500, function() {
    $('#products').fadeIn(500);
  });
});
```

[Stretch 3]: The details page should also contain a listing of all the product reviews underneath.

We need to include the reviews when we render in json

```ruby
# show method in our products controller

format.json { render json: @product.to_json(include: :reviews) }
```

Then loop through the reviews in our `index.html` by creating a loop using the `Mustache` template

```js
// In main.js - Stars implemented fully, courtesy of Jane

// Within our $("#products").on("click") function before the Mustache.render() is called

var reviews = product.reviews;
var i = reviews.length;
while (i--) {
  reviews[i].render_stars = getStars(reviews[i].stars);
}
// console.log(reviews); // for debugging

// External method outside of $(document).ready()

var getStars = function(stars) {
  var renderedStars;
  if (stars === 1) {
    renderedStars = "&#9733;&#9734;&#9734;&#9734;&#9734;";
  } else if (stars === 2) {
    renderedStars = "&#9733;&#9733;&#9734;&#9734;&#9734;";
  } else if (stars === 3) {
    renderedStars = "&#9733;&#9733;&#9733;&#9734;&#9734;";
  } else if (stars === 4) {
    renderedStars = "&#9733;&#9733;&#9733;&#9733;&#9734;";
  } else {
    renderedStars = "&#9733;&#9733;&#9733;&#9733;&#9733;";
  }
  return renderedStars;
};
```

```html
<!-- In our index.html -->

<!-- Within our <script id="product-details" type="x-tmpl-mustache"> -->

<h2> Reviews: </h2>
<!-- Loop through the reviews in Mustache template -->
{{#reviews}}
  <hr />
  <p> {{body}} </p>
  <p> {{{render_stars}}}</p>
<!-- render_stars is an attribute in our reviews hash created when we loop through our reviews.stars in main.js -->
{{/reviews}}
```
