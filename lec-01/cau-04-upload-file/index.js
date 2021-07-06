const METHODS = {
  Get: "GET",
  Post: "POST",
};

const RESPONSE_TYPES = {
  Json: "json",
  Text: "text",
  Blob: "blob",
};

function isStream(body) {
  return (
    (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
    (typeof FormData !== "undefined" && body instanceof FormData)
  );
}

function parseRequestOptions(rawOptions = {}) {
  const options = { ...rawOptions };
  if (!options.headers) {
    options.headers = { "content-type": "application/json; charset=UTF-8" };
  }

  if (options.body) {
    const stream = isStream(options.body);
    if (stream) {
      options.headers["content-type"] = "multipart/form-data";
    } else {
      options.body = JSON.stringify(options.body);
    }
  }

  return options;
}

function parseResponse(response, options = {}) {
  return new Promise((resolve, reject) => {
    if (response.ok) {
      console.log(options);
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
  };

  return http;
}

function requestData() {
  const http = createHttpInstance({
    endpoint: "https://jsonplaceholder.typicode.com",
  });
  const result = document.getElementById("result");

  const image = document.getElementById("image");
  if (!image || image.files.length === 0) {
    result.innerHTML = "Please select a file";
    return;
  }

  const body = new FormData();
  body.append("image", image.files[0]);
  http
    .post("/posts", { body })
    .then((response) => {
      result.innerHTML = `<p>Result: ${response}`;
    })
    .catch((e) => {
      result.innerHTML = `<p>Error: ${JSON.stringify(e)}`;
    });
}
