const masonry_elem = document.querySelector('.masonry');


const msnry = new Masonry(masonry_elem, {
  itemSelector: ".masonry-item",
  columnWidth: ".masonry-spacer",
  horizontalOrder: false,
  stagger: 30,
  gutter: 0
});
// masonry_elem.classList.remove("invisible");
setTimeout(function() {
  msnry.layout()
}, 300); //re-layout when everything loads
