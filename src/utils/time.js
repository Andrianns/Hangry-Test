function timeToCron(time) {
  const [hour, minute] = time.split(':').map(Number);
  if (
    isNaN(hour) ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error('Invalid time format. Use HH:mm.');
  }
  return `${minute} ${hour} * * *`;
}

module.exports = { timeToCron };
