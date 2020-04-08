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

  impact.infectionsByRequestedTime = Math.floor(
    impact.currentlyInfected * 2 ** exponent
  );

  severeImpact.infectionsByRequestedTime = Math.floor(
    severeImpact.currentlyInfected * 2 ** exponent
  );

  impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;

  severeImpact.severeCasesByRequestedTime = 0.15 * severeImpact.infectionsByRequestedTime;

  const bedAvailability = 0.35 * data.totalHospitalBeds;

  impact.hospitalBedsByRequestedTime = bedAvailability - impact.severeCasesByRequestedTime;

  severeImpact.hospitalBedsByRequestedTime = bedAvailability
    - severeImpact.severeCasesByRequestedTime;

  impact.casesForICUByRequestedTime = 0.05 * impact.infectionsByRequestedTime;

  severeImpact.casesForICUByRequestedTime = 0.05 * severeImpact.infectionsByRequestedTime;

  impact.casesForVentilatorsByRequestedTime = 0.02 * impact.infectionsByRequestedTime;

  severeImpact.casesForVentilatorsByRequestedTime = 0.02 * severeImpact.infectionsByRequestedTime;

  const majorityEarning = data.region.avgDailyIncomePopulation;
  const avgDailyIncome = data.region.avgDailyIncomeInUSD;

  impact.dollarsInFlight = impact.infectionsByRequestedTime
    * majorityEarning * avgDailyIncome * numberOfDays;

  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime
    * majorityEarning * avgDailyIncome * numberOfDays;

  const result = {
    data,
    impact,
    severeImpact
  };

  return result;
};

export default covid19ImpactEstimator;
