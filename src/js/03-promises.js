import { Notify } from 'notiflix';

const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  const { delay, step, amount } = evt.currentTarget;

  const formData = {
    inputDelay: Number(delay.value),
    inputStep: Number(step.value),
    inputAmount: Number(amount.value),
    positionOfPromise: 1,
  };

  getAmountOfPromises(formData);
  form.reset();
}

function getAmountOfPromises(formData) {
  let { inputDelay, inputStep, inputAmount, positionOfPromise } = formData;

  setInterval(() => {
    if (inputAmount < positionOfPromise) {
      return;
    }

    createPromise(positionOfPromise, inputDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`, {
          timeout: 2000,
        });
        // console.log(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`, {
          timeout: 2000,
        });
        // console.log(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    positionOfPromise += 1;
    inputDelay += inputStep;
  }, inputDelay);
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
