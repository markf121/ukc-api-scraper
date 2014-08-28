var path = require('path');

// Hack to run script code multiple times
function requireAndInvalidate (path) {
  require(path);
  delete require.cache[require.resolve(path)];
}

function markUpdatedCrags () {
  requireAndInvalidate('./getUpdatedCrags');
}

function updateCrags () {
  requireAndInvalidate('./updateCrags');
}

// Mark hourly
setInterval(markUpdatedCrags, 1000 * 60 * 60);

// Update Daily
setTimeout(markUpdatedCrags, 1000 * 60 * 60 * 24);