document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector('#divideButton');
  button.addEventListener('click', () => {
      import(
          `./divide`
          /* webpackPrefetch: true */
          /* webpackChunkName: "utilities" */
          )
          .then(divideModule => {
              console.log(divideModule.divide(6, 3)); // 2
          })
  });
});