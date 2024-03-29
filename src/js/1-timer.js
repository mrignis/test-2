// js/1-timer.js

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const datetimePicker = flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const userSelectedDate = selectedDates[0];

      const startButton = document.getElementById('start-btn');
      if (userSelectedDate < new Date()) {
        startButton.disabled = true;
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
      } else {
        startButton.disabled = false;
      }
    },
  });

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
    const userSelectedDate = datetimePicker.selectedDates[0];
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
