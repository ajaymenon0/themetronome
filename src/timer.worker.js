let intervalID = '';

onmessage = function timer(e) {
  const interval = e.data;
  if (interval) {
    intervalID = setInterval(() => { postMessage('tick'); }, interval);
  } else {
    clearInterval(intervalID);
  }
};
