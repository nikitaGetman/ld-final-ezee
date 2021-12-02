export function getLineColorByVoltage(_voltage) {
  const voltage = Number(_voltage);
  // eslint-disable-next-line
  const weight = voltage >= 500000 ? 4 : voltage >= 220000 ? 3 : voltage >= 100000 ? 2 : voltage >= 35000 ? 1 : 2;

  return { color: '#50749a', weight, opacity: 0.5 };
}
