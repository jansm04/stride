const planner = require('./planner');

// generate a training plan based on user input
function generateTrainingPlan(userInput) {
    console.log(userInput);

    const weeks = userInput.weeks;
    const frequency = userInput.frequency;
    const targetTime = userInput.targetTime;
    const firstLongRun = userInput.firstLongRun;
    const longRunDay = userInput.longRunDay;

    const workoutDays = planner.getWorkoutDays(frequency, longRunDay);
    const workoutTypes = planner.getWorkoutTypes(frequency);
    const peakLongRun = planner.getPeakLongRun(targetTime);

    const interval = Math.round((peakLongRun - firstLongRun) / (weeks - 4) * 10) / 10;
    console.log(interval);

    for (let i = 0; i < weeks; i++) {

        console.log(`Week ${i+1}: `);
        
        var longRunDistance = (i < weeks - 3) ? 
            Math.floor(firstLongRun + (interval * i)) : 
            Math.floor((peakLongRun / 3) + (peakLongRun / 5) * (weeks - 1 - i));

        for (let j = 0; j < frequency; j++) {
            var workoutDistance;
            if (workoutTypes[j] == 'long')
                workoutDistance = longRunDistance;
            else if (workoutTypes[j] == 'easy')
                workoutDistance = min(14, Math.round(longRunDistance / 2));
            else
                workoutDistance = min(16, Math.round(longRunDistance / 2.5));
            console.log(` > ${workoutDays[j]}: ${workoutTypes[j]} - ${workoutDistance}k`);
        }
    }

    return { "test": "pass" };
}

module.exports = {
    generateTrainingPlan,
};
  