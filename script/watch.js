function markUpdatedCrags () {
  require('./getUpdatedCrags');
}

function updateCrags () {
  require('./updateCrags');
}

// Mark hourly
setInterval(markUpdatedCrags, 1000 * 60 * 60);

// Update Daily
setTimeout(markUpdatedCrags, 1000 * 60 * 60 * 24);