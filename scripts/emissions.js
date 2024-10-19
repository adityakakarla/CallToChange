// https://arxiv.org/pdf/2311.16863.pdf
// https://www.eia.gov/tools/faqs/faq.php?id=74&t=11
// https://cotap.org/donate/

const averageEnergyPerTextCall = 0.047 / 1000;
const averageEnergyPerImageCall = 2.907 / 1000;
const tonsOfEmissionsPerkWh = 0.86 / 2000;
const costPerTonOfEmissions = 15;

function convertEnergyToEmissions(energyConsumed) {
  const emissions = energyConsumed * tonsOfEmissionsPerkWh;
  return emissions;
}

export function convertEmissionsToOffsetCost(emissions) {
  const offsetCost = Math.round(costPerTonOfEmissions * emissions * 100) / 100;
  return offsetCost;
}

export function convertTextCallsToEmissions(textCalls) {
  const energyConsumed = averageEnergyPerTextCall * textCalls;
  const emissions =
    Math.round(convertEnergyToEmissions(energyConsumed) * 10000) / 10000;
  return emissions;
}

export function convertImageCallsToEmissions(imageCalls) {
  const energyConsumed = averageEnergyPerImageCall * imageCalls;
  const emissions =
    Math.round(convertEnergyToEmissions(energyConsumed) * 10000) / 10000;
  return emissions;
}

export function convertTextAndImageCallsToEmissions(textCalls, imageCalls) {
  const imageEmissions = convertImageCallsToEmissions(imageCalls);
  const textEmissions = convertTextCallsToEmissions(textCalls);
  const totalEmissions = imageEmissions + textEmissions;
  return totalEmissions;
}

export function convertTextAndImageCallsToOffsetCost(textCalls, imageCalls) {
  const totalEmissions = convertTextAndImageCallsToEmissions(
    textCalls,
    imageCalls,
  );
  const totalOffsetCost = convertEmissionsToOffsetCost(totalEmissions);
  return totalOffsetCost;
}