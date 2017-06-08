

setTimeout(function() {
  console.log('timeout 1');
  setTimeout(function() {
    console.log(timeout 2);
  }, 400);
}, 500);
