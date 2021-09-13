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

const onSearchButton = () => {
  error.innerHTML = "";
};

const onChange = (event) => {
  if (event.target.value.length === 0) {
    error.innerHTML = "";
    autocompleteContainer.classList.remove("active");
  }
  fetch(
    "https://api.github.com/search/repositories?per_page=5&q=" +
      event.target.value
  )
    .then((res) => res.json())
    .then((response) => {
      const { items } = response;
      if (Array.isArray(items) && items.length === 0) {
        error.style.display = "block";
        error.innerHTML = "Нет такого репозитория";
      } else {
        createAutocompleteList(items);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const createSavedList = (event) => {
  const savedItem = document.createElement("div");
  savedItem.innerHTML = el.name;
  savedItem.classList.add("list-item");
  listContainer.appendChild(savedItem);
};

const createAutocompleteList = (items) => {
  autocompleteContainer.innerHTML = "";
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
  searchList.forEach((el) => {
    const autocompleteItem = document.createElement("span");
    autocompleteItem.innerHTML = el.name;
    autocompleteItem.classList.add("auto-item");
    autocompleteItem.setAttribute("tabindex", "0");
    // autocompleteItem.addEventListener("click", (event) => {});
    // autocompleteItem.addEventListener("keyup"(event));
    autocompleteContainer.appendChild(autocompleteItem);
  });
};

onChangeDebounce = debounce(onChange, 180);

inputSearch.addEventListener("keyup", onChangeDebounce);
inputSearch.addEventListener("search", onSearchButton);
