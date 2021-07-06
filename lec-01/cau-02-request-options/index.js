const METHODS = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

function parseRequestOptions(rawOptions = {}) {
  const options = { ...rawOptions };
  if (!options.headers) {
    options.headers = { "Content-Type": "application/json; charset=UTF-8" };
  }

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  return options;
}

function createHttpInstance(config = {}) {
  const http = {
    request(url = "/", options = {}) {
      const reqUrl =
        url.indexOf("http") !== -1 ? url : `${config.endpoint}${url}`;
      const reqInit = parseRequestOptions(options);
      return fetch(reqUrl, reqInit)
        .then((response) => response.json())
        .catch((e) => Promise.reject(e));
    },
    get(url, options = {}) {
      return http.request(url, Object.assign(options, { method: METHODS.Get }));
    },
    post(url, options = {}) {
      return http.request(
        url,
        Object.assign(options, { method: METHODS.Post })
      );
    },
    put(url, options = {}) {
      return http.request(url, Object.assign(options, { method: METHODS.Put }));
    },
    patch(url, options = {}) {
      return http.request(
        url,
        Object.assign(options, { method: METHODS.Patch })
      );
    },
    delete(url, options = {}) {
      return http.request(
        url,
        Object.assign(options, { method: METHODS.Delete })
      );
    },
  };

  return http;
}

function requestData() {
  const http = createHttpInstance({
    endpoint: "https://jsonplaceholder.typicode.com",
  });
  const result = document.getElementById("result");

  http
    .get("/posts/1")
    .then((response) => {
      result.innerHTML = `<p>Result: ${JSON.stringify(response)}`;
    })
    .catch((e) => {
      result.innerHTML = `<p>Error: ${JSON.stringify(e)}`;
    });
}
