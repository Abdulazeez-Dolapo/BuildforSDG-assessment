const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  let numberOfDays;
  if (data.periodType === 'days') {
    numberOfDays = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    numberOfDays = 7 * data.timeToElapse;
  }
  if (data.periodType === 'months') {
    numberOfDays = 30 * data.timeToElapse;
  }

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const exponent = Math.floor(numberOfDays / 3);

  const infections = impact.currentlyInfected * (2 ** exponent);
  const sInfections = severeImpact.currentlyInfected * (2 ** exponent);

  const severeCases = 0.15 * infections;
  const sSevereCases = 0.15 * sInfections;

  const bedAvailability = 0.35 * data.totalHospitalBeds;

  const icu = 0.05 * infections;
  const sIcu = 0.05 * sInfections;

  const ventilators = 0.02 * infections;
  const sVentilators = 0.02 * infections;

  impact.infectionsByRequestedTime = Math.floor(
    impact.currentlyInfected * (2 ** exponent)
  );
  severeImpact.infectionsByRequestedTime = Math.floor(
    severeImpact.currentlyInfected * (2 ** exponent)
  );

  impact.severeCasesByRequestedTime = Math.floor(severeCases);
  severeImpact.severeCasesByRequestedTime = Math.floor(sSevereCases);

  impact.hospitalBedsByRequestedTime = Math.floor(bedAvailability - severeCases);
  severeImpact.hospitalBedsByRequestedTime = Math.floor(bedAvailability - sSevereCases);

  impact.casesForICUByRequestedTime = Math.floor(icu);
  severeImpact.casesForICUByRequestedTime = Math.floor(sIcu);

  impact.casesForVentilatorsByRequestedTime = Math.floor(ventilators);
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(sVentilators);

  const majorityEarning = data.region.avgDailyIncomePopulation;
  const avgDailyIncome = data.region.avgDailyIncomeInUSD;

  impact.dollarsInFlight = (impact.infectionsByRequestedTime
    * majorityEarning * avgDailyIncome * numberOfDays).toFixed(2);

  severeImpact.dollarsInFlight = (severeImpact.infectionsByRequestedTime
    * majorityEarning * avgDailyIncome * numberOfDays).toFixed(2);

  const result = {
    data,
    impact,
    severeImpact
  };

  return result;
};

export default covid19ImpactEstimator;
