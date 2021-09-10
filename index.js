const inputSearch = document.getElementById("search");

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

function onChange(event) {
  fetch(
    "https://api.github.com/search/repositories?per_page=5&q=" +
      event.target.value
  )
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
    });
}

onChangeDebounce = debounce(onChange, 180);

inputSearch.addEventListener("keyup", onChangeDebounce);
