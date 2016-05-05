## JQuery Client Lab

Build a standalone jQuery client to your Amazon application. The client must consist of only HTML, CSS and Javascript files.

1. Build amazon_client directory with files [index.html, jquery.js, main.js, mustache.min.js, style.css]
2. Link to the files in html

When you open the first page of your application, it must display a listing of all the products. Only display the title of the product as a link with `<hr>` underneath it.

1. Add respond_to method in `index` method in `products_controller.rb` with the necessary attributes selected from @products

```ruby
# index method in products_controller.rb in Rails project

respond_to do |format|
  format.html { render }
  format.json { render json: @products.select(:id, :title, :sale_price) }
end
```

2. Add `gem 'rack-cors', require: 'rack/cors'` to `Gemfile` don't forget to `bundle`

```ruby
# Gemfile

gem 'rack-cors', require: 'rack/cors'
```

```bash
# Terminal

bundle
rails s
```
3. Add to `application.rb` inside the `Application` class

```ruby
# Application class in application.rb in Rails project

config.middleware.insert_before 0, 'Rack::Cors' do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :patch, :delete]
  end
end
```

4. in `main.js` for the client, begin by defining a baseUrl and write code in `$(document).ready()`

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
        // Pass each rendered product and append to #products
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
  format.html { render } # render questions/show.html.erb
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
