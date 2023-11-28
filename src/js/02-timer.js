import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const refs = {
  btnStart: document.querySelector('button[data-start]'),
  daysValue: document.querySelector('span[data-days]'),
  hoursValue: document.querySelector('span[data-hours]'),
  minutesValue: document.querySelector('span[data-minutes]'),
  secondsValue: document.querySelector('span[data-seconds]'),
};

let selectedDate = null;

refs.btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    const currentDate = new Date();
    setupOfSelectedDate(selectedDate, currentDate);
  },
};

flatpickr('#datetime-picker', options);

function setupOfSelectedDate(selectedDate, currentDate) {
  if (selectedDate < currentDate || selectedDate === currentDate) {
    Notify.info('Please choose a date in the future', {
      position: 'center-top',
      timeout: 1500,
      clickToClose: true,
      info: {
        background: '#0B55F6',
      },
    });
    refs.btnStart.disabled = true;

    return;
  }

  refs.btnStart.disabled = false;
}

class Timer {
  constructor({ onTick }) {
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    refs.btnStart.disabled = true;

    if (this.isActive) {
      return;
    }

    let id = setInterval(() => {
      this.isActive = true;
      const finishTime = selectedDate.getTime();
      const currentTime = Date.now();
      const diff = finishTime - currentTime;

      if (diff < 0) {
        clearInterval(id);
        Notify.info('Timer finished 🕑✔', {
          position: 'center-top',
          timeout: 2000,
          clickToClose: true,
          info: {
            background: '#0B55F6',
          },
        });

        refs.btnStart.disabled = false;
        return;
      }

      const time = this.convertMs(diff);
      this.onTick(time);
    }, 1000);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({ onTick: addTimerOnPage });

refs.btnStart.addEventListener('click', timer.start.bind(timer));

function addTimerOnPage({ days, hours, minutes, seconds }) {
  refs.daysValue.textContent = `${days}`;
  refs.hoursValue.textContent = `${hours}`;
  refs.minutesValue.textContent = `${minutes}`;
  refs.secondsValue.textContent = `${seconds}`;
}
