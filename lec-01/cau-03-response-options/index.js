const METHODS = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

const RESPONSE_TYPES = {
  Json: "json",
  Text: "text",
  Blob: "blob",
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

function parseResponse(response, options = {}) {
  return new Promise((resolve, reject) => {
    if (response.ok) {
      switch (options.responseType) {
        case RESPONSE_TYPES.Text:
          response.text().then((data) => {
            resolve(data);
          });
          break;
        case RESPONSE_TYPES.Blob:
          resolve.blob().then((data) => {
            resolve(data);
          });
          break;
        default:
          response.json().then((data) => {
            resolve(data);
          });
      }
      return;
    }

    reject(response.statusText);
  });
}

function createHttpInstance(config = {}) {
  const http = {
    request(url = "/", options = {}) {
      const reqUrl =
        url.indexOf("http") !== -1 ? url : `${config.endpoint}${url}`;
      const reqInit = parseRequestOptions(options);
      return fetch(reqUrl, reqInit)
        .then((response) => parseResponse(response, options))
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

  const body = {
    title: "Learn javascript",
    body: "Learn javascript everyday",
  };

  http
    .post("/posts", { body, responseType: RESPONSE_TYPES.Json })
    .then((response) => {
      result.innerHTML = `<p>Result: ${JSON.stringify(response)}`;
    })
    .catch((e) => {
      result.innerHTML = `<p>Error: ${JSON.stringify(e)}`;
    });
}
