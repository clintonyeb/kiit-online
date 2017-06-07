console.log(dayToSeconds(3) === 2.592e+8);
console.log(dayToSeconds(1) === 8.64e+7);

function dayToSeconds(days) {
  let _days = days;
  let hrs = days * 24;
  let mins = hrs * 60;
  let sec = mins * 60;
  let mills = sec * 1000;
  return mills;
}
