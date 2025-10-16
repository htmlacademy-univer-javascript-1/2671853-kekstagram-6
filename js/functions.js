function meetingFitsInSchedule(workStart, workEnd, meetingStart, meetingDuration) {
  // Вспомогательная функция: переводит строку "часы:минуты" в минуты с начала дня
  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const workStartMinutes = toMinutes(workStart);
  const workEndMinutes = toMinutes(workEnd);
  const meetingStartMinutes = toMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;

  // Проверяем, что встреча начинается и заканчивается в пределах рабочего дня
  return meetingStartMinutes >= workStartMinutes && meetingEndMinutes <= workEndMinutes;
}

console.log(meetingFitsInSchedule('08:00', '17:30', '14:00', 90)); // true
console.log(meetingFitsInSchedule('8:0', '10:0', '8:0', 120));     // true
console.log(meetingFitsInSchedule('08:00', '14:30', '14:00', 90)); // false
console.log(meetingFitsInSchedule('14:00', '17:30', '08:0', 90));  // false
console.log(meetingFitsInSchedule('8:00', '17:30', '08:00', 900)); // false
