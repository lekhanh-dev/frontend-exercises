function createHttpInstance(config = {}) {
  return {
    request(url = "/") {
      const reqUrl =
        url.indexOf("http") !== -1 ? url : `${config.endpoint}${url}`;
      return fetch(reqUrl)
        .then((response) => response.json())
        .catch((e) => Promise.reject(e));
    },
  };
}

function requestData() {
  const result = document.getElementById("result");

  const http = createHttpInstance({
    endpoint: "https://jsonplaceholder.typicode.com",
  });

  http
    .request("/todos")
    .then((response) => {
      result.innerHTML = `<p>Result: ${JSON.stringify(response)}`;
    })
    .catch((e) => {
      result.innerHTML = `<p>Error: ${JSON.stringify(e)}`;
    });
}
