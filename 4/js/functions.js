// Функция для проверки длины строки
function checkStringLength(string, maxLength) {
  return string.length <= maxLength;
}

// Функция для проверки палиндрома
function isPalindrome(string) {
  // Нормализуем строку: убираем пробелы и приводим к нижнему регистру
  const normalizedString = string.replaceAll(' ', '').toLowerCase();

  // Создаем перевернутую строку
  let reversedString = '';

  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }

  // Сравниваем исходную и перевернутую строку
  return normalizedString === reversedString;
}

