const inputSearch = document.getElementById("search");
const autocompleteContainer = document.getElementById("autocomplete");
const listContainer = document.getElementById("list");
const error = document.getElementById("error");

const searchList = [];
const savedList = [];

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

const createDOMElement = (tag, params) => {
  const newElement = document.createElement(tag);
  Object.keys(params).forEach((key) => {
    switch (key) {
      case "classList": {
        params.classList.forEach((className) =>
          newElement.classList.add(className)
        );
        break;
      }
      case "for":
      case "style": {
        newElement.setAttribute(key, params[key]);
        break;
      }
      case "children": {
        for (let i = 0; i < params.children.length; i++) {
          newElement.appendChild(params.children[i]);
        }
        break;
      }
      default: {
        newElement[key] = params[key];
        break;
      }
    }
  });
  return newElement;
};

const onSearchButton = () => {
  error.innerHTML = "";
  clearAutocomplete();
};

const clearAutocomplete = () => {
  autocompleteContainer.innerHTML = "";
  autocompleteContainer.classList.remove("active");
};

const onChange = (event) => {
  if (event.target.value.length === 0) {
    clearAutocomplete();
    return;
  }
  error.innerHTML = "";
  fetch(
    "https://api.github.com/search/repositories?per_page=5&q=" +
      event.target.value
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .then((response) => {
      const { items } = response;
      if (Array.isArray(items) && items.length === 0) {
        error.style.display = "block";
        error.innerHTML = "Нет такого репозитория";
        clearAutocomplete();
      } else {
        createAutocompleteList(items);
      }
    })
    .catch((err) => {
      error.style.display = "block";
      error.innerHTML = "Проблема слишком много запросов";
    });
};

const removeListItem = (itemId) => {
  savedList.splice(itemId, 1);
  createSavedList();
};

const createSavedList = () => {
  inputSearch.value = "";
  clearAutocomplete();
  listContainer.innerHTML = "";
  savedList.forEach((el, idx) => {
    const savedItem = createDOMElement("div", {
      classList: ["list-item"],
      children: [
        createDOMElement("div", {
          classList: ["item-props"],
          children: [
            createDOMElement("div", {
              classList: ["item-name"],
              children: [
                createDOMElement("span", {
                  innerText: "Название",
                }),
                createDOMElement("span", {
                  innerText: el.name,
                }),
              ],
            }),
            createDOMElement("div", {
              classList: ["item-owner"],
              children: [
                createDOMElement("span", {
                  innerText: "Владелец",
                }),
                createDOMElement("span", {
                  innerText: el.login,
                }),
              ],
            }),
            createDOMElement("div", {
              classList: ["item-stars"],
              children: [
                createDOMElement("span", {
                  innerText: "Звезд",
                }),
                createDOMElement("span", {
                  innerText: el.stargazers_count,
                }),
              ],
            }),
          ],
        }),
        createDOMElement("div", {
          classList: ["item-trash"],
          onclick: () => removeListItem(idx),
          children: [
            createDOMElement("img", {
              classList: ["trash"],
              src: "./trash.svg",
              alt: "урна",
            }),
          ],
        }),
      ],
    });
    listContainer.appendChild(savedItem);
  });
};

const createAutocompleteEl = () => {
  searchList.forEach((el) => {
    const searchedItem = createDOMElement("span", {
      classList: ["auto-item"],
      innerHTML: el.name,
      tabIndex: "0",
      onclick: (event) => {
        savedList.push(el);
        createSavedList(event);
      },
      onkeyup: (event) => {
        if (event.keyCode === 13) {
          savedList.push(el);
          createSavedList(event);
        }
      },
    });
    autocompleteContainer.appendChild(searchedItem);
  });
};

const createAutocompleteList = (items) => {
  clearAutocomplete();
  searchList.length = 0;
  items.forEach((item) => {
    const {
      name,
      owner: { login },
      stargazers_count,
    } = item;

    searchList.push({
      name,
      login,
      stargazers_count,
    });
  });

  autocompleteContainer.classList.add("active");
  inputSearch.insertAdjacentElement("afterend", autocompleteContainer);
  createAutocompleteEl();
};

const onChangeDebounce = debounce(onChange, 180);

inputSearch.addEventListener("keyup", onChangeDebounce);
inputSearch.addEventListener("search", onSearchButton);
