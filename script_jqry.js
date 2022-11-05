//Discount Code In Jquery



$(document).ready(function () {
  $("#btn-click-me").click(function () {
    $(".click-me").slideToggle("slow");
    alert("The Secret Code Word Is CODE.");
  });
});

$(document).ready(function () {
  $("#btn-click-me").click(function () {
    $(".h1-discount").css("color", "#e844d8");
    $(".h1-discount").fadeOut(3000);
    $(".h1-discount").fadeIn(3000);
  });
});
$(document).ready(function () {
  $("#btn-click-me").click(function () {
    $("#btn-click-me").show("slow");
  });
});
$(document).ready(function () {
  $("#btn-click-me").click(function () {
    $("#btn-click-me").hide("slow");
  });
});



//Do You Want To Be Notified

$(document).ready(function () {
  $("select")
    .change(function () {
      $(this)
        .find("option:selected")
        .each(function () {
          let optionValue = $(this).attr("value");
          if (optionValue) {
            $(".box")
              .not("." + optionValue)
              .hide();
            $("." + optionValue).show();
          } else {
            $(".box").hide();
          }
        });
    })
    .change();
});

/*Hover Effect*/

$("Select").hover(function () {
  $(this).css("background-color", "lightgrey");
}, function () {
  $(this).css("background-color", "#e844d8");
});