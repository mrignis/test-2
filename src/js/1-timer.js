// js/1-timer.js

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const userSelectedDate = selectedDates[0];

      if (userSelectedDate < new Date()) {
        document.getElementById('start-btn').disabled = true;
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
      } else {
        document.getElementById('start-btn').disabled = false;
      }
    },
  };

  const dateTimePicker = flatpickr('#datetime-picker', options);

  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

  function updateTimerDisplay(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);

    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }

  function startCountdown() {
    const userSelectedDate = dateTimePicker.selectedDates[0];
    const currentDate = new Date();
    const timeDifference = userSelectedDate - currentDate;

    if (timeDifference <= 0) {
      iziToast.error({
        title: 'Error',
        message: 'Invalid countdown duration',
      });
      return;
    }

    updateTimerDisplay(timeDifference);

    const countdownInterval = setInterval(() => {
      const currentTime = new Date();
      const updatedTimeDifference = userSelectedDate - currentTime;

      if (updatedTimeDifference <= 0) {
        updateTimerDisplay(0);
        clearInterval(countdownInterval);
      } else {
        updateTimerDisplay(updatedTimeDifference);
      }
    }, 1000);
  }

  document
    .getElementById('start-btn')
    .addEventListener('click', startCountdown);

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
});
