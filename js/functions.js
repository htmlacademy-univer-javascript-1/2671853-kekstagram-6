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
